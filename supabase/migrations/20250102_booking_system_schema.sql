-- Create Services table (Products)
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  requires_prepayment BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create Working Hours table (Schedule)
CREATE TABLE working_hours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  is_open BOOLEAN DEFAULT TRUE,
  open_time TIME DEFAULT '12:00',
  close_time TIME DEFAULT '17:00',
  break_start TIME,
  break_end TIME,
  UNIQUE(day_of_week)
);

-- Create Schedule Exceptions table (Holidays/Custom days)
CREATE TABLE schedule_exceptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  is_closed BOOLEAN DEFAULT TRUE,
  open_time TIME,
  close_time TIME,
  note TEXT
);

-- Create Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  service_id UUID REFERENCES services(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  
  -- Customer Info
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  comment TEXT,
  
  -- Statuses
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
  payment_id TEXT -- External Payment ID (Monobank invoiceId)
);

-- Create Global Settings table (Capacity, etc.)
CREATE TABLE booking_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT
);

-- Insert default settings
INSERT INTO booking_settings (key, value, description) VALUES
('max_capacity', '15', 'Maximum number of guests allowed in the shelter at the same time'),
('booking_gap_minutes', '0', 'Gap between bookings in minutes');

-- Insert default working hours (Mon-Sun 12:00-17:00)
INSERT INTO working_hours (day_of_week, is_open, open_time, close_time) VALUES
(0, true, '12:00', '17:00'), -- Sun
(1, true, '12:00', '17:00'), -- Mon
(2, true, '12:00', '17:00'), -- Tue
(3, true, '12:00', '17:00'), -- Wed
(4, true, '12:00', '17:00'), -- Thu
(5, true, '12:00', '17:00'), -- Fri
(6, true, '12:00', '17:00'); -- Sat

-- RLS POLICIES

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_settings ENABLE ROW LEVEL SECURITY;

-- 1. Services: Public read, Admin write
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

-- 2. Working Hours: Public read, Admin write
CREATE POLICY "Public can view schedule" ON working_hours FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage schedule" ON working_hours FOR ALL USING (auth.role() = 'authenticated');

-- 3. Exceptions: Public read, Admin write
CREATE POLICY "Public can view exceptions" ON schedule_exceptions FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage exceptions" ON schedule_exceptions FOR ALL USING (auth.role() = 'authenticated');

-- 4. Bookings: 
-- Public can INSERT (create booking)
CREATE POLICY "Public can create bookings" ON bookings FOR INSERT WITH CHECK (true);
-- Public can VIEW their own booking (by ID, practically handled by backend logic usually, but here strict)
-- For now, let's allow public to read nothing (security), only API/Admin reads. 
-- Wait, to show "busy slots", we need to read bookings. But we shouldn't expose customer data.
-- Best practice: Create a Postgres Function `get_available_slots` to hide raw data.
-- For simplicity in MVP: Allow reading only `booking_date`, `booking_time`, `guests_count` for public.
-- But Supabase RLS is row-level, not column-level easily without views.
-- Let's create a VIEW for availability.

-- Admins can do everything
CREATE POLICY "Admins can manage bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');

-- 5. Settings: Public read (capacity), Admin write
CREATE POLICY "Public can view settings" ON booking_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage settings" ON booking_settings FOR ALL USING (auth.role() = 'authenticated');
