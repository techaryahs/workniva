-- RentOffice Supabase Schema
-- Run this in the Supabase SQL Editor

-- 1. Enable pgcrypto for UUIDs (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Enable btree_gist for overlap exclusion constraints
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pricing Table
CREATE TABLE pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial pricing
INSERT INTO pricing (name, duration_minutes, price) VALUES
('1 Hour', 60, 25),
('2 Hours', 120, 50),
('3 Hours', 180, 75),
('4 Hours', 240, 100),
('Half Day', 240, 80),
('Full Day', 480, 140),
('Night', 480, 100);

-- 4. Bookings Table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  purpose TEXT NOT NULL,
  special_requirements TEXT,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent overlapping bookings for confirmed/pending/completed
  -- Using an exclusion constraint.
  -- We cast date + time to timestamp to check overlaps.
  -- Only enforce this when status is not cancelled.
  EXCLUDE USING gist (
    (date + start_time) WITH &&,
    (date + end_time) WITH &&
  ) WHERE (status != 'cancelled')
);

-- 5. Blocked Slots Table
CREATE TABLE blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent overlapping blocked slots
  EXCLUDE USING gist (
    (date + start_time) WITH &&,
    (date + end_time) WITH &&
  )
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER pricing_updated_at BEFORE UPDATE ON pricing FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER blocked_slots_updated_at BEFORE UPDATE ON blocked_slots FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Disable RLS initially to set it up properly
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS: Profiles
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert profiles" ON profiles FOR INSERT WITH CHECK (is_admin());
-- Auth hook to insert profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS: Pricing
CREATE POLICY "Anyone can read pricing" ON pricing FOR SELECT USING (true);
CREATE POLICY "Admins can insert pricing" ON pricing FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update pricing" ON pricing FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete pricing" ON pricing FOR DELETE USING (is_admin());

-- RLS: Bookings
CREATE POLICY "Users can insert own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings (e.g. cancel)" ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all bookings" ON bookings FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all bookings" ON bookings FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can insert any bookings" ON bookings FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can delete bookings" ON bookings FOR DELETE USING (is_admin());

-- RLS: Blocked Slots
-- Customers can read blocked slots to check availability
CREATE POLICY "Anyone can read blocked slots" ON blocked_slots FOR SELECT USING (true);
CREATE POLICY "Admins can insert blocked slots" ON blocked_slots FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update blocked slots" ON blocked_slots FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete blocked slots" ON blocked_slots FOR DELETE USING (is_admin());

-- Helper function to check availability securely (bypass RLS)
CREATE OR REPLACE FUNCTION check_availability(p_date DATE, p_start_time TIME)
RETURNS BOOLEAN AS $$
DECLARE
  is_available BOOLEAN;
BEGIN
  -- Simple check: does any booking or blocked slot overlap the hour?
  SELECT NOT EXISTS (
    SELECT 1 FROM bookings 
    WHERE date = p_date 
      AND status != 'cancelled'
      AND start_time <= p_start_time 
      AND end_time > p_start_time
    UNION ALL
    SELECT 1 FROM blocked_slots
    WHERE date = p_date
      AND start_time <= p_start_time
      AND end_time > p_start_time
  ) INTO is_available;
  
  RETURN is_available;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
