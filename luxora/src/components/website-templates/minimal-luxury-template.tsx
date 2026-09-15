import Link from "next/link";
import { WebsiteImageSlot } from "@/components/website-image-slot";
import { WebsiteStaffAvatar } from "@/components/website-staff-avatar";
import { formatPrice, categoryIconPath, DAY_NAMES } from "@/components/website-templates/types";
import type { WebsiteTemplateProps, ImageSlotSpec } from "@/components/website-templates/types";

export const MINIMAL_LUXURY_SLOTS: ImageSlotSpec[] = [
  { key: "hero", label: "Hero Image", subject: "Luxury salon interior", aspect: "16:9" },
  { key: "about", label: "About Image", subject: "Beauty professional / salon environment", aspect: "4:5" },
  { key: "service_1", label: "Service Image 1", subject: "Beauty service", aspect: "4:5" },
  { key: "service_2", label: "Service Image 2", subject: "Beauty service", aspect: "4:5" },
  { key: "service_3", label: "Service Image 3", subject: "Beauty service", aspect: "4:5" },
  { key: "gallery_1", label: "Gallery Photo 1", subject: "Salon moment", aspect: "1:1" },
  { key: "gallery_2", label: "Gallery Photo 2", subject: "Salon moment", aspect: "1:1" },
  { key: "gallery_3", label: "Gallery Photo 3", subject: "Salon moment", aspect: "1:1" },
  { key: "gallery_4", label: "Gallery Photo 4", subject: "Salon moment", aspect: "1:1" },
  { key: "final_cta", label: "Final CTA Image", subject: "Luxury salon atmosphere", aspect: "16:9" },
];

export function MinimalLuxuryTemplate({ business, data, images, devMode }: WebsiteTemplateProps) {
  const featured = data.services.slice(0, 3);
  const gallerySlots = MINIMAL_LUXURY_SLOTS.filter((s) => s.key.startsWith("gallery_"));

  return (
    <div className="bg-cream font-sans text-charcoal">
      <header className="sticky top-0 z-30 border-b border-border bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg tracking-wide text-charcoal">{business.name}</span>
          <nav className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.15em] text-ink/70 md:flex">
            <a href="#services" className="hover:text-gold-deep">Services</a>
            {business.show_team && data.staff.length > 0 ? <a href="#team" className="hover:text-gold-deep">Team</a> : null}
            <a href="#gallery" className="hover:text-gold-deep">Gallery</a>
            {business.show_reviews && data.reviews.length > 0 ? <a href="#reviews" className="hover:text-gold-deep">Reviews</a> : null}
          </nav>
          <Link
            href={`/b/${business.slug}/book`}
            style={business.brand_color ? { backgroundColor: business.brand_color } : undefined}
            className="rounded-sm bg-charcoal px-5 py-2 text-xs font-medium uppercase tracking-wide text-white transition hover:opacity-90"
          >
            Book Appointment
          </Link>
        </div>
      </header>

      <section className="relative min-h-[560px] w-full overflow-hidden sm:min-h-[640px]">
        <WebsiteImageSlot
          template="minimal_luxury"
          slotKey="hero"
          label="Hero Image"
          subject="Luxury salon interior"
          aspect="16:9"
          imageUrl={images.hero ?? null}
          devMode={devMode}
          theme="light"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-end px-6 pb-20 pt-40 text-center text-white sm:min-h-[640px]">
          <span className="font-display text-xs uppercase tracking-[0.4em] text-gold-deep">{business.name}</span>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">
            {business.website_tagline || "Timeless beauty, thoughtfully delivered"}
          </h1>
          {business.description ? <p className="mt-4 max-w-xl text-sm text-white/85 sm:text-base">{business.description}</p> : null}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/b/${business.slug}/book`}
              style={business.brand_color ? { backgroundColor: business.brand_color } : undefined}
              className="rounded-sm bg-white px-8 py-3 text-sm font-medium uppercase tracking-wide text-charcoal transition hover:opacity-90"
            >
              Book Appointment
            </Link>
            <a href="#services" className="rounded-sm border border-white/60 px-8 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-white/10">
              View Services
            </a>
          </div>
        </div>
      </section>

      {data.promotions.length > 0 ? (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.promotions.map((promo) => (
              <div key={promo.id} className="overflow-hidden rounded-sm border border-border bg-white">
                {promo.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={promo.image_url} alt="" className="h-32 w-full object-cover" />
                ) : null}
                <div className="p-4">
                  <p className="font-mono text-sm font-medium text-gold-deep">{promo.code}</p>
                  <p className="mt-1 text-charcoal">
                    {promo.discount_type === "percent" ? `${promo.discount_value}% off` : `${formatPrice(promo.discount_value * 100)} off`}
                  </p>
                  {promo.description ? <p className="mt-1 text-sm text-ink/70">{promo.description}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.servicesByCategory.length > 0 ? (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-6">
            {data.servicesByCategory.map(({ category }) => (
              <div key={category} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-deep/40 text-gold-deep">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                    <path d={categoryIconPath(category)} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-charcoal">{category}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">
        <div>
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">About Us</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal">A studio built around you</h2>
          <p className="mt-5 text-sm leading-relaxed text-ink/80">
            {business.description || `${business.name} brings together experienced professionals and a calm, considered space — every visit is paced around what you actually need.`}
          </p>
        </div>
        <WebsiteImageSlot
          template="minimal_luxury"
          slotKey="about"
          label="About Image"
          subject="Beauty professional / salon environment"
          aspect="4:5"
          imageUrl={images.about ?? null}
          devMode={devMode}
          theme="light"
        />
      </section>

      {featured.length > 0 ? (
        <section id="services" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Featured</span>
              <h2 className="mt-3 font-display text-3xl text-charcoal">Signature Services</h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {featured.map((s, i) => (
                <div key={s.id} className="flex flex-col">
                  <WebsiteImageSlot
                    template="minimal_luxury"
                    slotKey={`service_${i + 1}`}
                    label={`Service Image ${i + 1}`}
                    subject="Beauty service"
                    aspect="4:5"
                    imageUrl={images[`service_${i + 1}`] ?? null}
                    devMode={devMode}
                    theme="light"
                  />
                  <h3 className="mt-4 font-display text-lg text-charcoal">{s.name}</h3>
                  <p className="mt-1 text-xs text-ink/60">{s.duration_minutes} min</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-charcoal">{formatPrice(s.price_cents)}</span>
                    <Link href={`/b/${business.slug}/book`} className="text-xs font-medium uppercase tracking-wide text-gold-deep underline underline-offset-2">
                      Book →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-14 flex flex-col gap-3">
              {data.services.map((s) => (
                <div key={s.id} className="flex items-center justify-between border-b border-border py-3 text-sm">
                  <span className="text-charcoal">{s.name}</span>
                  <span className="text-ink/60">{s.duration_minutes} min</span>
                  <span className="text-charcoal">{formatPrice(s.price_cents)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {business.show_team && data.staff.length > 0 ? (
        <section id="team" className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Our Team</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal">Meet the artists</h2>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-10">
            {data.staff.map((s) => (
              <div key={s.id} className="flex w-36 flex-col items-center text-center">
                <WebsiteStaffAvatar fullName={s.full_name} photoUrl={s.photo_url} theme="light" className="h-28 w-28 rounded-full" />
                <p className="mt-3 text-sm font-medium text-charcoal">{s.full_name}</p>
                {s.title ? <p className="text-xs text-ink/60">{s.title}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section id="gallery" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Gallery</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal">A look inside</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {gallerySlots.map((slot) => (
              <WebsiteImageSlot
                key={slot.key}
                template="minimal_luxury"
                slotKey={slot.key}
                label={slot.label}
                subject={slot.subject}
                aspect={slot.aspect}
                imageUrl={images[slot.key] ?? null}
                devMode={devMode}
                theme="light"
              />
            ))}
          </div>
        </div>
      </section>

      {business.show_reviews && data.reviews.length > 0 ? (
        <section id="reviews" className="mx-auto max-w-3xl px-6 py-20">
          <div className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Reviews</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal">
              Client Love
              {data.reviewSummary?.average_rating ? (
                <span className="ml-2 text-base font-normal text-ink/60">
                  {data.reviewSummary.average_rating} ★ ({data.reviewSummary.review_count})
                </span>
              ) : null}
            </h2>
          </div>
          <div className="mt-10 flex flex-col gap-4">
            {data.reviews.map((r) => (
              <div key={r.id} className="rounded-sm border border-border bg-white p-6">
                <div>
                  <span className="text-gold-deep">{"★".repeat(r.rating)}</span>
                  <span className="text-ink/25">{"★".repeat(5 - r.rating)}</span>
                  <span className="ml-3 text-sm font-medium text-charcoal">{r.client_display_name}</span>
                </div>
                {r.comment ? <p className="mt-3 text-sm text-ink/80">{r.comment}</p> : null}
                {r.response ? (
                  <p className="mt-3 rounded-sm bg-cream-deep p-3 text-xs text-charcoal">
                    <span className="font-medium">Response: </span>
                    {r.response}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 px-6 sm:grid-cols-2">
          <div>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">Visit Us</span>
            <h2 className="mt-3 font-display text-2xl text-charcoal">Hours &amp; Location</h2>
            <p className="mt-4 text-sm text-ink/80">
              {business.address_line1}
              {business.address_line1 ? <br /> : null}
              {business.city}, {business.state} {business.zip}
            </p>
            {business.phone ? <p className="mt-2 text-sm text-ink/80">{business.phone}</p> : null}
          </div>
          {data.hours.length > 0 ? (
            <dl className="flex flex-col gap-1 text-sm">
              {data.hours.map((h) => (
                <div key={h.day_of_week} className="flex justify-between border-b border-border py-1.5">
                  <dt className="text-charcoal">{DAY_NAMES[h.day_of_week]}</dt>
                  <dd className="text-ink/70">{h.closed ? "Closed" : `${h.open_time?.slice(0, 5)} – ${h.close_time?.slice(0, 5)}`}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      <section className="relative min-h-[380px] w-full overflow-hidden">
        <WebsiteImageSlot
          template="minimal_luxury"
          slotKey="final_cta"
          label="Final CTA Image"
          subject="Luxury salon atmosphere"
          aspect="16:9"
          imageUrl={images.final_cta ?? null}
          devMode={devMode}
          theme="light"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-charcoal/60" />
        <div className="relative z-10 flex min-h-[380px] flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h2 className="font-display text-3xl sm:text-4xl">Ready for your next appointment?</h2>
          <Link
            href={`/b/${business.slug}/book`}
            style={business.brand_color ? { backgroundColor: business.brand_color } : undefined}
            className="rounded-sm bg-white px-10 py-3.5 text-sm font-medium uppercase tracking-wide text-charcoal transition hover:opacity-90"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-cream py-10 text-center">
        <p className="font-display text-lg text-charcoal">{business.name}</p>
        {business.instagram_url ? (
          <a href={business.instagram_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-gold-deep underline underline-offset-2">
            Instagram
          </a>
        ) : null}
        <p className="mt-4 text-xs text-ink/40">Powered by Luxore</p>
      </footer>
    </div>
  );
}
