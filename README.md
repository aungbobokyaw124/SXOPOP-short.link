# SXOPOP Short Link

A simple serverless URL shortener built with a static frontend, Vercel serverless functions, and Supabase.

## Structure

```text
SXOPOP-short.link/
├── api/
│   ├── shorten.js
│   ├── redirect.js
│   └── links.js
├── lib/
│   └── supabase.js
├── public/
│   └── index.html
├── supabase-schema.sql
├── vercel.json
├── package.json
└── .env.example
```

## Setup

1. Create a Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL Editor.
3. Deploy this repository to Vercel.
4. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as Vercel environment variables.
5. Optionally set `BASE_URL` to your production domain.

The public frontend is in `public/index.html`. The `/api/shorten` endpoint creates links, `/api/links` lists recent links, and `/:slug` redirects through the serverless redirect function.
