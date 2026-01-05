import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { invoiceId } = req.body;
  const token = process.env.MONOBANK_TOKEN;

  if (!invoiceId) {
    return res.status(400).json({ error: 'Missing invoiceId' });
  }

  if (!token) {
    return res.status(500).json({ error: 'Missing Monobank token' });
  }

  try {
    // 1. Check status in Monobank
    const response = await fetch(`https://api.monobank.ua/api/merchant/invoice/status?invoiceId=${invoiceId}`, {
      method: 'GET',
      headers: {
        'X-Token': token,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Monobank Status Error:', data);
      return res.status(400).json({ error: data.errText || 'Failed to check status' });
    }

    console.log('Monobank Status:', data);

    // 2. If paid, update Supabase
    if (data.status === 'success') {
       const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          payment_id: invoiceId
        })
        .eq('payment_id', invoiceId); // Find by payment_id

      if (error) {
        console.error('Supabase Update Error:', error);
        return res.status(500).json({ error: 'Failed to update booking in DB' });
      }
      
      return res.status(200).json({ status: 'paid', message: 'Booking updated to paid' });
    }

    return res.status(200).json({ status: data.status, message: 'Payment not yet completed' });

  } catch (error: any) {
    console.error('Check Payment Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
