import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, bookingId, description } = req.body;
  const token = process.env.MONOBANK_TOKEN;
  
  // Public URL of the site (needed for webhook and redirect)
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173';

  if (!token) {
    return res.status(500).json({ error: 'Missing Monobank token' });
  }

  try {
    const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'X-Token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Monobank expects cents (e.g. 10000 = 100.00 UAH)
        ccy: 980, // UAH
        merchantPaymInfo: {
          reference: bookingId, // Our internal booking ID
          destination: description || 'Visit to Meowroom',
        },
        redirectUrl: `${baseUrl}/visit?success=true&bookingId=${bookingId}`,
        webHookUrl: `${baseUrl}/api/webhook-mono`, // Our webhook handler
        validity: 3600, // 1 hour to pay
        paymentType: 'debit',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Monobank API Error:', data);
      return res.status(400).json({ error: data.errText || 'Failed to create invoice' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Create Invoice Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
