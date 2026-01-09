import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  // Use provided ID or fallback to the known ID from chat
  const jarId = id || 'mOhlr2amroz2VqI1VKF1kGw';

  if (!jarId) {
    return res.status(400).json({ error: 'Missing jar ID' });
  }

  try {
    // Use Personal API client-info as it is the authenticated and documented way
    // Note: This endpoint has a rate limit of 1 request per 60 seconds
    const response = await fetch('https://api.monobank.ua/personal/client-info', {
      headers: {
        'X-Token': process.env.MONOBANK_API_TOKEN || '',
        'User-Agent': 'MeowRoom/1.0'
      }
    });
    
    if (!response.ok) {
      console.error(`Monobank API error: ${response.status}`);
      return res.status(response.status).json({ error: 'Failed to fetch client info' });
    }

    const clientInfo = await response.json();
    
    // Try to find by internal ID first, then by sendId (short link ID)
    const jar = clientInfo.jars.find((j: any) => 
      j.id === jarId || 
      j.sendId === jarId || 
      j.sendId === `jar/${jarId}` ||
      (j.sendId && j.sendId.endsWith(jarId))
    );

    if (!jar) {
      return res.status(404).json({ error: 'Jar not found' });
    }

    // Map Personal API response to expected format
    // balance is in cents, goal is in cents
    const data = {
      amount: jar.balance,
      goal: jar.goal,
      active: true // Jars in client-info are active
    };

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching jar:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
