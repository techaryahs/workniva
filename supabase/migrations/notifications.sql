-- Add notifications and webhook_events tables
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload JSONB,
  status TEXT DEFAULT 'processed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('booking_confirmed', 'payment_pending', 'payment_failed', 'booking_cancelled', 'admin_new_booking')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  provider_message_id TEXT,
  recipient TEXT NOT NULL,
  subject TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

CREATE TRIGGER notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all notifications" ON notifications FOR SELECT USING (is_admin());
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can read webhook events" ON webhook_events FOR SELECT USING (is_admin());
