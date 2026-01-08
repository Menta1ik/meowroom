import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Missing Supabase credentials' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get all cats
  const { data: cats, error } = await supabase
    .from('cats')
    .select('id, updated_at');

  if (error) {
    console.error('Sitemap generation error:', error);
    // Fallback to static pages if DB fails
  }

  const baseUrl = 'https://meowroom.top';
  const today = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', freq: 'daily' },
    { url: '/cats', priority: '0.9', freq: 'daily' },
    { url: '/visit', priority: '0.8', freq: 'monthly' },
    { url: '/about', priority: '0.7', freq: 'monthly' },
    { url: '/donate', priority: '0.8', freq: 'monthly' },
    { url: '/contacts', priority: '0.6', freq: 'monthly' },
    { url: '/become-sponsor', priority: '0.7', freq: 'monthly' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map((page) => {
      return `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    })
    .join('')}
  ${cats
    ? cats
        .map((cat) => {
          return `
  <url>
    <loc>${baseUrl}/cats/${cat.id}</loc>
    <lastmod>${cat.updated_at ? new Date(cat.updated_at).toISOString().split('T')[0] : today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
        })
        .join('')
    : ''}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
  res.status(200).send(sitemap);
}
