"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAvailabilityService = void 0;
const database_1 = require("../config/database");
const checkAvailabilityService = async (date, startTime, durationMinutes) => {
    // Using the RPC from Phase 5A
    const { data, error } = await database_1.supabase.rpc('check_availability', {
        p_date: date,
        p_start_time: `${startTime}:00`
    });
    if (error) {
        throw new Error('Could not check availability. Please try again.');
    }
    return { available: data, message: data ? '' : 'This slot is already taken.' };
};
exports.checkAvailabilityService = checkAvailabilityService;
//# sourceMappingURL=availabilityService.js.map