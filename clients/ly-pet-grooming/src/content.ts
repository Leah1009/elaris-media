/**
 * ─────────────────────────────────────────────────────────────
 *  L&Y'S PET GROOMING — ALL SITE CONTENT LIVES IN THIS FILE
 * ─────────────────────────────────────────────────────────────
 *
 *  Edit texts, phone, WhatsApp, hours, reviews and social links here.
 *  Nothing else in the project needs to change for day-to-day updates.
 *
 *  PHOTOS
 *  Put photos in /public/images and reference them as "/images/file.jpg".
 *  The easiest way: replace the placeholder files keeping the SAME name
 *  (e.g. overwrite /public/images/about.jpg with your own about.jpg).
 *  Recommended: JPG or WebP, ~1600px on the long side, under 350 KB each.
 *
 *  Anything marked  ⚠️ PLACEHOLDER  must be replaced before launch.
 */

export type ServiceObject = "bottle" | "scissors" | "comb" | "trio" | "scissors-closed" | "bottle-tilt";

export const site = {
  name: "L&Y's Pet Grooming",
  shortName: "L&Y's",
  // ⚠️ PLACEHOLDER — final domain, used for SEO (sitemap, social previews).
  url: "https://www.example.com",
  description:
    "Boutique pet grooming with personalized care — bath & brush, full grooming, haircut & styling, nail care, deshedding and ear cleaning.",
  // Official logo. Replace /public/images/logo.svg (or point to logo.png).
  logo: "/images/logo.svg",
  // Show the business name as text next to the logo in the header.
  showWordmark: true,
};

export const contact = {
  // ⚠️ PLACEHOLDER — shown on the page exactly as written here.
  phoneDisplay: "(555) 000-0000",
  // ⚠️ PLACEHOLDER — digits only, with country code (1 = US).
  phoneDigits: "15550000000",
  // ⚠️ PLACEHOLDER — digits only, with country code. Can be the same as phone.
  whatsappDigits: "15550000000",
  whatsappMessage: "Hi L&Y's! I'd like to book a grooming appointment for my pet.",
  // ⚠️ PLACEHOLDER
  email: "hello@example.com",
  // ⚠️ PLACEHOLDER
  serviceArea: "Your City & surrounding areas",
  // ⚠️ PLACEHOLDER
  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 3:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  // ⚠️ PLACEHOLDER — full profile URLs.
  instagram: "https://instagram.com/",
  instagramHandle: "@lyspetgrooming",
  facebook: "https://facebook.com/",
  /**
   * "Book Appointment" button destination.
   * Leave empty ("") to open WhatsApp with the message above.
   * Or paste a booking link (Square, Calendly, MoeGo, etc.).
   */
  bookingUrl: "",
};

export const nav = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Our Work", href: "#work" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Boutique Pet Grooming",
  titleLine1: "Professional Grooming.",
  titleLine2: "Thoughtful Care.",
  text: "A personalized grooming experience designed around your pet’s comfort, coat and individual needs.",
  primaryCta: "Book an Appointment",
  secondaryCta: "Explore Services",
};

export const services = {
  eyebrow: "Services",
  title: "Every groom, tailored.",
  intro: "Each visit is shaped around your pet’s coat, temperament and routine — never a one-size-fits-all appointment.",
  /**
   * `object` decides which 3D tool takes the spotlight while the service is active:
   *  bottle · bottle-tilt · scissors · scissors-closed · comb · trio (all three)
   */
  items: [
    {
      title: "Bath & Brush",
      text: "A gentle bath with coat-appropriate products, a thorough blow-dry and a careful brush-out for a soft, fresh finish.",
      object: "bottle",
    },
    {
      title: "Full Grooming",
      text: "The complete experience: bath, brush, haircut, nails and ears — finished with care and attention to every detail.",
      object: "trio",
    },
    {
      title: "Haircut & Styling",
      text: "Breed-standard or custom styles, cut with precision and adapted to your pet’s lifestyle and comfort.",
      object: "scissors",
    },
    {
      title: "Nail Care",
      text: "Calm, careful trimming and smoothing to keep paws comfortable and healthy between visits.",
      object: "scissors-closed",
    },
    {
      title: "Deshedding",
      text: "Targeted detangling and undercoat removal that reduces shedding and leaves the coat light and manageable.",
      object: "comb",
    },
    {
      title: "Ear Cleaning",
      text: "Gentle cleaning to keep ears fresh and comfortable, done patiently as part of every routine.",
      object: "bottle-tilt",
    },
  ] satisfies { title: string; text: string; object: ServiceObject }[],
};

export const about = {
  eyebrow: "About",
  title: "Care Beyond the Groom",
  paragraphs: [
    "At L&Y’s, grooming is more than a haircut. We take the time to understand each pet — their coat, their comfort and the pace that feels right for them.",
    "Every appointment is calm, patient and unhurried, with careful attention to the small details that make a pet look and feel their best.",
  ],
  signature: "— The L&Y’s Team",
  // Recommended: vertical photo, 1200 × 1500 px.
  image: "/images/about.jpg",
  imageAlt: "Groomer gently brushing a dog at L&Y’s Pet Grooming",
};

export const why = {
  eyebrow: "Why L&Y’s",
  title: "Small details, made with care.",
  points: [
    {
      title: "Personalized Care",
      text: "Every groom is planned around your pet’s coat, temperament and needs.",
    },
    {
      title: "Gentle Approach",
      text: "Patient, calm handling so each visit feels safe and comfortable.",
    },
    {
      title: "Attention to Detail",
      text: "Clean lines, soft finishes and the small touches that make the difference.",
    },
  ],
};

export const work = {
  eyebrow: "Our Work",
  title: "Fresh Looks. Happy Pets.",
  // Before & After — use two photos with the same framing. Recommended 1600 × 1000 px.
  beforeAfter: {
    before: "/images/before.jpg",
    after: "/images/after.jpg",
    alt: "Before and after a full grooming session",
    caption: "Full grooming — before & after",
  },
  // Gallery — 5 to 8 photos. `shape`: "portrait" | "square" | "landscape".
  gallery: [
    { src: "/images/work-01.jpg", alt: "Freshly groomed dog", caption: "Haircut & Styling", shape: "portrait" },
    { src: "/images/work-02.jpg", alt: "Dog after a bath and brush", caption: "Bath & Brush", shape: "landscape" },
    { src: "/images/work-03.jpg", alt: "Close-up of a soft, brushed coat", caption: "Deshedding", shape: "square" },
    { src: "/images/work-04.jpg", alt: "Groomed dog portrait", caption: "Full Grooming", shape: "portrait" },
    { src: "/images/work-05.jpg", alt: "Neatly styled pet", caption: "Haircut & Styling", shape: "landscape" },
    { src: "/images/work-06.jpg", alt: "Happy pet after grooming", caption: "Full Grooming", shape: "portrait" },
  ] satisfies { src: string; alt: string; caption: string; shape: "portrait" | "square" | "landscape" }[],
};

/**
 * ⚠️ PLACEHOLDER REVIEWS — replace with REAL reviews from real clients
 * (Google, Facebook, Instagram), with their permission. Publishing invented
 * testimonials is illegal in the US (FTC rule on fake reviews, 2024).
 * Maximum 3.
 */
export const reviews = {
  eyebrow: "Reviews",
  title: "Kind words.",
  items: [
    {
      quote: "A real review from a happy client will go here — two or three sentences about their pet’s experience.",
      name: "Client Name",
      detail: "Pet name · Service",
    },
    {
      quote: "A second genuine review, ideally mentioning what made the visit feel different and personal.",
      name: "Client Name",
      detail: "Pet name · Service",
    },
    {
      quote: "A third short review. Keep each one brief so the section stays clean and easy to read.",
      name: "Client Name",
      detail: "Pet name · Service",
    },
  ],
};

export const contactSection = {
  eyebrow: "Contact & Booking",
  title: "Let’s plan their next groom.",
  text: "Call, send us a message on WhatsApp or book directly — we’ll help you choose the right service for your pet.",
  callCta: "Call Now",
  whatsappCta: "WhatsApp",
  bookCta: "Book Appointment",
};

export const finalCta = {
  title: "Ready for Their Freshest Look?",
  text: "Contact us to schedule your pet’s next grooming appointment.",
  cta: "Book an Appointment",
};

export const footer = {
  links: [
    { label: "Services", href: "/#services" },
    { label: "About", href: "/#about" },
    { label: "Our Work", href: "/#work" },
    { label: "Contact", href: "/#contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy/" },
    { label: "Terms", href: "/terms/" },
  ],
};
