# YT Pay — Curated Classics & Beautiful Cars

European marketplace for retro, classic and beautiful automobiles.

**Live:** [yt-pay.io](https://yt-pay.io)

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Payments:** Stripe Checkout
- **Hosting:** Vercel
- **Domain:** yt-pay.io (Cloudflare DNS)

## Features

### Public
- Car catalog with search, filters (make, year, price), sold badges
- Car detail pages with photo gallery, specs, inquiry form
- 3 pricing tiers with early adopter discounts
- About, Contact, Privacy, Terms pages

### Seller Dashboard (`/dashboard`)
- Listings CRUD (create, edit, archive, mark sold)
- Buyer inquiries inbox
- Profile management, favorites

### Admin Panel (`/admin`)
- Moderation queue (approve/reject with audit trail)
- User management (ban, verify, change roles)
- Listings management (featured toggle)
- Payments and inquiries overview

### Auth
- Email/password via Supabase Auth
- Role-based access (admin, seller, buyer)
- Forgot/reset password flow

## Getting Started

```bash
git clone https://github.com/solskiysb/yt-pay.git
cd yt-pay
npm install
cp .env.example .env.local
# Fill in Supabase and Stripe keys
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Database

Schema in `supabase/schema.sql`. 7 tables with Row Level Security:
profiles, listings, listing_images, inquiries, payments, favorites, moderation_events.

## Deployment

```bash
vercel deploy --prod
```

Auto-deploys via GitHub on push to `main`.
