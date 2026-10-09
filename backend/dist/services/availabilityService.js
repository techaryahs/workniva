"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAvailabilityService = void 0;
const database_1 = require("../config/database");
const checkAvailabilityService = async (date, startTime, durationMinutes, workspace, guests) => {
    const startHour = parseInt(startTime);
    const endHour = startHour + (durationMinutes / 60);
    const end_time = `${endHour.toString().padStart(2, '0')}:00:00`;
    const start_time = `${startTime}:00:00`;
    // Fetch all active bookings for this date that overlap
    const { data: bookings, error } = await database_1.supabase
        .from('bookings')
        .select('*')
        .eq('date', date)
        .neq('status', 'cancelled');
    if (error)
        throw error;
    // Function to check overlap
    const isOverlapping = (b) => {
        const b_startHour = parseInt(b.start_time.split(':')[0]);
        const b_endHour = parseInt(b.end_time.split(':')[0]) || 24;
        const currentEndHour = endHour;
        return b_startHour < currentEndHour && b_endHour > startHour;
    };
    const overlappingBookings = bookings.filter(isOverlapping);
    if (overlappingBookings.some(b => b.resource_type === 'whole-night')) {
        return { available: false, message: 'The entire office is booked for this time.' };
    }
    if (workspace === 'whole-night') {
        if (overlappingBookings.length > 0) {
            return { available: false, message: 'Cannot book the whole office; some spaces are already reserved.' };
        }
        return { available: true };
    }
    if (workspace === 'conference-room') {
        if (guests > 6)
            return { available: false, message: 'Maximum capacity is 6 people.' };
        const confBooked = overlappingBookings.some(b => b.resource_type === 'conference-room');
        if (confBooked)
            return { available: false, message: 'Conference room is already booked.' };
        return { available: true, resource_id: 'conf-1' };
    }
    if (workspace === 'bench-seating') {
        const benchBookings = overlappingBookings.filter(b => b.resource_type === 'bench-seating');
        let maxOverlapGuests = 0;
        for (let h = startHour; h < endHour; h++) {
            const guestsAtH = benchBookings.reduce((sum, b) => {
                const b_start = parseInt(b.start_time.split(':')[0]);
                const b_end = parseInt(b.end_time.split(':')[0]) || 24;
                if (b_start <= h && b_end > h)
                    return sum + b.guest_count;
                return sum;
            }, 0);
            if (guestsAtH > maxOverlapGuests)
                maxOverlapGuests = guestsAtH;
        }
        if (maxOverlapGuests + guests > 8) {
            return { available: false, message: `Only ${8 - maxOverlapGuests} bench seats available.` };
        }
        return { available: true, resource_id: 'bench' };
    }
    if (workspace === 'private-cabin') {
        if (guests > 5)
            return { available: false, message: 'Maximum capacity is 5 people per cabin.' };
        const cabinBookings = overlappingBookings.filter(b => b.resource_type === 'private-cabin');
        const bookedCabinIds = new Set(cabinBookings.map(b => b.resource_id));
        const allCabins = ['cabin-1', 'cabin-2', 'cabin-3'];
        const availableCabins = allCabins.filter(c => !bookedCabinIds.has(c));
        if (availableCabins.length === 0) {
            return { available: false, message: 'All private cabins are booked for this time.' };
        }
        return { available: true, resource_id: availableCabins[0] };
    }
    return { available: false, message: 'Unknown workspace type.' };
};
exports.checkAvailabilityService = checkAvailabilityService;
