import Link from "next/link";
import { WebsiteImageSlot } from "@/components/website-image-slot";
import { WebsiteStaffAvatar } from "@/components/website-staff-avatar";
import { formatPrice, categoryIconPath, DAY_NAMES } from "@/components/website-templates/types";
import type { WebsiteTemplateProps, ImageSlotSpec } from "@/components/website-templates/types";

export const SOFT_BEAUTY_SLOTS: ImageSlotSpec[] = [
  { key: "hero_collage_1", label: "Hero Image A", subject: "Beauty detail", aspect: "4:5" },
  { key: "hero_collage_2", label: "Hero Image B", subject: "Beauty service", aspect: "1:1" },
  { key: "hero_collage_3", label: "Hero Image C", subject: "Beauty professional / client", aspect: "4:5" },
  { key: "category_hair", label: "Hair Image", subject: "Hair styling", aspect: "1:1" },
  { key: "category_nails", label: "Nails Image", subject: "Nail service", aspect: "1:1" },
  { key: "category_lashes", label: "Lash Image", subject: "Lash service", aspect: "1:1" },
  { key: "category_brows", label: "Brow Image", subject: "Brow service", aspect: "1:1" },
  { key: "category_makeup", label: "Makeup Image", subject: "Makeup service", aspect: "1:1" },
  { key: "category_skincare", label: "Skincare Image", subject: "Skincare service", aspect: "1:1" },
  { key: "story", label: "Story Image", subject: "Vertical beauty / lifestyle image", aspect: "4:5" },
  { key: "gallery_1", label: "Gallery Photo 1", subject: "Social moment", aspect: "4:5" },
  { key: "gallery_2", label: "Gallery Photo 2", subject: "Social moment", aspect: "1:1" },
  { key: "gallery_3", label: "Gallery Photo 3", subject: "Social moment", aspect: "1:1" },
  { key: "gallery_4", label: "Gallery Photo 4", subject: "Social moment", aspect: "4:5" },
  { key: "final_cta", label: "Booking CTA Image", subject: "Soft luxury beauty image", aspect: "16:9" },
];

const KNOWN_CATEGORY_SLOTS: Record<string, string> = {
  hair: "category_hair",
  nails: "category_nails",
  lashes: "category_lashes",
  brows: "category_brows",
  makeup: "category_makeup",
  skincare: "category_skincare",
};

function slotForCategory(category: string): string | null {
  const key = category.toLowerCase();
  for (const name of Object.keys(KNOWN_CATEGORY_SLOTS)) {
    if (key.includes(name)) return KNOWN_CATEGORY_SLOTS[name];
  }
  return null;
}

export function SoftBeautyTemplate({ business, data, images, devMode }: WebsiteTemplateProps) {
  const gallerySlots = SOFT_BEAUTY_SLOTS.filter((s) => s.key.startsWith("gallery_"));
  const popularServices = data.services.slice(0, 6);

  return (
    <div className="bg-[#faf6f0] font-sans text-[#4a3b2f]">
      <header className="sticky top-0 z-30 border-b border-[#cba876]/25 bg-[#faf6f0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg tracking-wide">{business.name}</span>
          <nav className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.15em] text-[#4a3b2f]/60 md:flex">
            <a href="#services" className="hover:text-[#b8875a]">Services</a>
            {business.show_team && data.staff.length > 0 ? <a href="#team" className="hover:text-[#b8875a]">Team</a> : null}
            <a href="#gallery" className="hover:text-[#b8875a]">Gallery</a>
            {business.show_reviews && data.reviews.length > 0 ? <a href="#reviews" className="hover:text-[#b8875a]">Reviews</a> : null}
          </nav>
          <Link href={`/b/${business.slug}/book`} className="rounded-full bg-[#b8875a] px-5 py-2 text-xs font-medium uppercase tracking-wide text-white transition hover:opacity-90">
            Book Appointment
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-[#b8875a]">{business.name}</span>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              {business.website_tagline || "Soft beauty, warmly done"}
            </h1>
            {business.description ? <p className="mt-4 text-sm leading-relaxed text-[#4a3b2f]/75">{business.description}</p> : null}
            <Link href={`/b/${business.slug}/book`} className="mt-7 inline-block rounded-full bg-[#b8875a] px-8 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:opacity-90">
              Book Appointment
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <WebsiteImageSlot
              template="soft_beauty"
              slotKey="hero_collage_1"
              label="Hero Image A"
              subject="Beauty detail"
              aspect="4:5"
              imageUrl={images.hero_collage_1 ?? null}
              devMode={devMode}
              theme="soft"
              className="rounded-2xl"
            />
            <div className="flex flex-col gap-3">
              <WebsiteImageSlot
                template="soft_beauty"
                slotKey="hero_collage_2"
                label="Hero Image B"
                subject="Beauty service"
                aspect="1:1"
                imageUrl={images.hero_collage_2 ?? null}
                devMode={devMode}
                theme="soft"
                className="rounded-2xl"
              />
              <WebsiteImageSlot
                template="soft_beauty"
                slotKey="hero_collage_3"
                label="Hero Image C"
                subject="Beauty professional / client"
                aspect="4:5"
                imageUrl={images.hero_collage_3 ?? null}
                devMode={devMode}
                theme="soft"
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {data.promotions.length > 0 ? (
        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.promotions.map((promo) => (
              <div key={promo.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                {promo.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={promo.image_url} alt="" className="h-28 w-full object-cover" />
                ) : null}
                <div className="p-4">
                  <p className="font-mono text-sm text-[#b8875a]">{promo.code}</p>
                  <p className="mt-1">
                    {promo.discount_type === "percent" ? `${promo.discount_value}% off` : `${formatPrice(promo.discount_value * 100)} off`}
                  </p>
                  {promo.description ? <p className="mt-1 text-sm text-[#4a3b2f]/60">{promo.description}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.servicesByCategory.length > 0 ? (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center font-display text-3xl">What We Offer</h2>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
              {data.servicesByCategory.map(({ category }) => {
                const slotKey = slotForCategory(category);
                const slot = slotKey ? SOFT_BEAUTY_SLOTS.find((s) => s.key === slotKey) : null;
                return (
                  <div key={category} className="flex flex-col items-center gap-3 text-center">
                    {slot ? (
                      <WebsiteImageSlot
                        template="soft_beauty"
                        slotKey={slot.key}
                        label={slot.label}
                        subject={slot.subject}
                        aspect={slot.aspect}
                        imageUrl={images[slot.key] ?? null}
                        devMode={devMode}
                        theme="soft"
                        className="w-full rounded-full"
                      />
                    ) : (
                      <span className="flex aspect-square w-full items-center justify-center rounded-full bg-[#f3e6d6] text-[#b8875a]">
                        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                          <path d={categoryIconPath(category)} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                    <span className="text-xs font-medium uppercase tracking-wide">{category}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="relative min-h-[420px] w-full overflow-hidden">
        <WebsiteImageSlot
          template="soft_beauty"
          slotKey="story"
          label="Story Image"
          subject="Vertical beauty / lifestyle image"
          aspect="4:5"
          imageUrl={images.story ?? null}
          devMode={devMode}
          theme="soft"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf6f0] via-[#faf6f0]/60 to-transparent md:w-2/3" />
        <div className="relative z-10 flex min-h-[420px] max-w-lg flex-col justify-center gap-4 px-6 py-16">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#b8875a]">Our Story</span>
          <h2 className="font-display text-3xl">Rooted in care, made for you</h2>
          <p className="text-sm leading-relaxed text-[#4a3b2f]/75">
            {business.description || `${business.name} started with a simple idea — beauty appointments should feel unhurried, personal, and genuinely enjoyable.`}
          </p>
        </div>
      </section>

      {popularServices.length > 0 ? (
        <section id="services" className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-display text-3xl">Popular Services</h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {popularServices.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-[#4a3b2f]/50">{s.duration_minutes} min</p>
                </div>
                <span className="font-display text-lg text-[#b8875a]">{formatPrice(s.price_cents)}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {business.show_team && data.staff.length > 0 ? (
        <section id="team" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center font-display text-3xl">Meet Our Team</h2>
            <div className="mt-10 flex snap-x gap-6 overflow-x-auto pb-4">
              {data.staff.map((s) => (
                <div key={s.id} className="flex w-40 flex-shrink-0 snap-center flex-col items-center text-center">
                  <WebsiteStaffAvatar fullName={s.full_name} photoUrl={s.photo_url} theme="soft" className="h-32 w-32 rounded-full shadow-sm" />
                  <p className="mt-3 text-sm font-medium">{s.full_name}</p>
                  {s.title ? <p className="text-xs text-[#4a3b2f]/50">{s.title}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="gallery" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center font-display text-3xl">Social Moments</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <WebsiteImageSlot
            template="soft_beauty"
            slotKey={gallerySlots[0].key}
            label={gallerySlots[0].label}
            subject={gallerySlots[0].subject}
            aspect={gallerySlots[0].aspect}
            imageUrl={images[gallerySlots[0].key] ?? null}
            devMode={devMode}
            theme="soft"
            className="col-span-2 row-span-2 rounded-2xl"
          />
          {gallerySlots.slice(1).map((slot) => (
            <WebsiteImageSlot
              key={slot.key}
              template="soft_beauty"
              slotKey={slot.key}
              label={slot.label}
              subject={slot.subject}
              aspect={slot.aspect}
              imageUrl={images[slot.key] ?? null}
              devMode={devMode}
              theme="soft"
              className="rounded-2xl"
            />
          ))}
        </div>
      </section>

      {business.show_reviews && data.reviews.length > 0 ? (
        <section id="reviews" className="bg-white py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center font-display text-3xl">
              Loved By Our Clients
              {data.reviewSummary?.average_rating ? (
                <span className="ml-2 text-base font-normal text-[#4a3b2f]/50">
                  {data.reviewSummary.average_rating} ★ ({data.reviewSummary.review_count})
                </span>
              ) : null}
            </h2>
            <div className="mt-10 flex flex-col gap-4">
              {data.reviews.map((r) => (
                <div key={r.id} className="rounded-2xl bg-[#faf6f0] p-6">
                  <span className="text-[#b8875a]">{"★".repeat(r.rating)}</span>
                  <span className="text-[#4a3b2f]/20">{"★".repeat(5 - r.rating)}</span>
                  <span className="ml-3 text-sm font-medium">{r.client_display_name}</span>
                  {r.comment ? <p className="mt-3 text-sm text-[#4a3b2f]/75">{r.comment}</p> : null}
                  {r.response ? <p className="mt-3 rounded-xl bg-white p-3 text-xs">Response: {r.response}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#b8875a]">Visit Us</span>
            <h2 className="mt-3 font-display text-2xl">{business.address_line1}</h2>
            <p className="mt-1 text-sm text-[#4a3b2f]/60">
              {business.city}, {business.state} {business.zip}
            </p>
            {business.phone ? <p className="mt-3 text-sm text-[#4a3b2f]/60">{business.phone}</p> : null}
          </div>
          {data.hours.length > 0 ? (
            <dl className="flex flex-col gap-1 text-sm">
              {data.hours.map((h) => (
                <div key={h.day_of_week} className="flex justify-between border-b border-[#cba876]/25 py-1.5">
                  <dt>{DAY_NAMES[h.day_of_week]}</dt>
                  <dd className="text-[#4a3b2f]/60">{h.closed ? "Closed" : `${h.open_time?.slice(0, 5)} – ${h.close_time?.slice(0, 5)}`}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      <section className="relative min-h-[340px] w-full overflow-hidden">
        <WebsiteImageSlot
          template="soft_beauty"
          slotKey="final_cta"
          label="Booking CTA Image"
          subject="Soft luxury beauty image"
          aspect="16:9"
          imageUrl={images.final_cta ?? null}
          devMode={devMode}
          theme="soft"
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-[#4a3b2f]/45" />
        <div className="relative z-10 flex min-h-[340px] flex-col items-center justify-center gap-6 px-6 text-center text-white">
          <h2 className="font-display text-3xl sm:text-4xl">Come as you are, leave glowing</h2>
          <Link href={`/b/${business.slug}/book`} className="rounded-full bg-white px-10 py-3.5 text-sm font-medium uppercase tracking-wide text-[#4a3b2f] transition hover:opacity-90">
            Book Appointment
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#cba876]/25 py-10 text-center">
        <p className="font-display text-lg">{business.name}</p>
        {business.instagram_url ? (
          <a href={business.instagram_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-[#b8875a] underline underline-offset-2">
            Instagram
          </a>
        ) : null}
        <p className="mt-4 text-xs text-[#4a3b2f]/40">Powered by Luxore</p>
      </footer>
    </div>
  );
}
