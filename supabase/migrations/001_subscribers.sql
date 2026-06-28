-- Pollinator Acres subscriber list (app database).
-- Run in Supabase SQL Editor or via Supabase CLI.

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text,
  phone text,
  preferences text not null check (preferences in ('email', 'text', 'both')),
  source text not null default 'website',
  brevo_contact_id bigint,
  brevo_synced_at timestamptz,
  brevo_sync_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscribers_contact_required check (
    email is not null or phone is not null
  )
);

create unique index if not exists subscribers_email_unique
  on public.subscribers (lower(email))
  where email is not null;

create unique index if not exists subscribers_phone_unique
  on public.subscribers (phone)
  where phone is not null;

create or replace function public.set_subscribers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscribers_updated_at on public.subscribers;

create trigger subscribers_updated_at
  before update on public.subscribers
  for each row
  execute function public.set_subscribers_updated_at();

alter table public.subscribers enable row level security;

-- No public policies: website signups go through the server (service role key).
-- Add authenticated admin policies when the mobile app admin ships.
