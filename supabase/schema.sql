-- Run this in your Supabase SQL editor

-- Blog posts table
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  category text,
  meta_title text,
  meta_description text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute function update_updated_at();

-- RLS
alter table blog_posts enable row level security;
create policy "Public can read published posts" on blog_posts
  for select using (published = true);

-- Packages table
-- `occupancy` (1-5) marks this package as the base per-person nightly rate
-- for that room occupancy tier — see supabase/migration_seasonal_pricing.sql
create table if not exists packages (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  title text not null,
  description text not null,
  price integer not null,
  nights integer not null default 2,
  features jsonb not null default '[]',
  image_url text not null default '',
  image_alt text not null default '',
  active boolean not null default true,
  occupancy integer,
  created_at timestamptz not null default now()
);

-- Seasonal / festival rate windows — see supabase/migration_seasonal_pricing.sql
create table if not exists seasonal_rates (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  start_date date not null,
  end_date date not null,
  rates jsonb not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint seasonal_rates_dates_check check (end_date >= start_date)
);

create index if not exists seasonal_rates_dates_idx on seasonal_rates (start_date, end_date, active);

-- Bookings table
-- `rooms` and `total_amount` are computed server-side at booking time and
-- locked in — later rate changes never retroactively change a stored booking.
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  email text not null,
  phone text not null,
  check_in date not null,
  check_out date not null,
  package_id uuid references packages(id) on delete set null,
  package_title text not null,
  guests integer not null default 1,
  rooms jsonb not null default '[]',
  total_amount integer,
  status text not null default 'pending_payment' check (status in ('pending_payment', 'confirmed', 'cancelled')),
  notes text not null default '',
  created_at timestamptz not null default now()
);

-- Indexes for availability queries
create index if not exists bookings_dates_idx on bookings (check_in, check_out, status);

-- Seed packages (matches current hardcoded data)
insert into packages (number, title, description, price, nights, features, image_url, image_alt) values
(
  '01',
  'Wilderness Escape',
  'Disconnect to reconnect. A secluded retreat surrounded by untouched nature.',
  4200,
  2,
  '[{"label": "2 Nights Stay"}, {"label": "All Meals"}, {"label": "Nature Trails"}]',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCxdrtD8r9pKg2sIi6aAwhzlDeDG0NXqzuFNnnaM19DoRp2s_OOXWcSWnluK0iXbjPJkq0L4yv2WZryVS5YmctpBdfpnFZFzwXc6I3ZKyll7tfrPd56-CEpi5hiDESV5N0MYxZ1z4wlFRU9_cSHbvsxqr851SWHUcLRh3fZGY2D1cMbqO6P1OEa-9kwJg3XAqSCcXrYXqk_HdbwcjIXjm5_l0srbCldba2G9w_i5DIrz6xk3SP5Wf4Gu1wFElp1lbE1MpTxWmWe_f7P',
  'Secluded cabin in dense forest wilderness at dusk'
),
(
  '02',
  'Luxury Hideaway',
  'Indulge in comfort and elegance with world-class amenities.',
  6200,
  2,
  '[{"label": "2 Nights Stay"}, {"label": "All Meals"}, {"label": "Private Balcony"}]',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB1SHNI7ct5Yx-u6MpbHwS6oyrEJ921q4Yn3Z41bBEtgFzPY-__Lg_Axd8x-eh003gHkw-ViyffOteJk8_n_ziwXc03RRkVHf0Q3B_CaP3K4ezodoZj0G-kr_2Z1plC0m0B7BoXboDtjB8LSLTM3EV5DRrsKXtK5GH8Ztq4jiR9aNexNnnHDoVbgmTf11k1cEGvX-GRrK3RqOfcMhclTt9nEPzzdiDesoiSebBETDWiD7BhZ4yKHKCpaTXyg7eEcOiPFSC4Mj52ZASf',
  'Luxury outdoor bathtub on private deck surrounded by lush ferns'
),
(
  '03',
  'Romantic Retreat',
  'A perfect escape for two. Romance awaits in every moment.',
  5800,
  2,
  '[{"label": "2 Nights Stay"}, {"label": "Candlelight Dinner"}, {"label": "Couple Spa"}]',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBbx7oCYwE5oWzq4nJnM5iFpBrBs_rT9yLqTH_3gIa1q_p7YXjCRkMNYaSN0s4JqS2v84p3RRCFSg3_X_pv0lpRl_i_Z02YF8K6RyCG8J8Wz25o68VIoRPlrKTpHzuqN0eEuSx7I4JmfKiCWaFMPBkk8FXGYIipVuPFhEVhbdYpVrEzjcI1DfhiqwpPGsT7hKjnTJL98Sy8VDYgTHJFW7H1VvBN-tZX1xNwIMaV0lkH-lqZCkFqYH68u2E_pVPtNpqGR72L_rR',
  'Intimate fireplace interior with candlelight and forest view'
),
(
  '04',
  'Adventure Trails',
  'For the explorers at heart. Experience thrills and unforgettable journeys.',
  4800,
  3,
  '[{"label": "3 Nights Stay"}, {"label": "Adventure Activities"}, {"label": "Guide"}]',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCO_ZFKqiYjFNLbxPFLRKsn_Z5PJxxjt35LhP_xHPJCcTRHHhOq0GcQgCJVYoI72rTnjqEaTunbRfzG-kQFIi64lC5AJJHQjBcj8IqXcHfxT9TuwRJGqXm3INGf0VCEhCrClAzJ3F2h98m0IxZv-Ew2GF_EHr8CDG0cHLmDh7N49cQQ6h7gT9gbNMbOJBTEVPZBcMLc7hDj0VbNi8lv1j-yxKMzZJqCr9aeAQN4w5KQbn9dLm',
  'Campfire gathering under forest canopy at night'
)
on conflict do nothing;

-- Row Level Security (optional but recommended)
alter table packages enable row level security;
alter table bookings enable row level security;
alter table seasonal_rates enable row level security;

-- Allow public reads on packages
create policy "Public can read active packages" on packages
  for select using (active = true);

-- Bookings: only service role can read/write (API routes use service key)
create policy "Service role full access bookings" on bookings
  using (true) with check (true);

-- Seasonal rates: only service role can read/write (API routes use service key)
create policy "Service role full access seasonal_rates" on seasonal_rates
  using (true) with check (true);
