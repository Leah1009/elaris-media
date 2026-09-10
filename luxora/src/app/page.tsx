import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SiteNav } from "@/components/marketing/site-nav";
import { FullDashboardMock } from "@/components/marketing/dashboard-mock";
import {
  BookingsVisual,
  ClientsVisual,
  PaymentsVisual,
  InventoryVisual,
  MarketingVisual,
  WebsiteVisual,
} from "@/components/marketing/feature-visual";
import { PhoneMock } from "@/components/marketing/phone-mock";
import {
  ClientProfileMock,
  CheckoutMock,
  InventoryMock,
  AutomationMock,
  WebsiteExamplesMock,
} from "@/components/marketing/section-mocks";
import { HARDWARE_CATALOG } from "@/lib/luxora/hardware-catalog";
import { ReviewsPlaceholder } from "@/components/marketing/reviews-placeholder";
import { Faq } from "@/components/marketing/faq";

const HERO_IMAGE = "https://i.pinimg.com/736x/8d/f5/db/8df5dbceaa157a59d536cf4290773977.jpg";

const OVERVIEW_FEATURES = [
  { title: "Bookings & Calendar", body: "An hourly calendar built around your real business hours, with 24/7 online booking.", Visual: BookingsVisual },
  { title: "Client Profiles", body: "Every visit, note, form and preference in one place.", Visual: ClientsVisual },
  { title: "Payments & POS", body: "Deposits, cards and manual payments — one real record of every transaction.", Visual: PaymentsVisual },
  { title: "Inventory", body: "Track products and retail stock alongside the services that use them.", Visual: InventoryVisual },
  { title: "Marketing & Automations", body: "Reminders, review requests and loyalty — built in, not bolted on.", Visual: MarketingVisual },
  { title: "Your Own Website", body: "A branded booking page clients can find, browse and book from.", Visual: WebsiteVisual },
];

const STEPS = [
  { step: "01", title: "Set up your business", body: "Add your services, staff, hours and locations in minutes." },
  { step: "02", title: "Get booked online", body: "Share your Luxore page so clients can book themselves, any time." },
  { step: "03", title: "Run and grow your business with Luxore", body: "Automated reminders, reviews and reports help you run — and grow — the business." },
];

const FOOTER_GROUPS: { title: string; links: { label: string; href?: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Online Booking", href: "#features" },
      { label: "Clients", href: "#features" },
      { label: "Payments", href: "#payments" },
      { label: "Marketing", href: "#features" },
      { label: "Websites", href: "#features" },
      { label: "Hardware", href: "#payments" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Contact" },
      { label: "Support" },
      { label: "Help Center" },
      { label: "Contact Support" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Privacy Policy" }, { label: "Terms of Service" }, { label: "Cookie Preferences" }],
  },
];

export default function HomePage() {
  return (
    <main>
      <SiteNav />

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="" className="animate-hero-zoom h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/75 via-charcoal/55 to-charcoal/85" />
        </div>

        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-16 text-center sm:px-10">
          <span className="animate-hero-fade-up font-display text-xs uppercase tracking-[0.4em] text-gold" style={{ animationDelay: "0.1s" }}>
            The all-in-one platform for beauty businesses
          </span>
          <h1 className="animate-hero-fade-up mt-6 font-display text-4xl leading-tight text-white sm:text-6xl" style={{ animationDelay: "0.25s" }}>
            Built for beauty businesses that expect more.
          </h1>
          <p className="animate-hero-fade-up mt-6 max-w-xl text-balance text-base text-white/85 sm:text-lg" style={{ animationDelay: "0.4s" }}>
            Run your entire beauty business from one beautifully connected platform —
            bookings, clients, payments, inventory, marketing and your own website.
          </p>
          <div className="animate-hero-fade-up mt-10 flex flex-col items-center gap-4" style={{ animationDelay: "0.55s" }}>
            <Link href="/register" className="rounded-sm bg-gold-deep px-9 py-3.5 text-sm font-medium tracking-wide text-white transition hover:opacity-90">
              Start Your Free Month
            </Link>
            <Link href="/login" className="text-sm font-medium tracking-wide text-white/70 underline-offset-4 transition hover:text-white hover:underline">
              Log In
            </Link>
          </div>
          <p className="animate-hero-fade-up mt-4 text-xs text-white/60" style={{ animationDelay: "0.65s" }}>
            30 days free. No credit card required.
          </p>
        </div>
      </section>

      {/* MEET LUXORE */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <Reveal className="text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Meet Luxore</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-5xl">Meet Luxore.</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink">
            Your entire beauty business. One beautifully connected platform.
          </p>
        </Reveal>
        <Reveal delayMs={150} className="mt-14">
          <FullDashboardMock />
        </Reveal>
      </section>

      {/* EVERYTHING, CONNECTED */}
      <section id="features" className="scroll-mt-20 bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Everything, connected</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">One platform, every part of the business.</h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OVERVIEW_FEATURES.map((f, i) => (
              <Reveal key={f.title} delayMs={i * 80}>
                <div className="group h-full rounded-md border border-border bg-white p-6 transition duration-300 hover:border-gold-deep hover:shadow-md hover:shadow-charcoal/5">
                  <f.Visual />
                  <h3 className="mt-4 font-display text-lg text-charcoal">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-ink">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKINGS & CALENDAR */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Bookings & Calendar</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">Bookings that work while you don&apos;t.</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">
              An hourly calendar built around each staff member&apos;s real schedule — availability, service
              duration, business hours and blocked time all respected automatically. Clients see real open times
              and book themselves, any hour of the day.
            </p>
            <ul className="mt-5 flex flex-col gap-2 text-sm text-ink">
              <li>— 24/7 online booking, no phone calls required</li>
              <li>— Staff-specific availability and qualified services</li>
              <li>— Business hours and blocked time built into every slot</li>
              <li>— Full appointment management: edit, reschedule, cancel</li>
            </ul>
          </Reveal>
          <Reveal delayMs={120}>
            <PhoneMock />
          </Reveal>
        </div>
      </section>

      {/* CLIENTS & FORMS */}
      <section className="bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <ClientProfileMock />
          </Reveal>
          <Reveal delayMs={120} className="order-1 lg:order-2">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Clients & Forms</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">Know every client.</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">
              Visit history, notes, allergies and preferences travel with every client automatically. The New
              Client form collects what you need up front — and syncs straight into their profile, so nothing
              gets typed twice.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PAYMENTS + HARDWARE */}
      <section id="payments" className="scroll-mt-20 mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <Reveal className="text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Payments</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">Payments, your way.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-ink sm:text-base">
            From cards and cash today to Tap to Pay and a complete front-desk setup, Luxore brings appointments,
            checkout and payments together in one connected experience.
          </p>
        </Reveal>

        <Reveal delayMs={120} className="mx-auto mt-14 max-w-sm">
          <CheckoutMock />
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {HARDWARE_CATALOG.map((hw, i) => (
            <Reveal key={hw.key} delayMs={i * 100} className="text-center">
              <span className="font-display text-3xl text-gold">{hw.index}</span>
              <h3 className="mt-3 font-display text-xl text-charcoal">{hw.headline}</h3>
              <p className="mt-2 text-sm text-ink">{hw.body}</p>
              <button
                type="button"
                disabled
                title="Hardware details are coming soon."
                className="mt-4 rounded-sm border border-border px-5 py-2 text-xs font-medium tracking-wide text-ink/50"
              >
                {hw.cta}
              </button>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-ink/50">
          Hardware options are still being finalized — exact models, pricing and availability will be announced
          closer to launch.
        </p>
      </section>

      {/* INVENTORY */}
      <section className="bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Inventory</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">
              Know what&apos;s selling — and what&apos;s running out.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">
              Track retail products and the services that use them side by side, with low-stock alerts before
              you run out mid-appointment.
            </p>
          </Reveal>
          <Reveal delayMs={120}>
            <InventoryMock />
          </Reveal>
        </div>
      </section>

      {/* MARKETING & GROWTH */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <AutomationMock />
          </Reveal>
          <Reveal delayMs={120} className="order-1 lg:order-2">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Marketing & Growth</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">Turn empty appointments into revenue.</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">
              Confirmations, deposit reminders and review requests trigger automatically around every
              appointment, alongside built-in loyalty points and promo codes. Connect an SMS or email
              provider and they go out on their own.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PERSONALIZED WEBSITES */}
      <section className="bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Your Own Website</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">
              Your business deserves more than a booking link.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink sm:text-base">
              Every Luxore business gets its own branded page — logo, colors and photos included.
            </p>
          </Reveal>
          <Reveal delayMs={120} className="mt-14">
            <WebsiteExamplesMock />
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 bg-charcoal py-24 text-cream">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <Reveal className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold">How it works</span>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Up and running in one sitting.</h2>
          </Reveal>

          <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent sm:block" />
            {STEPS.map((s, i) => (
              <Reveal key={s.step} delayMs={i * 150} className="relative text-center sm:text-left">
                <span className="relative z-10 inline-block bg-charcoal pr-3 font-display text-4xl text-gold">{s.step}</span>
                <h3 className="mt-4 font-display text-xl text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-20 mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <Reveal>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">About Luxore</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">
              Beauty businesses shouldn&apos;t need five different tools to run one business.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">
              A booking app for the calendar, a spreadsheet for clients, a separate tool for payments, a
              website that never quite matches — Luxore replaces all of it with one connected platform, built
              around the real day-to-day of a salon, spa or studio.
            </p>
          </Reveal>
          <Reveal delayMs={120}>
            <div className="overflow-hidden rounded-md border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_IMAGE} alt="" className="h-80 w-full object-cover sm:h-[26rem]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section className="bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Success Stories</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">From real Luxore businesses.</h2>
          </Reveal>
          <Reveal delayMs={120} className="mt-14">
            <ReviewsPlaceholder />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-cream-deep/30 px-6 py-24 sm:px-10">
        <Reveal className="text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">FAQ</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">Questions, answered.</h2>
        </Reveal>
        <div className="mt-14">
          <Faq />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <Reveal>
          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">Ready to run it beautifully?</h2>
          <p className="mt-4 text-sm text-ink sm:text-base">30 days free. No credit card required.</p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-sm bg-charcoal px-10 py-3.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft"
          >
            Start Your Free Month
          </Link>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <span className="font-display text-sm uppercase tracking-[0.3em] text-charcoal">Luxore</span>
              <p className="mt-3 text-xs leading-relaxed text-ink/60">
                The all-in-one operating platform for beauty businesses.
              </p>
            </div>
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{group.title}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.links.map((link) =>
                    link.href ? (
                      <li key={link.label}>
                        <a href={link.href} className="text-sm text-ink/70 transition hover:text-gold-deep">
                          {link.label}
                        </a>
                      </li>
                    ) : (
                      <li key={link.label} className="text-sm text-ink/40">
                        {link.label}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-xs text-ink/50">© {new Date().getFullYear()} Luxore. All rights reserved.</p>
            <div className="flex gap-4 text-xs text-ink/40">
              <span>Instagram</span>
              <span>Facebook</span>
              <span>TikTok</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
