/**
 * ─────────────────────────────────────────────────────────────
 *  L&Y'S PET GROOMING — ALL SITE CONTENT LIVES IN THIS FILE
 * ─────────────────────────────────────────────────────────────
 *
 *  Edit texts, phone, WhatsApp, hours, reviews and social links here.
 *
 *  PHOTOS
 *  Photos live in /public/images. The easiest way to update them is to
 *  overwrite the placeholder file keeping the SAME name
 *  (e.g. replace /public/images/hero.jpg with your own hero.jpg).
 *  Use JPG or WebP, around 1600px on the long side, under 350 KB each.
 *
 *  Anything marked  ⚠️ PLACEHOLDER  must be replaced before launch.
 */

export const site = {
  name: "L&Y's Pet Grooming",
  // ⚠️ PLACEHOLDER — final domain, used for SEO and social previews.
  url: "https://www.example.com",
  description:
    "Premium pet grooming with personalized care — bath & brush, full grooming, haircut & styling, deshedding, nail care and ear cleaning.",
  // Official logo. Replace /public/images/logo.svg (or point this to /images/logo.png).
  logo: "/images/logo.svg",
};

export const contact = {
  // ⚠️ PLACEHOLDER — shown on the page exactly as written.
  phoneDisplay: "(555) 000-0000",
  // ⚠️ PLACEHOLDER — digits only, with country code (1 = US).
  phoneDigits: "15550000000",
  // ⚠️ PLACEHOLDER — digits only, with country code.
  whatsappDigits: "15550000000",
  whatsappMessage: "Hi L&Y's! I'd like to book a grooming appointment for my pet.",
  // ⚠️ PLACEHOLDER
  email: "hello@example.com",
  // ⚠️ PLACEHOLDER
  serviceArea: "Your City & surrounding areas",
  // ⚠️ PLACEHOLDER
  hours: [
    { days: "Mon – Fri", time: "9:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 3:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  // ⚠️ PLACEHOLDER — full profile URLs.
  instagram: "https://instagram.com/",
  instagramHandle: "@lyspetgrooming",
  facebook: "https://facebook.com/",
  facebookName: "L&Y's Pet Grooming",
  /**
   * Where every "Book" button goes.
   * Empty ("") = opens WhatsApp with the message above.
   * Or paste a booking link (Square, MoeGo, Calendly…).
   */
  bookingUrl: "",
};

export const nav = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  title: "Premium Grooming.",
  titleAccent: "Personalized Care.",
  text: "Professional grooming tailored to your pet’s coat, comfort and individual needs.",
  primaryCta: "Book an Appointment",
  secondaryCta: "View Services",
  trust: ["Gentle Care", "Professional Grooming", "Personalized Attention"],
  // The most important photo of the site: a freshly groomed dog, bright,
  // beige/ivory setting. Vertical, 1400 × 1750 px.
  image: "/images/hero.jpg",
  imageAlt: "Freshly groomed dog at L&Y’s Pet Grooming",
};

/**
 * Results — 3 or 4 of your BEST transformations.
 * With `before` + `after` it shows a side-by-side comparison.
 * With only `after` it shows a single finished photo.
 * Vertical photos, 1000 × 1250 px, same framing for before & after.
 */
export const results = {
  title: "Beautiful Results. Happy Pets.",
  items: [
    { before: "/images/result-1-before.jpg", after: "/images/result-1-after.jpg", label: "Full Grooming" },
    { before: "/images/result-2-before.jpg", after: "/images/result-2-after.jpg", label: "Haircut & Styling" },
    { before: "/images/result-3-before.jpg", after: "/images/result-3-after.jpg", label: "Bath & Deshedding" },
  ] as { before?: string; after: string; label: string }[],
};

export const services = {
  title: "Grooming Services",
  intro: "Every service is adapted to your pet’s breed, coat and comfort.",
  // Small round photos, square 400 × 400 px.
  items: [
    { name: "Bath & Brush", text: "Gentle bath, blow-dry and a soft, thorough brush-out.", image: "/images/service-bath.jpg" },
    { name: "Full Grooming", text: "The complete experience: bath, haircut, nails and ears.", image: "/images/service-full.jpg" },
    { name: "Haircut & Styling", text: "Breed-standard or custom cuts, finished with precision.", image: "/images/service-haircut.jpg" },
    { name: "Deshedding", text: "Undercoat removal for a lighter, healthier coat.", image: "/images/service-deshedding.jpg" },
    { name: "Nail Care", text: "Careful trimming and smoothing for comfortable paws.", image: "/images/service-nails.jpg" },
    { name: "Ear Cleaning", text: "Gentle cleaning to keep ears fresh and comfortable.", image: "/images/service-ears.jpg" },
  ],
};

export const why = {
  title: "Why Pet Parents Choose L&Y’s",
  points: [
    { title: "Personalized Care", text: "Every pet is treated according to their individual needs." },
    { title: "Gentle Approach", text: "Comfort, patience and safety always come first." },
    { title: "Attention to Detail", text: "We focus on clean, polished and beautiful results." },
  ],
};

export const about = {
  title: "A Better Grooming Experience",
  paragraphs: [
    "At L&Y’s, every appointment is personal. We take the time to understand your pet so they feel calm and comfortable from start to finish.",
    "The goal is simple: a pet who leaves clean, cared for and beautifully presented.",
  ],
  // Vertical, 1200 × 1500 px — ideally the groomer with a pet.
  image: "/images/about.jpg",
  imageAlt: "Groomer caring for a dog at L&Y’s Pet Grooming",
};

export const gallery = {
  title: "Our Work",
  // 6 to 8 photos. Square crops work best (1200 × 1200 px).
  items: [
    { src: "/images/gallery-01.jpg", alt: "Groomed dog portrait" },
    { src: "/images/gallery-02.jpg", alt: "Dog after a full grooming" },
    { src: "/images/gallery-03.jpg", alt: "Freshly styled coat" },
    { src: "/images/gallery-04.jpg", alt: "Happy dog after a bath and brush" },
    { src: "/images/gallery-05.jpg", alt: "Neat haircut and styling" },
    { src: "/images/gallery-06.jpg", alt: "Soft, brushed coat" },
    { src: "/images/gallery-07.jpg", alt: "Groomed dog ready to go home" },
    { src: "/images/gallery-08.jpg", alt: "Clean and polished finish" },
  ],
  instagramCta: "See more on Instagram",
};

/**
 * ⚠️ PLACEHOLDER REVIEWS — replace with REAL reviews from real clients
 * (Google, Facebook, Instagram) and only with their permission.
 * Publishing invented testimonials is illegal in the US (FTC rule, 2024).
 * Maximum 3. `stars` = 1 to 5 (use the real rating the client gave).
 */
export const reviews = {
  title: "Loved by Pet Parents",
  items: [
    { stars: 5, quote: "Real client review goes here — one or two short sentences.", name: "Client Name" },
    { stars: 5, quote: "Second real review — what they loved about the experience.", name: "Client Name" },
    { stars: 5, quote: "Third real review — short, genuine and specific.", name: "Client Name" },
  ],
  // Optional: link to your Google / Facebook reviews page. Leave "" to hide.
  allReviewsUrl: "",
};

export const booking = {
  title: "Ready to Book Your Pet’s Grooming?",
  text: "Contact us today and let’s find the right grooming service for your pet.",
  bookCta: "Book Appointment",
  callCta: "Call Now",
  whatsappCta: "WhatsApp",
};

export const contactSection = {
  title: "Contact",
};

export const footer = {
  legal: [
    { label: "Privacy Policy", href: "/privacy/" },
    { label: "Terms", href: "/terms/" },
  ],
};
