"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBookingService = exports.getBookingByIdService = exports.getMyBookingsService = exports.createBookingService = void 0;
const database_1 = require("../config/database");
const createBookingService = async (userId, bookingData) => {
    const dateStr = bookingData.date.replace(/-/g, '');
    const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const booking_code = `RO-${dateStr}-${randomStr}`;
    let duration_minutes = 60;
    if (bookingData.duration.includes('Hour'))
        duration_minutes = parseInt(bookingData.duration) * 60;
    if (bookingData.duration === 'Half Day')
        duration_minutes = 240;
    if (bookingData.duration === 'Full Day' || bookingData.duration === 'Night')
        duration_minutes = 480;
    // We should verify pricing from DB, but for now we trust or calculate it.
    // Actually, we'll fetch pricing from DB to be secure.
    const { data: pricingData, error: priceError } = await database_1.supabase
        .from('pricing')
        .select('price')
        .eq('name', bookingData.duration)
        .single();
    if (priceError || !pricingData) {
        throw new Error('Invalid pricing or duration selected');
    }
    const amount = pricingData.price;
    const startHour = parseInt(bookingData.startTime);
    const endHour = startHour + (duration_minutes / 60);
    const end_time = `${endHour.toString().padStart(2, '0')}:00:00`;
    const start_time = `${bookingData.startTime}:00:00`;
    const { data, error } = await database_1.supabase.from('bookings').insert({
        booking_code,
        user_id: userId,
        date: bookingData.date,
        start_time,
        end_time,
        duration_minutes,
        guest_count: bookingData.guests,
        purpose: bookingData.purpose,
        special_requirements: bookingData.specialRequirements,
        amount,
        status: 'confirmed',
    }).select('*, profiles(*)').single();
    if (error) {
        if (error.message.includes('overlapping') || error.code === '23P01') {
            throw new Error("This time slot is no longer available.");
        }
        throw new Error(error.message);
    }
    return data;
};
exports.createBookingService = createBookingService;
const getMyBookingsService = async (userId) => {
    const { data, error } = await database_1.supabase
        .from('bookings')
        .select('*, profiles(*)')
        .eq('user_id', userId)
        .order('date', { ascending: false });
    if (error)
        throw error;
    return data;
};
exports.getMyBookingsService = getMyBookingsService;
const getBookingByIdService = async (userId, bookingId) => {
    const { data, error } = await database_1.supabase
        .from('bookings')
        .select('*, profiles(*)')
        .eq('id', bookingId)
        .eq('user_id', userId)
        .single();
    if (error)
        throw new Error('Booking not found');
    return data;
};
exports.getBookingByIdService = getBookingByIdService;
const cancelBookingService = async (userId, bookingId) => {
    const { data, error } = await database_1.supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', userId)
        .select('*, profiles(*)')
        .single();
    if (error)
        throw error;
    return data;
};
exports.cancelBookingService = cancelBookingService;
//# sourceMappingURL=bookingService.js.map