import Link from "next/link";
import { getBookableBusinessBySlug } from "@/lib/luxora/public-booking";
import { getBusinessPublicLocale } from "@/lib/luxora/locale";
import { t } from "@/lib/luxora/i18n";

export default async function BookingConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string; time?: string; services?: string }>;
}) {
  const { slug } = await params;
  const { date, time, services } = await searchParams;
  const business = await getBookableBusinessBySlug(slug);
  const locale = await getBusinessPublicLocale(business?.public_language_mode ?? "en");

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">
        {t(locale, "appointment_requested")}
      </span>
      <h1 className="mt-3 font-display text-3xl text-charcoal">{t(locale, "youre_booked")}</h1>
      {services ? <p className="mt-4 text-ink">{services}</p> : null}
      {date && time ? (
        <p className="mt-1 text-ink">
          {date} {t(locale, "word_at")} {time}
        </p>
      ) : null}
      <p className="mt-6 max-w-sm text-sm text-ink">{t(locale, "confirmed_pending_note")}</p>
      <Link
        href={`/b/${slug}`}
        className="mt-8 rounded-sm border border-border px-6 py-2.5 text-sm font-medium text-charcoal transition hover:border-gold-deep"
      >
        {t(locale, "back_to_business_page")}
      </Link>
    </main>
  );
}
