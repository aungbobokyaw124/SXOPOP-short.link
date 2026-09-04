const { supabase } = require('../lib/supabase.js')

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { data, error } = await supabase.from('links').select('*').order('created_at', { ascending: false }).limit(20)
  if (error) return res.status(500).json({ error: 'Database error' })

  const baseUrl = process.env.BASE_URL || `https://${req.headers.host}`
  const links = data.map(link => ({ ...link, short_url: `${baseUrl}/${link.slug}`, expired: link.expires_at ? new Date(link.expires_at) < new Date() : false }))
  return res.status(200).json({ links })
}
