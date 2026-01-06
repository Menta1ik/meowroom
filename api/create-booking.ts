import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with Service Role Key (Admin Access)
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      service_id,
      booking_date,
      booking_time,
      guests_count,
      total_price,
      customer_name,
      customer_phone,
      customer_email,
      comment,
      service_name // Optional: for description
    } = req.body;

    // 1. Create Booking in Supabase (Bypassing RLS)
    const bookingId = crypto.randomUUID();
    
    const { error: insertError } = await supabase.from('bookings').insert([{
      id: bookingId,
      service_id,
      booking_date,
      booking_time,
      guests_count,
      total_price,
      customer_name,
      customer_phone,
      customer_email,
      comment,
      status: 'pending',
      payment_status: 'unpaid'
    }]);

    if (insertError) {
      console.error('Supabase Insert Error:', insertError);
      return res.status(500).json({ error: 'Failed to create booking record: ' + insertError.message });
    }

    // 2. Create Invoice in Monobank
    const token = process.env.MONOBANK_TOKEN;
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173';
    let paymentData = null;

    if (token) {
      const monoResponse = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
        method: 'POST',
        headers: {
          'X-Token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total_price * 100, // cents
          ccy: 980, // UAH
          merchantPaymInfo: {
            reference: bookingId,
            destination: `Visit Meowroom: ${service_name || 'Service'} (${booking_date})`,
          },
          redirectUrl: `${baseUrl}/?success=true&bookingId=${bookingId}`,
          webHookUrl: `${baseUrl}/api/webhook-mono`,
          validity: 3600,
          paymentType: 'debit',
        }),
      });

      paymentData = await monoResponse.json();
      
      if (!monoResponse.ok) {
        console.error('Monobank Error:', paymentData);
        // We don't fail the whole request, but return error for payment
      } else if (paymentData.invoiceId) {
        // 3. Update booking with payment_id
        await supabase
          .from('bookings')
          .update({ payment_id: paymentData.invoiceId })
          .eq('id', bookingId);
      }
    }

    return res.status(200).json({
      success: true,
      bookingId,
      invoiceId: paymentData?.invoiceId,
      pageUrl: paymentData?.pageUrl
    });

  } catch (error: any) {
    console.error('Create Booking Handler Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
