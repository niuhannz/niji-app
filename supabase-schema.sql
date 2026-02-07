-- ═══════════════════════════════════════════════════════
-- niji.app — Supabase Database Schema
-- User Progress, My List & Subscription tracking
-- ═══════════════════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── User Profiles ─────────────────────────────────────
-- Extends Supabase Auth with app-specific fields
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default '',
  avatar_url text,
  subscription_tier text not null default 'free'
    check (subscription_tier in ('free', 'basic', 'premium')),
  subscription_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── User Progress ─────────────────────────────────────
-- Tracks reading/watching progress per content item
create table public.user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  content_id text not null,
  content_type text not null check (content_type in ('manga', 'video')),

  -- Manga progress
  last_chapter integer,
  last_page integer,

  -- Video progress
  last_episode integer,
  last_timestamp real,       -- seconds

  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One progress record per user per content
  unique (user_id, content_id)
);

alter table public.user_progress enable row level security;

create policy "Users can view own progress"
  on public.user_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update using (auth.uid() = user_id);

-- Index for fast lookups
create index idx_user_progress_user on public.user_progress (user_id);
create index idx_user_progress_content on public.user_progress (user_id, content_type);

-- ─── My List (Bookmarks) ──────────────────────────────
create table public.my_list (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  content_id text not null,
  content_type text not null check (content_type in ('manga', 'video')),
  added_at timestamptz not null default now(),

  unique (user_id, content_id)
);

alter table public.my_list enable row level security;

create policy "Users can view own list"
  on public.my_list for select using (auth.uid() = user_id);

create policy "Users can manage own list"
  on public.my_list for all using (auth.uid() = user_id);

create index idx_my_list_user on public.my_list (user_id);

-- ─── Likes ─────────────────────────────────────────────
create table public.likes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  content_id text not null,
  created_at timestamptz not null default now(),

  unique (user_id, content_id)
);

alter table public.likes enable row level security;

create policy "Users can view own likes"
  on public.likes for select using (auth.uid() = user_id);

create policy "Users can manage own likes"
  on public.likes for all using (auth.uid() = user_id);

-- ─── Watch History ─────────────────────────────────────
create table public.watch_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  content_id text not null,
  watched_at timestamptz not null default now()
);

alter table public.watch_history enable row level security;

create policy "Users can view own history"
  on public.watch_history for select using (auth.uid() = user_id);

create policy "Users can insert own history"
  on public.watch_history for insert with check (auth.uid() = user_id);

create index idx_watch_history_user on public.watch_history (user_id, watched_at desc);

-- ─── Updated at trigger ────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_progress_updated_at
  before update on public.user_progress
  for each row execute procedure public.set_updated_at();
