"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminCustomersService = exports.unblockTimeService = exports.blockTimeService = exports.getBlockedTimesService = exports.updatePricingService = exports.getPricingService = exports.updateBookingStatusService = exports.getAdminBookingsService = void 0;
const database_1 = require("../config/database");
const getAdminBookingsService = async () => {
    const { data, error } = await database_1.supabase.from('bookings').select('*, profiles(*)').order('date', { ascending: false });
    if (error)
        throw error;
    return data;
};
exports.getAdminBookingsService = getAdminBookingsService;
const updateBookingStatusService = async (id, status) => {
    const { data, error } = await database_1.supabase.from('bookings').update({ status: status.toLowerCase() }).eq('id', id).select('*, profiles(*)').single();
    if (error)
        throw error;
    return data;
};
exports.updateBookingStatusService = updateBookingStatusService;
const getPricingService = async () => {
    const { data, error } = await database_1.supabase.from('pricing').select('*').order('duration_minutes', { ascending: true });
    if (error)
        throw error;
    return data;
};
exports.getPricingService = getPricingService;
const updatePricingService = async (id, updates) => {
    const mappedUpdates = {};
    if (updates.price !== undefined)
        mappedUpdates.price = updates.price;
    if (updates.isActive !== undefined)
        mappedUpdates.active = updates.isActive;
    const { error } = await database_1.supabase.from('pricing').update(mappedUpdates).eq('id', id);
    if (error)
        throw error;
};
exports.updatePricingService = updatePricingService;
const getBlockedTimesService = async () => {
    const { data, error } = await database_1.supabase.from('blocked_slots').select('*');
    if (error)
        throw error;
    return data;
};
exports.getBlockedTimesService = getBlockedTimesService;
const blockTimeService = async (userId, blocked) => {
    const { data, error } = await database_1.supabase.from('blocked_slots').insert({
        date: blocked.date,
        start_time: `${blocked.startTime}:00`,
        end_time: `${blocked.endTime}:00`,
        reason: blocked.reason,
        created_by: userId
    }).select('*').single();
    if (error) {
        if (error.message.includes('overlapping') || error.code === '23P01') {
            throw new Error("This slot conflicts with an existing booking or block.");
        }
        throw error;
    }
    return data;
};
exports.blockTimeService = blockTimeService;
const unblockTimeService = async (id) => {
    const { error } = await database_1.supabase.from('blocked_slots').delete().eq('id', id);
    if (error)
        throw error;
};
exports.unblockTimeService = unblockTimeService;
const getAdminCustomersService = async () => {
    const bookings = await (0, exports.getAdminBookingsService)();
    const customersMap = new Map();
    bookings.forEach(b => {
        const key = b.profiles.email;
        if (customersMap.has(key)) {
            const existing = customersMap.get(key);
            existing.totalBookings += 1;
            existing.totalSpent += Number(b.amount);
            if (new Date(b.date) > new Date(existing.lastBooking)) {
                existing.lastBooking = b.date;
            }
        }
        else {
            customersMap.set(key, {
                id: `cust-${key}`,
                name: b.profiles.full_name,
                email: b.profiles.email,
                phone: b.profiles.phone,
                company: b.profiles.company,
                totalBookings: 1,
                totalSpent: Number(b.amount),
                lastBooking: b.date,
                status: 'Active'
            });
        }
    });
    return Array.from(customersMap.values());
};
exports.getAdminCustomersService = getAdminCustomersService;
//# sourceMappingURL=adminService.js.map