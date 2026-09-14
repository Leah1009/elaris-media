/**
 * Editorial photography used on the public marketing site, sourced from
 * Pinterest references the business owner supplied. Mapped to sections by
 * content wherever the photo's subject was confirmed, and by the owner's
 * stated ordering otherwise. Swapping a photo later means changing one URL
 * here — no component changes needed.
 *
 * NOTE: "team" and "finalCta" currently reuse "about"/"hero" — no dedicated
 * team photo or wide panoramic shot was supplied yet. Swap these two first
 * if new photography arrives.
 */
export const PHOTO_ASSETS = {
  hero: "https://i.pinimg.com/736x/8d/f5/db/8df5dbceaa157a59d536cf4290773977.jpg",
  about: "https://i.pinimg.com/1200x/e7/5f/a9/e75fa9e6161665f17af8baf58e393354.jpg",
  hair: "https://i.pinimg.com/1200x/90/dd/1d/90dd1d56ddf90bc57cae53266fe54c15.jpg",
  nails: "https://i.pinimg.com/1200x/06/4d/a6/064da65dad5349f282cebbaf6893e624.jpg",
  lashesBrows: "https://i.pinimg.com/736x/c7/2b/34/c72b3470411cf00864beee461df22b0a.jpg",
  makeup: "https://i.pinimg.com/736x/2e/69/19/2e6919ffcfc755e54eb3f2d356a7a004.jpg",
  paymentsFrontDesk: "https://i.pinimg.com/1200x/fb/91/3a/fb913a41a1fd4348deb7f75533f7c66a.jpg",
  team: "https://i.pinimg.com/1200x/e7/5f/a9/e75fa9e6161665f17af8baf58e393354.jpg",
  finalCta: "https://i.pinimg.com/736x/8d/f5/db/8df5dbceaa157a59d536cf4290773977.jpg",
} as const;
