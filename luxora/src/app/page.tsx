import Link from "next/link";
import { Reveal } from "@/components/reveal";

const HERO_IMAGE = "https://i.pinimg.com/736x/8d/f5/db/8df5dbceaa157a59d536cf4290773977.jpg";

const FEATURES = [
  {
    title: "Bookings & Calendar",
    body: "An hourly calendar built around your real business hours, with online booking clients can use 24/7.",
  },
  {
    title: "Client Profiles",
    body: "Every visit, note, form and preference in one place — no more digging through spreadsheets or texts.",
  },
  {
    title: "Payments",
    body: "Take deposits, cards and manual payments, and keep a real record of every transaction.",
  },
  {
    title: "Inventory",
    body: "Track products and retail stock alongside the services that use them.",
  },
  {
    title: "Marketing",
    body: "Automated reminders, review requests and loyalty — built in, not bolted on.",
  },
  {
    title: "Your Own Website",
    body: "A branded booking page clients can find, browse and book from — no separate site needed.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Set up your business",
    body: "Add your services, staff, hours and locations in minutes.",
  },
  {
    step: "02",
    title: "Get booked online",
    body: "Share your Luxore page so clients can book themselves, any time.",
  },
  {
    step: "03",
    title: "Grow with what's built in",
    body: "Automated reminders, reviews and reports help you run — and grow — the business.",
  },
];

export default function HomePage() {
  return (
    <main>
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-display text-sm uppercase tracking-[0.35em] text-white">Luxore</span>
        <Link
          href="/login"
          className="text-sm font-medium tracking-wide text-white/90 transition hover:text-white"
        >
          Log In
        </Link>
      </header>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt=""
            className="animate-hero-zoom h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/80" />
        </div>

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
          <span
            className="animate-hero-fade-up font-display text-xs uppercase tracking-[0.4em] text-gold"
            style={{ animationDelay: "0.1s" }}
          >
            The all-in-one platform for beauty businesses
          </span>
          <h1
            className="animate-hero-fade-up mt-6 font-display text-4xl leading-tight text-white sm:text-6xl"
            style={{ animationDelay: "0.25s" }}
          >
            Built for beauty businesses that expect more.
          </h1>
          <p
            className="animate-hero-fade-up mt-6 max-w-xl text-balance text-base text-white/85 sm:text-lg"
            style={{ animationDelay: "0.4s" }}
          >
            Run your entire beauty business from one beautifully connected platform —
            bookings, clients, payments, inventory, marketing and your own website.
          </p>
          <div
            className="animate-hero-fade-up mt-10 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.55s" }}
          >
            <Link
              href="/register"
              className="rounded-sm bg-gold-deep px-8 py-3 text-sm font-medium tracking-wide text-white transition hover:opacity-90"
            >
              Start Your Free Month
            </Link>
            <Link
              href="/login"
              className="rounded-sm border border-white/40 px-8 py-3 text-sm font-medium tracking-wide text-white transition hover:border-white hover:bg-white/10"
            >
              Log In
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 h-9 w-5 -translate-x-1/2 rounded-full border border-white/40">
          <span className="mx-auto mt-1.5 block h-1.5 w-1 animate-bounce rounded-full bg-white/70" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <Reveal className="text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Everything, connected</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">
            One platform, every part of the business.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delayMs={i * 80}>
              <div className="h-full rounded-sm border border-border bg-white p-7 transition hover:border-gold-deep">
                <h3 className="font-display text-lg text-charcoal">{f.title}</h3>
                <p className="mt-2 text-sm text-ink">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-charcoal py-24 text-cream">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <Reveal className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold">How it works</span>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Up and running in one sitting.</h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.step} delayMs={i * 100}>
                <span className="font-display text-4xl text-gold">{s.step}</span>
                <h3 className="mt-3 font-display text-xl text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <Reveal>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">About Luxore</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">
              Built by people who kept hearing the same thing.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">
              Beauty businesses run on juggling: a booking app for the calendar, a spreadsheet for
              clients, a separate tool for payments, and a website that never quite matches. Luxore
              exists to put all of that in one place — so the person running the business can spend
              less time switching tabs and more time with clients.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink sm:text-base">
              Every feature in Luxore is built for the day-to-day reality of a salon, spa or studio:
              real business hours, real deposits, real client histories — not a generic tool with
              beauty terms bolted on.
            </p>
          </Reveal>
          <Reveal delayMs={120}>
            <div className="overflow-hidden rounded-sm border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_IMAGE} alt="" className="h-80 w-full object-cover sm:h-[26rem]" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <Reveal>
          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">Ready to run it beautifully?</h2>
          <p className="mt-4 text-sm text-ink sm:text-base">
            30 days free. No credit card required.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-sm bg-charcoal px-10 py-3.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft"
          >
            Start Your Free Month
          </Link>
        </Reveal>
      </section>

      <footer className="border-t border-border px-6 py-10 text-center sm:px-10">
        <span className="font-display text-xs uppercase tracking-[0.3em] text-ink/50">Luxore</span>
        <p className="mt-2 text-xs text-ink/50">© {new Date().getFullYear()} Luxore. All rights reserved.</p>
      </footer>
    </main>
  );
}
