import Link from "next/link";

export default async function BookingConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string; time?: string; services?: string }>;
}) {
  const { slug } = await params;
  const { date, time, services } = await searchParams;

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">
        Appointment Requested
      </span>
      <h1 className="mt-3 font-display text-3xl text-charcoal">You&apos;re booked!</h1>
      {services ? <p className="mt-4 text-ink">{services}</p> : null}
      {date && time ? (
        <p className="mt-1 text-ink">
          {date} at {time}
        </p>
      ) : null}
      <p className="mt-6 max-w-sm text-sm text-ink">
        The business will confirm your appointment shortly. Text and email confirmations arrive
        once messaging is enabled — for now, save this page or contact the business directly with
        any questions.
      </p>
      <Link
        href={`/b/${slug}`}
        className="mt-8 rounded-sm border border-border px-6 py-2.5 text-sm font-medium text-charcoal transition hover:border-gold-deep"
      >
        Back to Business Page
      </Link>
    </main>
  );
}
