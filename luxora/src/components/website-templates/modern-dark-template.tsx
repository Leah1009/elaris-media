import Link from "next/link";
import { WebsiteImageSlot } from "@/components/website-image-slot";
import { WebsiteStaffAvatar } from "@/components/website-staff-avatar";
import { formatPrice, DAY_NAMES } from "@/components/website-templates/types";
import type { WebsiteTemplateProps, ImageSlotSpec } from "@/components/website-templates/types";

export const MODERN_DARK_SLOTS: ImageSlotSpec[] = [
  { key: "hero_portrait", label: "Hero Image", subject: "Modern / dark beauty editorial", aspect: "4:5" },
  { key: "editorial_break", label: "Editorial Image", subject: "Modern beauty professional / salon", aspect: "16:9" },
  { key: "team_1", label: "Team Portrait 1", subject: "Staff editorial portrait", aspect: "4:5" },
  { key: "team_2", label: "Team Portrait 2", subject: "Staff editorial portrait", aspect: "4:5" },
  { key: "gallery_a", label: "Gallery A — Vertical", subject: "Studio moment", aspect: "4:5" },
  { key: "gallery_b", label: "Gallery B — Square", subject: "Studio moment", aspect: "1:1" },
  { key: "gallery_c", label: "Gallery C — Horizontal", subject: "Studio moment", aspect: "16:9" },
  { key: "gallery_d", label: "Gallery D — Vertical", subject: "Studio moment", aspect: "3:4" },
  { key: "final_cta", label: "Final CTA Image", subject: "Beauty editorial image", aspect: "16:9" },
];

export function ModernDarkTemplate({ business, data, images, devMode }: WebsiteTemplateProps) {
  const gallerySlots = MODERN_DARK_SLOTS.filter((s) => s.key.startsWith("gallery_"));
  const teamSlots = ["team_1", "team_2"];

  return (
    <div className="bg-[#0c0a09] font-sans text-[#f4ede2]">
      <header className="sticky top-0 z-30 border-b border-[#c9a24d]/15 bg-[#0c0a09]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg tracking-wide">{business.name}</span>
          <nav className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.15em] text-[#f4ede2]/60 md:flex">
            <a href="#services" className="hover:text-[#c9a24d]">Services</a>
            {business.show_team && data.staff.length > 0 ? <a href="#team" className="hover:text-[#c9a24d]">Team</a> : null}
            <a href="#gallery" className="hover:text-[#c9a24d]">Gallery</a>
            {business.show_reviews && data.reviews.length > 0 ? <a href="#reviews" className="hover:text-[#c9a24d]">Reviews</a> : null}
          </nav>
          <Link href={`/b/${business.slug}/book`} className="rounded-sm bg-[#c9a24d] px-5 py-2 text-xs font-medium uppercase tracking-wide text-[#0c0a09] transition hover:opacity-90">
            Book
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-stretch md:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 px-6 py-20 md:py-0">
          <span className="text-xs font-medium uppercase tracking-[0.4em] text-[#c9a24d]">{business.name}</span>
          <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl">
            {business.website_tagline || "Beauty, redefined after dark"}
          </h1>
          {business.description ? <p className="max-w-md text-sm leading-relaxed text-[#f4ede2]/70">{business.description}</p> : null}
          <Link href={`/b/${business.slug}/book`} className="w-fit rounded-sm bg-[#c9a24d] px-8 py-3 text-sm font-medium uppercase tracking-wide text-[#0c0a09] transition hover:opacity-90">
            Book Your Appointment
          </Link>
        </div>
        <WebsiteImageSlot
          template="modern_dark"
          slotKey="hero_portrait"
          label="Hero Image"
          subject="Modern / dark beauty editorial"
          aspect="4:5"
          imageUrl={images.hero_portrait ?? null}
          devMode={devMode}
          theme="dark"
          className="w-full"
        />
      </section>

      <section className="border-y border-[#c9a24d]/15 py-16">
        <p className="mx-auto max-w-3xl px-6 text-center font-display text-2xl leading-snug sm:text-3xl">
          We don&apos;t follow trends — we set the standard for modern beauty, one appointment at a time.
        </p>
      </section>

      {data.promotions.length > 0 ? (
        <section className="mx-auto max-w-5xl px-6 py-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.promotions.map((promo) => (
              <div key={promo.id} className="flex items-center justify-between border border-[#c9a24d]/25 px-5 py-4">
                <div>
                  <p className="font-mono text-sm text-[#c9a24d]">{promo.code}</p>
                  {promo.description ? <p className="mt-1 text-xs text-[#f4ede2]/60">{promo.description}</p> : null}
                </div>
                <span className="font-display text-lg">
                  {promo.discount_type === "percent" ? `${promo.discount_value}% off` : `${formatPrice(promo.discount_value * 100)} off`}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.services.length > 0 ? (
        <section id="services" className="mx-auto max-w-5xl px-6 py-20">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#c9a24d]">Services</span>
          <div className="mt-8 flex flex-col">
            {data.servicesByCategory.map(({ category, services }) => (
              <div key={category} className="border-b border-[#c9a24d]/15 py-8">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">{category}</h3>
                  <Link href={`/b/${business.slug}/book`} className="text-xs font-medium uppercase tracking-wide text-[#c9a24d] underline underline-offset-4">
                    Book →
                  </Link>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {services.map((s) => (
                    <div key={s.id} className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#f4ede2]/70">
                      <span>{s.name}</span>
                      <span className="text-[#f4ede2]/50">{s.duration_minutes} min · {formatPrice(s.price_cents)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <WebsiteImageSlot
        template="modern_dark"
        slotKey="editorial_break"
        label="Editorial Image"
        subject="Modern beauty professional / salon"
        aspect="16:9"
        imageUrl={images.editorial_break ?? null}
        devMode={devMode}
        theme="dark"
        className="w-full"
      />

      {business.show_team && data.staff.length > 0 ? (
        <section id="team" className="mx-auto max-w-6xl px-6 py-20">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#c9a24d]">Our Team</span>
          <div className="mt-8 flex gap-6 overflow-x-auto pb-4">
            {data.staff.map((s, i) => (
              <div key={s.id} className="w-56 flex-shrink-0">
                {i < teamSlots.length ? (
                  <WebsiteImageSlot
                    template="modern_dark"
                    slotKey={teamSlots[i]}
                    label={`Team Portrait ${i + 1}`}
                    subject="Staff editorial portrait"
                    aspect="4:5"
                    imageUrl={images[teamSlots[i]] ?? null}
                    devMode={devMode}
                    theme="dark"
                  />
                ) : (
                  <WebsiteStaffAvatar fullName={s.full_name} photoUrl={s.photo_url} theme="dark" className="aspect-[4/5] w-full rounded-none" />
                )}
                <p className="mt-3 font-display text-lg">{s.full_name}</p>
                {s.title ? <p className="text-xs uppercase tracking-wide text-[#f4ede2]/50">{s.title}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section id="gallery" className="mx-auto max-w-6xl px-6 py-20">
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#c9a24d]">Gallery</span>
        <div className="mt-8 columns-2 gap-4 sm:columns-4">
          {gallerySlots.map((slot) => (
            <div key={slot.key} className="mb-4 break-inside-avoid">
              <WebsiteImageSlot
                template="modern_dark"
                slotKey={slot.key}
                label={slot.label}
                subject={slot.subject}
                aspect={slot.aspect}
                imageUrl={images[slot.key] ?? null}
                devMode={devMode}
                theme="dark"
              />
            </div>
          ))}
        </div>
      </section>

      {business.show_reviews && data.reviews.length > 0 ? (
        <section id="reviews" className="border-y border-[#c9a24d]/15 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#c9a24d]">
              Reviews
              {data.reviewSummary?.average_rating ? (
                <span className="ml-2 normal-case tracking-normal text-[#f4ede2]/50">
                  {data.reviewSummary.average_rating} ★ ({data.reviewSummary.review_count})
                </span>
              ) : null}
            </span>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {data.reviews.map((r) => (
                <div key={r.id} className="border-l-2 border-[#c9a24d] pl-5">
                  <p className="font-display text-lg leading-snug">&ldquo;{r.comment || "Great experience."}&rdquo;</p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-[#f4ede2]/50">
                    {r.client_display_name} · {r.rating}★
                  </p>
                  {r.response ? <p className="mt-2 text-xs text-[#f4ede2]/60">Response: {r.response}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#c9a24d]">Visit</span>
            <h2 className="mt-3 font-display text-2xl">{business.address_line1}</h2>
            <p className="mt-1 text-sm text-[#f4ede2]/60">
              {business.city}, {business.state} {business.zip}
            </p>
            {business.phone ? <p className="mt-3 text-sm text-[#f4ede2]/60">{business.phone}</p> : null}
          </div>
          {data.hours.length > 0 ? (
            <dl className="flex flex-col gap-1 text-sm">
              {data.hours.map((h) => (
                <div key={h.day_of_week} className="flex justify-between border-b border-[#c9a24d]/15 py-1.5">
                  <dt>{DAY_NAMES[h.day_of_week]}</dt>
                  <dd className="text-[#f4ede2]/60">{h.closed ? "Closed" : `${h.open_time?.slice(0, 5)} – ${h.close_time?.slice(0, 5)}`}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      <section className="relative min-h-[340px] w-full overflow-hidden bg-[#0c0a09]">
        <WebsiteImageSlot
          template="modern_dark"
          slotKey="final_cta"
          label="Final CTA Image"
          subject="Beauty editorial image"
          aspect="16:9"
          imageUrl={images.final_cta ?? null}
          devMode={devMode}
          theme="dark"
          className="absolute inset-0 h-full w-full opacity-40"
        />
        <div className="relative z-10 flex min-h-[340px] flex-col items-center justify-center gap-6 px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl">Book Your Appointment</h2>
          <Link href={`/b/${business.slug}/book`} className="rounded-sm bg-[#c9a24d] px-10 py-3.5 text-sm font-medium uppercase tracking-wide text-[#0c0a09] transition hover:opacity-90">
            Book Now
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#c9a24d]/15 py-10 text-center">
        <p className="font-display text-lg">{business.name}</p>
        {business.instagram_url ? (
          <a href={business.instagram_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-[#c9a24d] underline underline-offset-2">
            Instagram
          </a>
        ) : null}
        <p className="mt-4 text-xs text-[#f4ede2]/30">Powered by Luxore</p>
      </footer>
    </div>
  );
}
