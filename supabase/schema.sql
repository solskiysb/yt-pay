-- yt-pay.io database schema
-- Run this in Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Users profile (extends Supabase Auth)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  location text,
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Car listings
create table public.listings (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid references public.profiles(id) on delete cascade not null,

  -- Car info
  make text not null,
  model text not null,
  year integer not null check (year >= 1900 and year <= 2030),
  price integer not null check (price > 0),
  mileage integer not null check (mileage >= 0),

  -- Details
  description text not null,
  short_description text not null,
  condition text not null check (condition in ('excellent', 'good', 'fair')),
  location text not null,

  -- Specs
  engine text,
  transmission text,
  drivetrain text,
  exterior_color text,
  interior_color text,
  body_type text,

  -- Meta
  features text[] default '{}',
  featured boolean default false,
  status text default 'active' check (status in ('active', 'sold', 'draft', 'expired')),
  views integer default 0,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Listing images
create table public.listing_images (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  url text not null,
  position integer default 0,
  created_at timestamptz default now() not null
);

-- Favorites
create table public.favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, listing_id)
);

-- Contact requests (when buyer contacts seller)
create table public.contact_requests (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  sender_name text not null,
  sender_email text not null,
  message text not null,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_listings_make on public.listings(make);
create index idx_listings_year on public.listings(year);
create index idx_listings_price on public.listings(price);
create index idx_listings_status on public.listings(status);
create index idx_listings_featured on public.listings(featured) where featured = true;
create index idx_listings_seller on public.listings(seller_id);
create index idx_listing_images_listing on public.listing_images(listing_id);
create index idx_favorites_user on public.favorites(user_id);
create index idx_favorites_listing on public.favorites(listing_id);

-- Full-text search index
alter table public.listings add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(make, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(model, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(location, '')), 'C')
  ) stored;

create index idx_listings_search on public.listings using gin(search_vector);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;
alter table public.contact_requests enable row level security;

-- Profiles: users can read all, update own
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Listings: everyone can read active, owners can CRUD
create policy "Active listings are viewable by everyone"
  on public.listings for select using (status = 'active' or seller_id = auth.uid());
create policy "Users can create listings"
  on public.listings for insert with check (auth.uid() = seller_id);
create policy "Users can update own listings"
  on public.listings for update using (auth.uid() = seller_id);
create policy "Users can delete own listings"
  on public.listings for delete using (auth.uid() = seller_id);

-- Images: follow listing access
create policy "Images viewable with listing"
  on public.listing_images for select using (true);
create policy "Listing owner can manage images"
  on public.listing_images for insert with check (
    exists (select 1 from public.listings where id = listing_id and seller_id = auth.uid())
  );
create policy "Listing owner can delete images"
  on public.listing_images for delete using (
    exists (select 1 from public.listings where id = listing_id and seller_id = auth.uid())
  );

-- Favorites: users manage own
create policy "Users can view own favorites"
  on public.favorites for select using (auth.uid() = user_id);
create policy "Users can add favorites"
  on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users can remove favorites"
  on public.favorites for delete using (auth.uid() = user_id);

-- Contact requests: anyone can create, listing owner can read
create policy "Anyone can send contact request"
  on public.contact_requests for insert with check (true);
create policy "Listing owner can read contact requests"
  on public.contact_requests for select using (
    exists (select 1 from public.listings where id = listing_id and seller_id = auth.uid())
  );

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
