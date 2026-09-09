-- Advisor fix: extensions should not live in the public schema.
create schema if not exists extensions;
alter extension btree_gist set schema extensions;
