# yt-pay.io — Curated Classics & Beautiful Cars

European marketplace for retro, classic and beautiful automobiles.

## Tech Stack
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage) — Frankfurt region
- **Hosting**: Vercel
- **Domain**: yt-pay.io

## Structure
- `src/app/` — pages (App Router)
- `src/components/` — React components
- `src/components/ui/` — shadcn/ui components (DO NOT edit manually)
- `src/lib/` — utils, types, config, data
- `supabase/` — SQL schema, migrations
- `public/` — static assets

## Development
```bash
npm run dev    # http://localhost:3000
npm run build  # production build
```

## Data
Currently using mock data in `src/lib/data.ts`. Will migrate to Supabase.

## Design
- Light theme, premium/minimal aesthetic
- Amber/gold accents
- Inter (body) + Playfair Display (headings)
- Mobile-first responsive
