/**
 * Editorial photography used on the public marketing site, sourced from
 * Pinterest references the business owner supplied. Mapped to sections by
 * actually-confirmed content (verified against the live deployed site,
 * since these URLs are unreachable from the dev sandbox) — swapping a
 * photo later means changing one URL here, no component changes needed.
 *
 * NOTE: "lashesBrows" has no dedicated photo (none of the supplied images
 * show lash/brow work) — the section renders a text-only tile for it
 * instead of forcing a wrong photo. "finalCta" reuses "hero" — no wide
 * panoramic shot was supplied yet. Swap these first if new photography
 * arrives.
 */
export const PHOTO_ASSETS = {
  hero: "https://i.pinimg.com/originals/8d/f5/db/8df5dbceaa157a59d536cf4290773977.jpg",
  about: "https://i.pinimg.com/originals/fb/91/3a/fb913a41a1fd4348deb7f75533f7c66a.jpg",
  hair: "https://i.pinimg.com/originals/e7/5f/a9/e75fa9e6161665f17af8baf58e393354.jpg",
  nails: "https://i.pinimg.com/originals/90/dd/1d/90dd1d56ddf90bc57cae53266fe54c15.jpg",
  lashesBrows: null,
  makeup: "https://i.pinimg.com/originals/06/4d/a6/064da65dad5349f282cebbaf6893e624.jpg",
  paymentsFrontDesk: "https://i.pinimg.com/originals/c7/2b/34/c72b3470411cf00864beee461df22b0a.jpg",
  team: "https://i.pinimg.com/originals/2e/69/19/2e6919ffcfc755e54eb3f2d356a7a004.jpg",
  finalCta: "https://i.pinimg.com/originals/8d/f5/db/8df5dbceaa157a59d536cf4290773977.jpg",
} as const;
