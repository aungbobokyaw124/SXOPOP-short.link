import { supabase } from '../lib/supabase.js'

function generateSlug(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { url, custom_slug, expiry_days, user_id } = req.body || {}
  if (!url) return res.status(400).json({ error: 'URL is required' })
  try { new URL(url) } catch { return res.status(400).json({ error: 'Invalid URL format' }) }
  let slug = custom_slug || generateSlug()
  if (custom_slug) {
    const { data: existing } = await supabase.from('links').select('slug').eq('slug', custom_slug).maybeSingle()
    if (existing) return res.status(409).json({ error: 'Custom slug already taken' })
  } else {
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabase.from('links').select('slug').eq('slug', slug).maybeSingle()
      if (!existing) break
      slug = generateSlug()
    }
  }
  let expires_at = null
  const days = Number.parseInt(expiry_days, 10)
  if (days > 0) { const d = new Date(); d.setDate(d.getDate() + days); expires_at = d.toISOString() }
  const row = { slug, original_url: url, expires_at }
  if (user_id) row.user_id = user_id
  const { data, error } = await supabase.from('links').insert(row).select().single()
  if (error) return res.status(500).json({ error: 'Database error' })
  const baseUrl = process.env.BASE_URL || `https://${req.headers.host}`
  return res.status(200).json({ short_url: `${baseUrl}/${data.slug}`, slug: data.slug, original_url: data.original_url, expires_at: data.expires_at, clicks: 0 })
}
