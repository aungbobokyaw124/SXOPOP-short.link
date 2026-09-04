const { supabase } = require('../lib/supabase.js')import { supabase } from '../lib/supabase.js'
export default async function handler(req, res) {
  const { slug } = req.query || {}
  if (!slug) return res.status(400).json({ error: 'Slug required' })

  const { data, error } = await supabase.from('links').select('*').eq('slug', slug).maybeSingle()
  if (error || !data) return res.redirect(302, '/?error=not_found')
  if (data.expires_at && new Date(data.expires_at) < new Date()) return res.redirect(302, '/?error=expired')

  await supabase.from('links').update({ clicks: (data.clicks || 0) + 1 }).eq('slug', slug)
  return res.redirect(301, data.original_url)
}
