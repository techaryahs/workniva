-- 1. Add resource columns to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS resource_type TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS resource_id TEXT;

-- 2. Drop existing global overlap constraints dynamically
DO $$
DECLARE
    rec record;
BEGIN
    FOR rec IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'bookings'::regclass AND contype = 'x'
    LOOP
        EXECUTE 'ALTER TABLE bookings DROP CONSTRAINT ' || quote_ident(rec.conname);
    END LOOP;
END;
$$;

-- 3. We implement concurrency check using a PL/pgSQL function instead of EXCLUDE USING gist
-- because we have complex overlapping logic (Whole night blocks everything, bench is summed).
CREATE OR REPLACE FUNCTION check_and_insert_booking(
  p_booking_code TEXT,
  p_user_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME,
  p_duration_minutes INTEGER,
  p_guest_count INTEGER,
  p_purpose TEXT,
  p_special_requirements TEXT,
  p_amount NUMERIC,
  p_resource_type TEXT,
  p_resource_id TEXT
) RETURNS JSON AS $$
DECLARE
  v_booking_record RECORD;
  v_overlap_guests INTEGER;
  v_start_ts TIMESTAMP;
  v_end_ts TIMESTAMP;
BEGIN
  v_start_ts := p_date + p_start_time;
  v_end_ts := p_date + p_end_time;
  
  -- Handle overnight end time crossing midnight
  IF p_end_time <= p_start_time THEN
    v_end_ts := v_end_ts + interval '1 day';
  END IF;

  -- Lock bookings for concurrency safety
  LOCK TABLE bookings IN EXCLUSIVE MODE;

  -- A. Check if ANY whole-night booking overlaps this interval
  IF EXISTS (
    SELECT 1 FROM bookings 
    WHERE status != 'cancelled' 
      AND resource_type = 'whole-night'
      AND (
        (date + start_time) < v_end_ts 
        AND 
        (date + end_time + CASE WHEN end_time <= start_time THEN interval '1 day' ELSE interval '0' END) > v_start_ts
      )
  ) THEN
    RAISE EXCEPTION 'This time overlaps with a whole-office booking.';
  END IF;

  -- B. If THIS is a whole-night booking, check if ANY other booking exists in this interval
  IF p_resource_type = 'whole-night' THEN
    IF EXISTS (
      SELECT 1 FROM bookings 
      WHERE status != 'cancelled' 
        AND (
          (date + start_time) < v_end_ts 
          AND 
          (date + end_time + CASE WHEN end_time <= start_time THEN interval '1 day' ELSE interval '0' END) > v_start_ts
        )
    ) THEN
      RAISE EXCEPTION 'Cannot book whole office because individual resources are already booked.';
    END IF;
  END IF;

  -- C. Check cabin or conference overlap
  IF p_resource_type IN ('private-cabin', 'conference-room') THEN
    IF EXISTS (
      SELECT 1 FROM bookings 
      WHERE status != 'cancelled' 
        AND resource_id = p_resource_id
        AND (
          (date + start_time) < v_end_ts 
          AND 
          (date + end_time + CASE WHEN end_time <= start_time THEN interval '1 day' ELSE interval '0' END) > v_start_ts
        )
    ) THEN
      RAISE EXCEPTION 'This resource is already booked for the selected time.';
    END IF;
  END IF;

  -- D. Check bench seating capacity
  IF p_resource_type = 'bench-seating' THEN
    SELECT COALESCE(SUM(guest_count), 0) INTO v_overlap_guests
    FROM bookings
    WHERE status != 'cancelled'
      AND resource_type = 'bench-seating'
      AND (
          (date + start_time) < v_end_ts 
          AND 
          (date + end_time + CASE WHEN end_time <= start_time THEN interval '1 day' ELSE interval '0' END) > v_start_ts
        );
      
    IF v_overlap_guests + p_guest_count > 8 THEN
      RAISE EXCEPTION 'Not enough bench seats available for the selected time.';
    END IF;
  END IF;

  -- Insert
  INSERT INTO bookings (
    booking_code, user_id, date, start_time, end_time, 
    duration_minutes, guest_count, purpose, special_requirements, amount, status,
    resource_type, resource_id
  ) VALUES (
    p_booking_code, p_user_id, p_date, p_start_time, p_end_time,
    p_duration_minutes, p_guest_count, p_purpose, p_special_requirements, p_amount, 'pending_payment',
    p_resource_type, p_resource_id
  ) RETURNING * INTO v_booking_record;

  RETURN row_to_json(v_booking_record);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
