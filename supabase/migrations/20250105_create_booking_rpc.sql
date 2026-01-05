-- Create a secure function to handle booking creation bypassing RLS
CREATE OR REPLACE FUNCTION create_booking(
  p_service_id UUID,
  p_booking_date DATE,
  p_booking_time TIME,
  p_guests_count INTEGER,
  p_total_price DECIMAL,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_customer_email TEXT,
  p_comment TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with admin privileges
SET search_path = public -- Security best practice
AS $$
DECLARE
  v_new_id UUID;
BEGIN
  INSERT INTO bookings (
    service_id,
    booking_date,
    booking_time,
    guests_count,
    total_price,
    customer_name,
    customer_phone,
    customer_email,
    comment,
    status,
    payment_status
  ) VALUES (
    p_service_id,
    p_booking_date,
    p_booking_time,
    p_guests_count,
    p_total_price,
    p_customer_name,
    p_customer_phone,
    p_customer_email,
    p_comment,
    'pending',
    'unpaid'
  )
  RETURNING id INTO v_new_id;

  RETURN v_new_id;
END;
$$;

-- Grant access to everyone
GRANT EXECUTE ON FUNCTION create_booking TO anon;
GRANT EXECUTE ON FUNCTION create_booking TO authenticated;
GRANT EXECUTE ON FUNCTION create_booking TO service_role;
