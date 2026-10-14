import { supabase } from '../config/database';

export const expireStalePendingBookings = async () => {
  try {
    // 15-minute validity window for pending reservations
    const expirationThresholdMinutes = 15;
    const expirationTime = new Date(Date.now() - expirationThresholdMinutes * 60 * 1000).toISOString();

    const { data: expiredBookings, error } = await supabase
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
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .in('booking_id', expiredIds)
        .eq('status', 'created');
    }
  } catch (err: any) {
    console.error('[CRON] Error during stale booking cleanup:', err.message);
  }
};

export const startCronJobs = () => {
  // 1. Run once immediately on startup
  expireStalePendingBookings().catch(console.error);

  // 2. Schedule recurring cleanup every 5 minutes
  setInterval(expireStalePendingBookings, 5 * 60 * 1000);
};
