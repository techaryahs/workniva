"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = void 0;
const database_1 = require("../config/database");
// Runs every 15 minutes to clear out pending_payment bookings older than 15 minutes
const startCronJobs = () => {
    setInterval(async () => {
        try {
            const expirationTime = new Date(Date.now() - 15 * 60 * 1000).toISOString();
            const { data, error } = await database_1.supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('status', 'pending_payment')
                .lt('created_at', expirationTime)
                .select('id');
            if (error) {
                console.error('Error expiring pending bookings:', error);
            }
            else if (data && data.length > 0) {
                console.log(`Expired ${data.length} pending_payment bookings.`);
            }
        }
        catch (e) {
            console.error('Cron job error:', e);
        }
    }, 15 * 60 * 1000);
};
exports.startCronJobs = startCronJobs;
