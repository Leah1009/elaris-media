-- Security fix, same class as 038: review_requests/reviews only validate
-- their OWN business_id on insert (is_business_member(business_id)) — they
-- never checked that appointment_id/client_id actually belong to that
-- business. A malicious member of business B could insert a
-- review_requests row with business_id = B but appointment_id/client_id
-- borrowed from business A (guessed or enumerated UUIDs), corrupting A's
-- appointment with an unwanted review request (review_requests.appointment_id
-- is unique, so this also blocks A from ever requesting a review for that
-- appointment) and, once submitted, a reviews row crediting business B with
-- a review actually tied to A's appointment/client. Compound FKs make this
-- impossible at the database level, the same fix as automation_rules'
-- template_id in 038.
alter table public.appointments add constraint appointments_business_id_id_key unique (business_id, id);
alter table public.clients add constraint clients_business_id_id_key unique (business_id, id);

alter table public.review_requests drop constraint review_requests_appointment_id_fkey;
alter table public.review_requests
  add constraint review_requests_appointment_business_fkey
  foreign key (appointment_id, business_id) references public.appointments(id, business_id) on delete cascade;

alter table public.review_requests drop constraint review_requests_client_id_fkey;
alter table public.review_requests
  add constraint review_requests_client_business_fkey
  foreign key (client_id, business_id) references public.clients(id, business_id) on delete cascade;

alter table public.reviews drop constraint reviews_appointment_id_fkey;
alter table public.reviews
  add constraint reviews_appointment_business_fkey
  foreign key (appointment_id, business_id) references public.appointments(id, business_id) on delete cascade;

alter table public.reviews drop constraint reviews_client_id_fkey;
alter table public.reviews
  add constraint reviews_client_business_fkey
  foreign key (client_id, business_id) references public.clients(id, business_id) on delete cascade;
