import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBookableBusinessBySlug } from "@/lib/luxora/public-booking";
import { formatCents } from "@/lib/luxora/money";
import { getBusinessPublicLocale } from "@/lib/luxora/locale";
import { t, type TranslationKey } from "@/lib/luxora/i18n";
import { LocaleSwitcher } from "@/components/locale-switcher";

const DAY_KEYS: TranslationKey[] = [
  "day_sunday",
  "day_monday",
  "day_tuesday",
  "day_wednesday",
  "day_thursday",
  "day_friday",
  "day_saturday",
];

export default async function PublicBusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBookableBusinessBySlug(slug);
  if (!business) notFound();

  const locale = await getBusinessPublicLocale(business.public_language_mode);
  const supabase = await createClient();

  const [{ data: services }, { data: staff }, { data: location }, { data: promotions }] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, category, description, duration_minutes, price_cents")
      .eq("business_id", business.id)
      .eq("active", true)
      .order("name"),
    supabase.from("staff").select("id, full_name, title").eq("business_id", business.id).eq("active", true).order("full_name"),
    supabase.from("locations").select("id").eq("business_id", business.id).eq("is_primary", true).maybeSingle(),
    supabase
      .from("promotions")
      .select("id, code, description, discount_type, discount_value, valid_to, image_url")
      .eq("business_id", business.id)
      .order("created_at", { ascending: false }),
  ]);

  const { data: hours } = location
    ? await supabase
        .from("business_hours")
        .select("day_of_week, open_time, close_time, closed")
        .eq("location_id", location.id)
        .order("day_of_week")
    : { data: [] };

  const [{ data: reviewSummary }, { data: reviews }] = await Promise.all([
    supabase.rpc("get_public_review_summary", { p_business_id: business.id }).maybeSingle(),
    supabase.rpc("get_public_reviews", { p_business_id: business.id }),
  ]);

  return (
    <main>
      {business.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={business.cover_image_url}
          alt=""
          className="h-48 w-full object-cover sm:h-64"
        />
      ) : null}

      <div className="mx-auto max-w-2xl px-6 py-16">
        {business.public_language_mode === "both" ? (
          <div className="mb-6 flex justify-end">
            <LocaleSwitcher locale={locale} />
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          {business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo_url}
              alt={`${business.name} logo`}
              className="h-14 w-14 rounded-full border border-border object-cover"
            />
          ) : null}
          <div>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">
              {t(locale, "book_with")}
            </span>
            <h1 className="font-display text-4xl text-charcoal">{business.name}</h1>
          </div>
        </div>
        {business.website_tagline ? (
          <p className="mt-2 text-sm italic text-ink/70">{business.website_tagline}</p>
        ) : null}
        {business.description ? <p className="mt-3 text-ink">{business.description}</p> : null}
        <p className="mt-3 text-sm text-ink">
          {business.address_line1}, {business.city}, {business.state} {business.zip}
          {business.phone ? ` · ${business.phone}` : ""}
          {business.instagram_url ? (
            <>
              {" · "}
              <a href={business.instagram_url} target="_blank" rel="noreferrer" className="text-gold-deep underline underline-offset-2">
                Instagram
              </a>
            </>
          ) : null}
        </p>

        <Link
          href={`/b/${slug}/book`}
          style={business.brand_color ? { backgroundColor: business.brand_color } : undefined}
          className="mt-8 inline-block rounded-sm bg-charcoal px-8 py-3 text-sm font-medium tracking-wide text-white transition hover:opacity-90"
        >
          {t(locale, "book_now")}
        </Link>

      {promotions && promotions.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-xl text-charcoal">{t(locale, "public_promotions_title")}</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {promotions.map((promo) => (
              <div key={promo.id} className="overflow-hidden rounded-sm border border-border bg-white">
                {promo.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={promo.image_url} alt="" className="h-32 w-full object-cover" />
                ) : null}
                <div className="p-4">
                  <p className="font-mono text-sm font-medium text-gold-deep">{promo.code}</p>
                  <p className="mt-1 text-charcoal">
                    {promo.discount_type === "percent" ? `${promo.discount_value}% ${t(locale, "public_promo_off")}` : `$${promo.discount_value} ${t(locale, "public_promo_off")}`}
                  </p>
                  {promo.description ? <p className="mt-1 text-sm text-ink">{promo.description}</p> : null}
                  {promo.valid_to ? (
                    <p className="mt-2 text-xs text-ink/50">
                      {t(locale, "public_promo_valid_until")} {new Date(promo.valid_to).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="font-display text-xl text-charcoal">{t(locale, "public_services_title")}</h2>
        <div className="mt-4 flex flex-col gap-3">
          {(services ?? []).map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-sm border border-border bg-white p-4">
              <div>
                <p className="font-medium text-charcoal">{s.name}</p>
                <p className="text-xs text-ink/60">{s.duration_minutes} min</p>
              </div>
              <p className="text-charcoal">{formatCents(s.price_cents)}</p>
            </div>
          ))}
          {(!services || services.length === 0) ? (
            <p className="text-sm text-ink">{t(locale, "no_services_published")}</p>
          ) : null}
        </div>
      </section>

      {business.show_team && staff && staff.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-xl text-charcoal">{t(locale, "our_team")}</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            {staff.map((s) => (
              <div key={s.id} className="rounded-sm border border-border bg-white px-4 py-3">
                <p className="text-sm font-medium text-charcoal">{s.full_name}</p>
                {s.title ? <p className="text-xs text-ink/60">{s.title}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {hours && hours.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-xl text-charcoal">{t(locale, "hours_title")}</h2>
          <dl className="mt-4 flex flex-col gap-1 text-sm">
            {hours.map((h) => (
              <div key={h.day_of_week} className="flex justify-between border-b border-border py-1.5">
                <dt className="text-charcoal">{t(locale, DAY_KEYS[h.day_of_week])}</dt>
                <dd className="text-ink">
                  {h.closed ? t(locale, "closed_label") : `${h.open_time?.slice(0, 5)} – ${h.close_time?.slice(0, 5)}`}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {business.show_reviews && reviews && reviews.length > 0 ? (
        <section id="reviews" className="mt-12">
          <h2 className="font-display text-xl text-charcoal">
            {t(locale, "public_reviews_title")}
            {reviewSummary?.average_rating ? (
              <span className="ml-2 text-sm font-normal text-ink/70">
                {reviewSummary.average_rating} ★ ({reviewSummary.review_count})
              </span>
            ) : null}
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-sm border border-border bg-white p-4">
                <div>
                  <span className="text-gold-deep">{"★".repeat(r.rating)}</span>
                  <span className="text-ink/30">{"★".repeat(5 - r.rating)}</span>
                  <span className="ml-2 text-sm text-charcoal">{r.client_display_name}</span>
                </div>
                {r.comment ? <p className="mt-2 text-sm text-ink">{r.comment}</p> : null}
                {r.response ? (
                  <p className="mt-2 rounded-sm bg-cream-deep p-2 text-xs text-charcoal">
                    <span className="font-medium">{t(locale, "response_label")} </span>
                    {r.response}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

        <p className="mt-16 text-center text-xs text-ink/40">{t(locale, "powered_by_luxore")}</p>
      </div>
    </main>
  );
}
