import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Monobank sends a GET request to verify the webhook URL on registration
  if (req.method === 'GET') {
      return res.status(200).send('OK');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    console.log('Webhook received:', type);

    if (type === 'StatementItem') {
      const { account, statementItem } = data;
      
      // Monobank sends balance in cents (e.g. 10000 for 100.00 UAH)
      // We store in main units (100)
      const balance = Math.floor(statementItem.balance / 100); 

      console.log(`Updating jar ${account} to ${balance}`);

      // Update Supabase
      // We look for the fundraising that matches this account (jar_id)
      const { error } = await supabase
        .from('fundraisings')
        .update({ current_amount: balance })
        .eq('jar_id', account);

      if (error) {
        console.error('Supabase update error:', error);
        return res.status(500).json({ error: 'Database update failed' });
      }

      console.log(`Updated jar ${account} with balance ${balance}`);
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
