"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = exports.expireStalePendingBookings = void 0;
const database_1 = require("../config/database");
const expireStalePendingBookings = async () => {
    try {
        // 15-minute validity window for pending reservations
        const expirationThresholdMinutes = 15;
        const expirationTime = new Date(Date.now() - expirationThresholdMinutes * 60 * 1000).toISOString();
        const { data: expiredBookings, error } = await database_1.supabase
            .from('bookings')
            .update({
            status: 'cancelled',
            updated_at: new Date().toISOString()
        })
            .eq('status', 'pending_payment')
            .lt('created_at', expirationTime)
            .select('id, booking_code');
        if (error) {
            console.error('[CRON] Error expiring pending bookings:', error.message);
            return;
        }
        if (expiredBookings && expiredBookings.length > 0) {
            console.log(`[CRON] Expired ${expiredBookings.length} abandoned pending_payment reservation(s).`);
            const expiredIds = expiredBookings.map(b => b.id);
            // Update any associated created payments to failed
            await database_1.supabase
                .from('payments')
                .update({
                status: 'failed',
                updated_at: new Date().toISOString()
            })
                .in('booking_id', expiredIds)
                .eq('status', 'created');
        }
    }
    catch (err) {
        console.error('[CRON] Error during stale booking cleanup:', err.message);
    }
};
exports.expireStalePendingBookings = expireStalePendingBookings;
const startCronJobs = () => {
    // 1. Run once immediately on startup
    (0, exports.expireStalePendingBookings)().catch(console.error);
    // 2. Schedule recurring cleanup every 5 minutes
    setInterval(exports.expireStalePendingBookings, 5 * 60 * 1000);
};
exports.startCronJobs = startCronJobs;
