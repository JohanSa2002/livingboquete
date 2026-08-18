-- Content tables: generic JSON documents keyed by a slug id, one table per section.
create table if not exists places (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists posts (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists rentals (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gallery (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id bigint generated always as identity primary key,
  nombre text not null,
  email text not null,
  celular text,
  pais text,
  retiro text,
  timeline text,
  interes text,
  created_at timestamptz not null default now()
);

-- Public lists and admin views sort every content table by creation time.
-- These indexes keep those reads predictable as the catalogue grows.
create index if not exists places_created_at_idx on places (created_at);
create index if not exists events_created_at_idx on events (created_at);
create index if not exists posts_created_at_idx on posts (created_at desc);
create index if not exists rentals_created_at_idx on rentals (created_at);
create index if not exists gallery_created_at_idx on gallery (created_at);
create index if not exists leads_created_at_idx on leads (created_at desc);

-- RLS is enabled with no policies: only requests authenticated with the
-- Supabase service_role key (used server-side in src/lib/supabase.ts) can
-- read or write these tables. The anon/public key has no access.
alter table places enable row level security;
alter table events enable row level security;
alter table posts enable row level security;
alter table rentals enable row level security;
alter table gallery enable row level security;
alter table leads enable row level security;
