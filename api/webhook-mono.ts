import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (Service Role)
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { invoiceId, status, reference, modifiedDate } = req.body;

  console.log('Received Webhook:', req.body);

  if (status === 'success') {
    try {
      // Update booking status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed', // Auto-confirm on payment
          payment_id: invoiceId
        })
        .eq('id', reference); // reference is our bookingId

      if (error) {
        console.error('Supabase Update Error:', error);
        return res.status(500).json({ error: 'Failed to update booking' });
      }

      console.log(`Booking ${reference} paid successfully!`);
    } catch (err) {
      console.error('Webhook Error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(200).json({ received: true });
}
