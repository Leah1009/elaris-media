import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
      <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">
        Elaris Media — Rebuild in progress
      </span>
      <h1 className="max-w-2xl font-display text-4xl text-ink md:text-5xl">
        The new site is being assembled.
      </h1>
      <p className="max-w-md text-sm text-ink/70">
        The legacy static site lives in <code>/legacy</code>. The new
        scroll-driven 3D experience is being prototyped in isolation first.
      </p>
      <Link
        href="/prototype"
        className="rounded-full bg-ink px-8 py-3 text-sm uppercase tracking-[0.14em] text-cream-soft transition hover:bg-gold-deep"
      >
        View Camera → Phone Prototype
      </Link>
    </main>
  );
}
