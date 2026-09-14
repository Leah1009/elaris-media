-- Public-facing website/booking language, independent of the internal
-- dashboard language (preferred_language). A business can offer its public
-- page and booking wizard in English only, Spanish only, or both — in the
-- "both" case visitors get an EN/ES switcher on the public page.
alter table public.businesses
  add column public_language_mode text not null default 'en'
  check (public_language_mode in ('en', 'es', 'both'));
