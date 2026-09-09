import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <span className="font-display text-sm uppercase tracking-[0.3em] text-gold-deep">Luxora</span>
      <h1 className="mt-4 font-display text-3xl text-charcoal">Check your email</h1>
      <p className="mt-3 max-w-sm text-sm text-ink">
        We&apos;ve sent a confirmation link to your inbox. Confirm your email, then log in to
        finish setting up your business.
      </p>
      <Link
        href="/login"
        className="mt-8 rounded-sm bg-charcoal px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft"
      >
        Go to Log In
      </Link>
    </main>
  );
}
