-- WorkNiva Production Performance & Security Optimization Migration
-- Run this in the Supabase Dashboard SQL Editor for optimal query execution in production.

-- 1. Bookings Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON public.bookings(date, status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_code ON public.bookings(booking_code);
CREATE INDEX IF NOT EXISTS idx_bookings_pending_cleanup ON public.bookings(status, created_at) WHERE status = 'pending_payment';

-- 2. Payments Indexes
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_order_id ON public.payments(provider_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 3. Notifications & Webhook Event Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_booking_id ON public.notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_idempotency ON public.notifications(booking_id, type, channel);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events(event_id);

-- 4. Enable RLS and verify policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- 5. Verify constraints
COMMENT ON TABLE public.payments IS 'Stores all Razorpay payment records and statuses';
COMMENT ON TABLE public.webhook_events IS 'Stores idempotency records for Razorpay webhook dispatches';
