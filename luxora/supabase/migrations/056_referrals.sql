-- Referral program: every business gets a unique code (backfilled per-row
-- for existing businesses since the default is volatile). Attribution is
-- captured server-side at registration (registration.ts), never trusted
-- from frontend state alone. Qualification only happens when
-- subscriptions.status actually transitions to 'active' — today that's
-- exclusively a platform-admin action (updateSubscription), since no
-- self-service Stripe Billing charge flow exists yet for Luxore's own
-- subscription fees (distinct from each business's own Stripe Connect
-- account for their clients' payments).

alter table public.businesses
  add column referral_code text unique not null default substr(md5(gen_random_uuid()::text), 1, 8);

create table public.referral_program_settings (
  id boolean primary key default true check (id),
  program_active boolean not null default true,
  reward_amount_cents integer not null default 5000,
  reward_type text not null default 'gift_card' check (reward_type in ('gift_card', 'account_credit', 'cash')),
  updated_at timestamptz not null default now()
);
insert into public.referral_program_settings (id) values (true);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_business_id uuid not null references public.businesses(id) on delete cascade,
  referred_business_id uuid unique references public.businesses(id) on delete set null,
  referral_code text not null,
  status text not null default 'signed_up' check (status in ('signed_up', 'trialing', 'qualified', 'rejected')),
  rejected_reason text,
  created_at timestamptz not null default now(),
  qualified_at timestamptz,
  check (referrer_business_id is distinct from referred_business_id)
);

create index referrals_referrer_idx on public.referrals(referrer_business_id, created_at desc);

create table public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null unique references public.referrals(id) on delete cascade,
  referrer_business_id uuid not null references public.businesses(id) on delete cascade,
  amount_cents integer not null,
  reward_type text not null check (reward_type in ('gift_card', 'account_credit', 'cash')),
  status text not null default 'pending' check (status in ('pending', 'qualified', 'issued', 'rejected')),
  qualified_at timestamptz,
  issued_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger referral_rewards_set_updated_at
before update on public.referral_rewards
for each row execute function public.set_updated_at();

alter table public.referral_program_settings enable row level security;
alter table public.referrals enable row level security;
alter table public.referral_rewards enable row level security;

create policy "referral_program_settings_select_all" on public.referral_program_settings
for select to authenticated, anon
using (true);

create policy "referral_program_settings_admin_write" on public.referral_program_settings
for all to authenticated
using (public.is_platform_admin())
with check (public.is_platform_admin());

-- A business sees referrals it made; admins see everything. The referred
-- business itself has no reason to see it was referred, so no policy for
-- referred_business_id — the referrer already knows who they invited.
create policy "referrals_select_referrer" on public.referrals
for select to authenticated
using (public.is_business_member(referrer_business_id));

create policy "referrals_admin_all" on public.referrals
for all to authenticated
using (public.is_platform_admin())
with check (public.is_platform_admin());

-- Registration itself runs through completeBusinessRegistrationIfNeeded
-- with the signed-in user's own session (not service-role), so the
-- referred business's own owner needs insert rights on the referrals row
-- created for their own signup — restricted to only ever naming themselves
-- as the referred business, never someone else's.
create policy "referrals_insert_self" on public.referrals
for insert to authenticated
with check (public.is_business_member(referred_business_id));

create policy "referral_rewards_select_referrer" on public.referral_rewards
for select to authenticated
using (public.is_business_member(referrer_business_id));

create policy "referral_rewards_admin_all" on public.referral_rewards
for all to authenticated
using (public.is_platform_admin())
with check (public.is_platform_admin());

-- The reward names the REFERRER as its business_id, but this insert
-- happens during the REFERRED business's own registration — so the check
-- follows referral_id back to referrals.referred_business_id, which is the
-- new user's own business, rather than referrer_business_id directly.
create policy "referral_rewards_insert_self" on public.referral_rewards
for insert to authenticated
with check (
  exists (
    select 1 from public.referrals r
    where r.id = referral_id and public.is_business_member(r.referred_business_id)
  )
);
