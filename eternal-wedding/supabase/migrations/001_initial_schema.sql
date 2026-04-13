-- ============================================================
-- Eternal Wedding Suite — Full Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── PROFILES ──────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific data
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── WEDDINGS ──────────────────────────────────────────────
create table public.weddings (
  id              uuid default uuid_generate_v4() primary key,
  owner_id        uuid references public.profiles(id) on delete cascade not null,
  slug            text unique not null,             -- URL: /wedding/amara-james
  partner1_name   text not null,
  partner2_name   text not null,
  wedding_date    date,
  venue_name      text,
  venue_address   text,
  venue_city      text,
  venue_country   text,
  story           text,
  cover_image_url text,
  theme           text default 'rose-garden',
  is_published    boolean default false,
  password_hash   text,                             -- optional site password
  custom_domain   text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.weddings enable row level security;

create policy "Owners can manage their wedding"
  on public.weddings for all using (auth.uid() = owner_id);

create policy "Published weddings viewable by all"
  on public.weddings for select using (is_published = true);

-- ── EVENTS ────────────────────────────────────────────────
create table public.events (
  id          uuid default uuid_generate_v4() primary key,
  wedding_id  uuid references public.weddings(id) on delete cascade not null,
  title       text not null,
  description text,
  event_date  date,
  start_time  time,
  end_time    time,
  venue_name  text,
  venue_address text,
  dress_code  text,
  is_public   boolean default true,
  sort_order  integer default 0,
  created_at  timestamptz default now()
);

alter table public.events enable row level security;

create policy "Owners manage events"
  on public.events for all
  using (auth.uid() = (select owner_id from public.weddings where id = wedding_id));

create policy "Public events visible to all"
  on public.events for select using (
    is_public = true
    and exists (select 1 from public.weddings w where w.id = wedding_id and w.is_published = true)
  );

-- ── GUESTS ────────────────────────────────────────────────
create table public.guests (
  id           uuid default uuid_generate_v4() primary key,
  wedding_id   uuid references public.weddings(id) on delete cascade not null,
  first_name   text not null,
  last_name    text,
  email        text,
  phone        text,
  group_name   text,                -- e.g. "Smith Family"
  rsvp_status  text default 'pending' check (rsvp_status in ('pending','attending','declined')),
  meal_choice  text,
  plus_one     boolean default false,
  plus_one_name text,
  dietary_notes text,
  song_request text,
  invite_sent  boolean default false,
  invite_sent_at timestamptz,
  events       uuid[],              -- which event IDs this guest is invited to
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.guests enable row level security;

create policy "Owners manage guests"
  on public.guests for all
  using (auth.uid() = (select owner_id from public.weddings where id = wedding_id));

-- Guests can view/update their own RSVP via token (handled in app logic)

-- ── RSVP TOKENS ───────────────────────────────────────────
create table public.rsvp_tokens (
  id         uuid default uuid_generate_v4() primary key,
  guest_id   uuid references public.guests(id) on delete cascade not null,
  token      text unique not null default encode(gen_random_bytes(32), 'hex'),
  used       boolean default false,
  expires_at timestamptz default (now() + interval '90 days'),
  created_at timestamptz default now()
);

alter table public.rsvp_tokens enable row level security;

create policy "Anyone with token can view"
  on public.rsvp_tokens for select using (true);

create policy "Owners can manage tokens"
  on public.rsvp_tokens for all
  using (
    auth.uid() = (
      select w.owner_id from public.weddings w
      join public.guests g on g.wedding_id = w.id
      where g.id = guest_id
    )
  );

-- ── PHOTOS ────────────────────────────────────────────────
create table public.photos (
  id           uuid default uuid_generate_v4() primary key,
  wedding_id   uuid references public.weddings(id) on delete cascade not null,
  uploader_id  uuid references public.profiles(id) on delete set null,
  uploader_name text,               -- guest name if not logged in
  storage_path text not null,       -- Supabase storage path
  public_url   text not null,
  caption      text,
  is_approved  boolean default true, -- owners can moderate
  width        integer,
  height       integer,
  file_size    integer,
  created_at   timestamptz default now()
);

alter table public.photos enable row level security;

create policy "Owners manage all photos"
  on public.photos for all
  using (auth.uid() = (select owner_id from public.weddings where id = wedding_id));

create policy "Approved photos visible for published weddings"
  on public.photos for select using (
    is_approved = true
    and exists (select 1 from public.weddings w where w.id = wedding_id and w.is_published = true)
  );

create policy "Authenticated users can upload photos"
  on public.photos for insert with check (auth.uid() is not null);

-- ── TRAVEL INFO ───────────────────────────────────────────
create table public.travel_info (
  id           uuid default uuid_generate_v4() primary key,
  wedding_id   uuid references public.weddings(id) on delete cascade not null,
  section      text not null,       -- 'hotel', 'transport', 'airport', 'tips'
  title        text not null,
  description  text,
  url          text,
  address      text,
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

alter table public.travel_info enable row level security;

create policy "Owners manage travel info"
  on public.travel_info for all
  using (auth.uid() = (select owner_id from public.weddings where id = wedding_id));

create policy "Public travel info visible"
  on public.travel_info for select using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.is_published = true)
  );

-- ── REGISTRY LINKS ────────────────────────────────────────
create table public.registry_links (
  id         uuid default uuid_generate_v4() primary key,
  wedding_id uuid references public.weddings(id) on delete cascade not null,
  store_name text not null,
  url        text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.registry_links enable row level security;

create policy "Owners manage registry"
  on public.registry_links for all
  using (auth.uid() = (select owner_id from public.weddings where id = wedding_id));

create policy "Registry visible for published weddings"
  on public.registry_links for select using (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.is_published = true)
  );

-- ── GUESTBOOK ─────────────────────────────────────────────
create table public.guestbook_entries (
  id           uuid default uuid_generate_v4() primary key,
  wedding_id   uuid references public.weddings(id) on delete cascade not null,
  author_name  text not null,
  message      text not null,
  is_approved  boolean default true,
  created_at   timestamptz default now()
);

alter table public.guestbook_entries enable row level security;

create policy "Owners manage guestbook"
  on public.guestbook_entries for all
  using (auth.uid() = (select owner_id from public.weddings where id = wedding_id));

create policy "Approved entries visible for published weddings"
  on public.guestbook_entries for select using (
    is_approved = true
    and exists (select 1 from public.weddings w where w.id = wedding_id and w.is_published = true)
  );

create policy "Anyone can write to guestbook"
  on public.guestbook_entries for insert with check (
    exists (select 1 from public.weddings w where w.id = wedding_id and w.is_published = true)
  );

-- ── STORAGE BUCKETS ───────────────────────────────────────
-- Run these in Supabase Dashboard > Storage > New Bucket
-- OR uncomment and run here if using CLI:

-- insert into storage.buckets (id, name, public) values ('wedding-photos', 'wedding-photos', true);
-- insert into storage.buckets (id, name, public) values ('wedding-covers', 'wedding-covers', true);

-- Storage policies (after creating buckets):
-- create policy "Anyone can view photos" on storage.objects for select using (bucket_id = 'wedding-photos');
-- create policy "Auth users can upload photos" on storage.objects for insert with check (bucket_id = 'wedding-photos' and auth.uid() is not null);
-- create policy "Owners can delete photos" on storage.objects for delete using (bucket_id = 'wedding-photos' and auth.uid()::text = (storage.foldername(name))[1]);

-- ── INDEXES ───────────────────────────────────────────────
create index idx_weddings_slug on public.weddings(slug);
create index idx_weddings_owner on public.weddings(owner_id);
create index idx_guests_wedding on public.guests(wedding_id);
create index idx_guests_email on public.guests(email);
create index idx_photos_wedding on public.photos(wedding_id);
create index idx_events_wedding on public.events(wedding_id);

-- ── UPDATED_AT TRIGGER ────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_weddings_updated_at before update on public.weddings
  for each row execute procedure public.set_updated_at();

create trigger set_guests_updated_at before update on public.guests
  for each row execute procedure public.set_updated_at();
