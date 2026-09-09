# Luxora database

Migrations in `migrations/` are applied, in order, to the `luxora` Supabase
project (ref `ihfhbfxsqsiotiofpyrr`, us-east-1). They are the source of
truth for the schema — this directory mirrors what's live, it isn't a
separate proposal.

To apply against a different environment with the Supabase CLI:

```
supabase link --project-ref <ref>
supabase db push
```
