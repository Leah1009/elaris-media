-- Review requests: created by an admin/staff action for a completed
-- appointment. The token is the only way a public visitor can reach the
-- review form — there is no anon SELECT policy on either table, mirroring
-- the create_online_booking / find_client_for_booking pattern: all public
-- access goes through SECURITY DEFINER functions below.
create table public.review_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  appointment_id uuid not null unique references public.appointments(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  token uuid not null unique default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'completed')),
  requested_at timestamptz not null default now(),
  completed_at timestamptz
);

create index review_requests_business_idx on public.review_requests(business_id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  appointment_id uuid not null unique references public.appointments(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  status text not null default 'published' check (status in ('published', 'hidden')),
  response text,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger reviews_set_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

create index reviews_business_idx on public.reviews(business_id, status, created_at desc);

alter table public.review_requests enable row level security;
alter table public.reviews enable row level security;

create policy "review_requests_select_member" on public.review_requests
for select using (public.is_business_member(business_id));

create policy "review_requests_insert_member" on public.review_requests
for insert with check (public.is_business_member(business_id));

create policy "reviews_select_member" on public.reviews
for select using (public.is_business_member(business_id));

-- Only respond/hide — the review content itself is only ever written by
-- submit_review() below, never directly by a member.
create policy "reviews_update_admin" on public.reviews
for update using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

alter policy "review_requests_select_member" on public.review_requests to authenticated;
alter policy "review_requests_insert_member" on public.review_requests to authenticated;
alter policy "reviews_select_member" on public.reviews to authenticated;
alter policy "reviews_update_admin" on public.reviews to authenticated;

-- Public: look up a pending review request by its token. Returns nothing
-- useful beyond what's needed to render "Leave a review for {business}" —
-- never exposes the client's own name/phone/email back to them.
create or replace function public.get_review_request(p_token uuid)
returns table (business_name text, status text)
language sql
security definer
stable
set search_path = public
as $$
  select b.name, rr.status
  from public.review_requests rr
  join public.businesses b on b.id = rr.business_id
  where rr.token = p_token;
$$;

revoke execute on function public.get_review_request(uuid) from public;
grant execute on function public.get_review_request(uuid) to anon, authenticated;

-- Public: submit a review via its request token. Atomic guard against
-- double-submission (status must still be 'pending') and against a
-- forged/guessed appointment_id (always taken from the request row itself,
-- never from client input).
create or replace function public.submit_review(
  p_token uuid,
  p_rating integer,
  p_comment text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.review_requests;
  v_review_id uuid;
begin
  if p_rating < 1 or p_rating > 5 then
    raise exception 'Rating must be between 1 and 5.';
  end if;

  select * into v_request from public.review_requests where token = p_token for update;

  if v_request.id is null then
    raise exception 'Review link is invalid.';
  end if;
  if v_request.status <> 'pending' then
    raise exception 'This review has already been submitted.';
  end if;

  insert into public.reviews (business_id, appointment_id, client_id, rating, comment)
  values (v_request.business_id, v_request.appointment_id, v_request.client_id, p_rating, nullif(trim(p_comment), ''))
  returning id into v_review_id;

  update public.review_requests set status = 'completed', completed_at = now() where id = v_request.id;

  return v_review_id;
end;
$$;

revoke execute on function public.submit_review(uuid, integer, text) from public;
grant execute on function public.submit_review(uuid, integer, text) to anon, authenticated;

-- Public: published reviews + average rating for the business's public
-- booking page. Deliberately excludes the client's full identity — first
-- name and last initial only, same disclosure level as find_client_for_booking.
create or replace function public.get_public_reviews(p_business_id uuid)
returns table (
  id uuid,
  rating integer,
  comment text,
  response text,
  client_display_name text,
  created_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    r.id,
    r.rating,
    r.comment,
    r.response,
    case
      when position(' ' in c.full_name) > 0 then
        split_part(c.full_name, ' ', 1) || ' ' || left(split_part(c.full_name, ' ', 2), 1) || '.'
      else c.full_name
    end,
    r.created_at
  from public.reviews r
  join public.clients c on c.id = r.client_id
  where r.business_id = p_business_id and r.status = 'published'
  order by r.created_at desc
  limit 50;
$$;

revoke execute on function public.get_public_reviews(uuid) from public;
grant execute on function public.get_public_reviews(uuid) to anon, authenticated;

create or replace function public.get_public_review_summary(p_business_id uuid)
returns table (average_rating numeric, review_count integer)
language sql
security definer
stable
set search_path = public
as $$
  select round(avg(rating), 1), count(*)::integer
  from public.reviews
  where business_id = p_business_id and status = 'published';
$$;

revoke execute on function public.get_public_review_summary(uuid) from public;
grant execute on function public.get_public_review_summary(uuid) to anon, authenticated;
