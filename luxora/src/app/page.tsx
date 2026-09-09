import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <span className="font-display text-sm uppercase tracking-[0.3em] text-gold-deep">
        Luxora
      </span>
      <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight text-charcoal sm:text-5xl">
        Built for beauty businesses that expect more.
      </h1>
      <p className="mt-5 max-w-xl text-balance text-base text-ink sm:text-lg">
        Run your entire beauty business from one beautifully connected platform —
        bookings, clients, payments, inventory, marketing and your own website.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/register"
          className="rounded-sm bg-charcoal px-8 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft"
        >
          Start Your Free Month
        </Link>
        <Link
          href="/login"
          className="rounded-sm border border-border px-8 py-3 text-sm font-medium tracking-wide text-charcoal transition hover:border-gold-deep hover:text-gold-deep"
        >
          Log In
        </Link>
      </div>
    </main>
  );
}
