# L&Y's Pet Grooming — website

Static site (Next.js static export + a lightweight WebGL stage). No database, no backend, no monthly costs beyond hosting.

## Day-to-day edits
- **All text, phone, WhatsApp, email, hours, reviews, social links:** `src/content.ts`
- **Photos:** replace the files in `public/images/` keeping the same names
  (`about.jpg`, `before.jpg`, `after.jpg`, `work-01.jpg` … `work-06.jpg`). JPG/WebP, ~1600px, < 350 KB.
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
