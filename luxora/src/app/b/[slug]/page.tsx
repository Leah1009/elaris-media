import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBookableBusinessBySlug } from "@/lib/luxora/public-booking";
import { formatCents } from "@/lib/luxora/money";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function PublicBusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBookableBusinessBySlug(slug);
  if (!business) notFound();

  const supabase = await createClient();

  const [{ data: services }, { data: staff }, { data: location }] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, category, description, duration_minutes, price_cents")
      .eq("business_id", business.id)
      .eq("active", true)
      .order("name"),
    supabase.from("staff").select("id, full_name, title").eq("business_id", business.id).eq("active", true).order("full_name"),
    supabase.from("locations").select("id").eq("business_id", business.id).eq("is_primary", true).maybeSingle(),
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
              Book with
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
        </p>

        <Link
          href={`/b/${slug}/book`}
          style={business.brand_color ? { backgroundColor: business.brand_color } : undefined}
          className="mt-8 inline-block rounded-sm bg-charcoal px-8 py-3 text-sm font-medium tracking-wide text-white transition hover:opacity-90"
        >
          Book Now
        </Link>

      <section className="mt-12">
        <h2 className="font-display text-xl text-charcoal">Services</h2>
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
            <p className="text-sm text-ink">No services published yet.</p>
          ) : null}
        </div>
      </section>

      {staff && staff.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-xl text-charcoal">Our Team</h2>
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
          <h2 className="font-display text-xl text-charcoal">Hours</h2>
          <dl className="mt-4 flex flex-col gap-1 text-sm">
            {hours.map((h) => (
              <div key={h.day_of_week} className="flex justify-between border-b border-border py-1.5">
                <dt className="text-charcoal">{DAY_LABELS[h.day_of_week]}</dt>
                <dd className="text-ink">
                  {h.closed ? "Closed" : `${h.open_time?.slice(0, 5)} – ${h.close_time?.slice(0, 5)}`}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {reviews && reviews.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-xl text-charcoal">
            Reviews
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
                    <span className="font-medium">Response: </span>
                    {r.response}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

        <p className="mt-16 text-center text-xs text-ink/40">Powered by Luxora</p>
      </div>
    </main>
  );
}
