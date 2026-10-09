const { supabase } = require('./dist/config/database');
async function run() {
  const { data, error } = await supabase.from('bookings').insert({
    booking_code: 'TEST-123',
    user_id: '1e19d6eb-9562-4309-90b5-1d017ab4dbdf',
    date: '2026-10-10',
    start_time: '10:00',
    end_time: '11:00',
    duration_minutes: 60,
    guest_count: 1,
    purpose: 'Test',
    amount: 100
  });
  console.log(error || data);
}
run();
