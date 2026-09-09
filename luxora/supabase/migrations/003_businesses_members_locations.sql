create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  business_type text not null check (business_type in (
    'hair_salon','nail_salon','lash_studio','brow_studio',
    'makeup_studio','beauty_suite','full_service_beauty_salon','other'
  )),
  business_type_other text,
  owner_profile_id uuid not null references public.profiles(id),
  phone text,
  email text,
  address_line1 text,
  city text,
  state text,
  zip text,
  description text,
  status text not null default 'active' check (status in ('active','locked','suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger businesses_set_updated_at
before update on public.businesses
for each row execute function public.set_updated_at();

create table public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner','manager','staff')),
  status text not null default 'active' check (status in ('active','invited','disabled')),
  created_at timestamptz not null default now(),
  unique (business_id, profile_id)
);

create index business_members_profile_idx on public.business_members(profile_id);
create index business_members_business_idx on public.business_members(business_id);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  address_line1 text,
  city text,
  state text,
  zip text,
  phone text,
  is_primary boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger locations_set_updated_at
before update on public.locations
for each row execute function public.set_updated_at();

create index locations_business_idx on public.locations(business_id);
