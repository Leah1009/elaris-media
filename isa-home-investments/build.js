/*
  Minimal, dependency-free build step for this framework-less static site.
  Vercel runs `npm run build` (see package.json) before deploying, which
  gives us access to real Project Environment Variables at build time.
  This script substitutes the __SUPABASE_URL__ / __SUPABASE_PUBLISHABLE_KEY__
  placeholder tokens in index.html with the real values and writes the
  result to dist/, which is what Vercel actually serves (see vercel.json).
  Nothing here handles secrets: the Supabase publishable key is meant to be
  public client-side (Row Level Security is the real security boundary),
  and no service_role key is ever read or referenced by this script.
*/
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error(
    'Build failed: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ' +
    'are not set. Add them in Vercel → Project Settings → Environment Variables.'
  );
  process.exit(1);
}

const rootDir = __dirname;
const outDir = path.join(rootDir, 'dist');

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

let html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
html = html
  .split('__SUPABASE_URL__').join(SUPABASE_URL)
  .split('__SUPABASE_PUBLISHABLE_KEY__').join(SUPABASE_PUBLISHABLE_KEY);
fs.writeFileSync(path.join(outDir, 'index.html'), html);

fs.cpSync(path.join(rootDir, 'assets'), path.join(outDir, 'assets'), { recursive: true });

console.log('Build complete -> dist/ (Supabase config injected from environment variables)');
