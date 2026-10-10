create extension if not exists btree_gist;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  service_id text not null,
  service_name text not null,
  price_brl numeric(10,2) not null default 0,
  barber text not null default 'A definir',
  booking_date date not null,
  booking_time time not null,
  duration_minutes integer not null default 30 check (duration_minutes between 15 and 240),
  status text not null default 'confirmed' check (status in ('confirmed','cancelled')),
  created_at timestamptz not null default now(),
  constraint bookings_no_duplicate_slot exclude using gist (
    barber with =,
    booking_date with =,
    tsrange((booking_date + booking_time), (booking_date + booking_time) + make_interval(mins => duration_minutes), '[)') with &&
  ) where (status <> 'cancelled')
);

create index if not exists bookings_date_idx on public.bookings (booking_date, booking_time);
alter table public.bookings enable row level security;
-- No public policies: the service-role key is used only by the Vercel serverless API.
