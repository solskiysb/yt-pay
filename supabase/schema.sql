-- yt-pay.io database schema v2
-- Run this in Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. PROFILES (extends Supabase Auth)
-- =============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  location text,
  country text,
  bio text,
  role text not null default 'buyer' check (role in ('admin', 'seller', 'buyer')),
  is_verified boolean default false,
  is_banned boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    new.email,
    'seller'  -- default role for new signups
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================
-- 2. LISTINGS
-- =============================================
create table public.listings (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.profiles(id) on delete cascade not null,
  slug text unique not null,

  -- Car info
  make text not null,
  model text not null,
  year integer not null check (year >= 1900 and year <= 2030),
  price integer not null check (price > 0),
  mileage integer not null check (mileage >= 0),
  currency text default 'EUR',

  -- Details
  description text not null,
  short_description text not null,
  condition text not null check (condition in ('excellent', 'good', 'fair')),
  location text not null,
  country text,

  -- Specs
  engine text,
  transmission text,
  drivetrain text,
  exterior_color text,
  interior_color text,
  body_type text,

  -- Meta
  features text[] default '{}',
  is_featured boolean default false,
  featured_until timestamptz,
  status text default 'draft' check (status in (
    'draft', 'pending_payment', 'pending_review',
    'approved', 'rejected', 'archived', 'sold'
  )),
  rejection_reason text,
  views_count integer default 0,
  contacts_count integer default 0,

  -- Payment tracking
  paid_at timestamptz,
  approved_at timestamptz,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- =============================================
-- 3. LISTING IMAGES
-- =============================================
create table public.listing_images (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  url text not null,
  storage_path text,
  sort_order integer default 0,
  is_primary boolean default false,
  created_at timestamptz default now() not null
);

-- =============================================
-- 4. INQUIRIES
-- =============================================
create table public.inquiries (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz default now() not null
);

-- =============================================
-- 5. PAYMENTS
-- =============================================
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  amount integer not null,
  currency text default 'EUR',
  status text default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  paid_at timestamptz,
  created_at timestamptz default now() not null
);

-- =============================================
-- 6. FAVORITES
-- =============================================
create table public.favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, listing_id)
);

-- =============================================
-- 7. MODERATION EVENTS (audit trail)
-- =============================================
create table public.moderation_events (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  admin_id uuid references public.profiles(id) on delete set null,
  action text not null check (action in (
    'approve', 'reject', 'feature', 'unfeature',
    'archive', 'restore', 'edit', 'delete'
  )),
  reason text,
  previous_status text,
  new_status text,
  created_at timestamptz default now() not null
);

-- =============================================
-- INDEXES
-- =============================================
create index idx_listings_seller on public.listings(seller_id);
create index idx_listings_status on public.listings(status);
create index idx_listings_make on public.listings(make);
create index idx_listings_year on public.listings(year);
create index idx_listings_price on public.listings(price);
create index idx_listings_slug on public.listings(slug);
create index idx_listings_featured on public.listings(is_featured) where is_featured = true;
create index idx_listing_images_listing on public.listing_images(listing_id);
create index idx_inquiries_seller on public.inquiries(seller_id);
create index idx_inquiries_listing on public.inquiries(listing_id);
create index idx_favorites_user on public.favorites(user_id);
create index idx_favorites_listing on public.favorites(listing_id);
create index idx_payments_seller on public.payments(seller_id);
create index idx_payments_listing on public.payments(listing_id);
create index idx_moderation_listing on public.moderation_events(listing_id);

-- Full-text search
alter table public.listings add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(make, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(model, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(location, '')), 'C')
  ) stored;

create index idx_listings_search on public.listings using gin(search_vector);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.inquiries enable row level security;
alter table public.payments enable row level security;
alter table public.favorites enable row level security;
alter table public.moderation_events enable row level security;

-- PROFILES
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can update own profile (non-protected fields)"
  on public.profiles for update using (auth.uid() = id)
  with check (
    role = (select role from public.profiles where id = auth.uid()) and
    is_verified = (select is_verified from public.profiles where id = auth.uid()) and
    is_banned = (select is_banned from public.profiles where id = auth.uid())
  );
create policy "System can insert profiles"
  on public.profiles for insert with check (auth.uid() = id);

-- LISTINGS
create policy "Approved listings are public"
  on public.listings for select using (
    status = 'approved' or status = 'sold' or seller_id = auth.uid()
  );
create policy "Sellers can create listings"
  on public.listings for insert with check (auth.uid() = seller_id);
create policy "Sellers can update own listings (non-protected fields)"
  on public.listings for update using (auth.uid() = seller_id);
create policy "Sellers can delete own draft listings"
  on public.listings for delete using (
    auth.uid() = seller_id and status = 'draft'
  );

-- Admin override policies (using profile role check)
create policy "Admins can read all listings"
  on public.listings for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Admins can update all listings"
  on public.listings for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- LISTING IMAGES
create policy "Images are public with listing"
  on public.listing_images for select using (true);
create policy "Listing owner can manage images"
  on public.listing_images for insert with check (
    exists (select 1 from public.listings where id = listing_id and seller_id = auth.uid())
  );
create policy "Listing owner can update images"
  on public.listing_images for update using (
    exists (select 1 from public.listings where id = listing_id and seller_id = auth.uid())
  );
create policy "Listing owner can delete images"
  on public.listing_images for delete using (
    exists (select 1 from public.listings where id = listing_id and seller_id = auth.uid())
  );

-- INQUIRIES
create policy "Anyone can send inquiry"
  on public.inquiries for insert with check (true);
create policy "Seller can read own inquiries"
  on public.inquiries for select using (seller_id = auth.uid());
create policy "Seller can update own inquiry status"
  on public.inquiries for update using (seller_id = auth.uid());
create policy "Admins can read all inquiries"
  on public.inquiries for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- PAYMENTS
create policy "Seller can view own payments"
  on public.payments for select using (seller_id = auth.uid());
create policy "Admins can read all payments"
  on public.payments for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- FAVORITES
create policy "Users can view own favorites"
  on public.favorites for select using (auth.uid() = user_id);
create policy "Users can add favorites"
  on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users can remove favorites"
  on public.favorites for delete using (auth.uid() = user_id);

-- MODERATION EVENTS
create policy "Admins can read moderation events"
  on public.moderation_events for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Admins can create moderation events"
  on public.moderation_events for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- =============================================
-- TRIGGERS
-- =============================================

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at();
create trigger listings_updated_at before update on public.listings
  for each row execute function update_updated_at();

-- Protect admin-only fields on listings
create or replace function protect_listing_admin_fields()
returns trigger as $$
begin
  -- Only admins can change these fields
  if not exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') then
    new.is_featured = old.is_featured;
    new.featured_until = old.featured_until;
    new.views_count = old.views_count;
    new.contacts_count = old.contacts_count;
    new.paid_at = old.paid_at;
    new.approved_at = old.approved_at;
    -- Sellers can only set certain statuses
    if new.status not in ('draft', 'archived', 'sold') and new.status != old.status then
      new.status = old.status;
    end if;
    -- If changing from approved, require re-review
    if old.status = 'approved' and (
      new.make != old.make or new.model != old.model or
      new.year != old.year or new.price != old.price or
      new.description != old.description
    ) then
      new.status = 'pending_review';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger protect_listing_fields before update on public.listings
  for each row execute function protect_listing_admin_fields();

-- Increment contacts_count when inquiry created
create or replace function increment_contacts()
returns trigger as $$
begin
  update public.listings
    set contacts_count = contacts_count + 1
    where id = new.listing_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger increment_contacts_on_inquiry
  after insert on public.inquiries
  for each row execute function increment_contacts();
