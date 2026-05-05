-- =============================================================
-- ACQUIRO — Supabase Schema
-- Run this in your Supabase SQL editor
-- =============================================================

-- 1. User roles (buyer | seller | admin)
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role text not null check (role in ('buyer','seller','admin')),
  created_at timestamptz default now()
);
alter table public.user_roles enable row level security;

create policy "Users can read own role" on public.user_roles
  for select using (auth.uid() = user_id);

create policy "Users can insert own role" on public.user_roles
  for insert with check (auth.uid() = user_id);

-- 2. Listings (created by sellers, approved by admin)
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  sector text not null,
  state text not null,
  lga text,
  asking_price text not null,
  revenue_band text not null,
  years_operating text not null,
  staff_range text not null,
  deal_type text not null,
  description text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.listings enable row level security;

-- Sellers can read their own listings
create policy "Sellers read own listings" on public.listings
  for select using (auth.uid() = seller_id);

-- Anyone authenticated can read approved listings
create policy "All read approved" on public.listings
  for select using (status = 'approved');

-- Sellers can insert listings
create policy "Sellers insert" on public.listings
  for insert with check (auth.uid() = seller_id);

-- Admins can update status (use service role key from your server action/API route)
create policy "Sellers update own" on public.listings
  for update using (auth.uid() = seller_id);

-- 3. Access requests (buyer requests access to a specific listing)
create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade not null,
  buyer_id uuid references auth.users(id) on delete cascade not null,
  note text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz default now(),
  unique(listing_id, buyer_id)
);
alter table public.access_requests enable row level security;

create policy "Buyers read own requests" on public.access_requests
  for select using (auth.uid() = buyer_id);

create policy "Buyers insert requests" on public.access_requests
  for insert with check (auth.uid() = buyer_id);

-- 4. Buyer interest submissions (business they want that is not listed)
create table if not exists public.buyer_requests (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references auth.users(id) on delete cascade not null,
  sector text not null,
  preferred_state text not null,
  budget_range text not null,
  deal_type text not null,
  description text not null,
  status text not null default 'pending' check (status in ('pending','reviewed')),
  created_at timestamptz default now()
);
alter table public.buyer_requests enable row level security;

create policy "Buyers read own buyer_requests" on public.buyer_requests
  for select using (auth.uid() = buyer_id);

create policy "Buyers insert buyer_requests" on public.buyer_requests
  for insert with check (auth.uid() = buyer_id);
