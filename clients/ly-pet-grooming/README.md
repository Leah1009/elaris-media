# L&Y's Pet Grooming — website

Static site (Next.js static export), built for bookings: fast, mobile-first, no 3D. No database, no backend, no monthly costs beyond hosting.

## Day-to-day edits
- **All text, phone, WhatsApp, email, hours, reviews, social links:** `src/content.ts`
- **Photos:** replace the files in `public/images/` keeping the same names:
  `hero.jpg` (most important), `result-1-before/after.jpg` … `result-3-…`, `service-*.jpg` (small round),
  `about.jpg`, `gallery-01.jpg` … `gallery-08.jpg`. JPG/WebP, ~1600px, < 350 KB.
- **Logo:** replace `public/images/logo.svg` (and `src/app/icon.svg` for the browser tab icon).
  If your logo is a PNG, set `site.logo` in `content.ts` to `/images/logo.png`.

## Run / build
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in /out — upload anywhere (Netlify, Cloudflare Pages, etc.)
```
Netlify: set **Base directory** to `clients/ly-pet-grooming` (config in `netlify.toml`).

## Before launch
Everything marked `⚠️ PLACEHOLDER` in `content.ts`, the real reviews, the domain (`site.url`),
and the Privacy/Terms templates in `src/app/privacy` and `src/app/terms` (have them reviewed).
