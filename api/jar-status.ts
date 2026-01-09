import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  // Use provided ID or fallback to the known ID from chat
  const jarId = id || 'mOhlr2amroz2VqI1VKF1kGw';

  if (!jarId) {
    return res.status(400).json({ error: 'Missing jar ID' });
  }

  try {
    const response = await fetch(`https://api.monobank.ua/bank/jar/${jarId}`, {
      headers: {
        'X-Token': process.env.MONOBANK_API_TOKEN || ''
      }
    });
    
    if (!response.ok) {
      console.error(`Monobank API error: ${response.status}`);
      return res.status(response.status).json({ error: 'Failed to fetch jar data' });
    }

    const data = await response.json();

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching jar:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
