import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SiteNav } from "@/components/marketing/site-nav";
import { FullDashboardMock } from "@/components/marketing/dashboard-mock";
import { BookingsVisual, ClientsVisual, MarketingVisual, ManagementVisual } from "@/components/marketing/feature-visual";
import { PhoneMock } from "@/components/marketing/phone-mock";
import {
  ClientProfileMock,
  CheckoutMock,
  InventoryMock,
  AutomationMock,
  WebsiteExamplesMock,
} from "@/components/marketing/section-mocks";
import { HARDWARE_CATALOG } from "@/lib/luxora/hardware-catalog";
import { ReviewsPlaceholder } from "@/components/marketing/reviews-placeholder";
import { Faq } from "@/components/marketing/faq";
import { getPublicLocale } from "@/lib/luxora/locale";
import { t, type Locale, type TranslationKey } from "@/lib/luxora/i18n";
import { PHOTO_ASSETS } from "@/lib/luxora/photo-assets";

const HERO_IMAGE = PHOTO_ASSETS.hero;

const STEPS: { step: string; titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { step: "01", titleKey: "step1_title", bodyKey: "step1_body" },
  { step: "02", titleKey: "step2_title", bodyKey: "step2_body" },
  { step: "03", titleKey: "step3_title", bodyKey: "step3_body" },
];

type FeatureCategory = {
  titleKey: TranslationKey;
  Visual: () => React.JSX.Element;
  items: TranslationKey[];
};

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    titleKey: "cat_scheduling_payments",
    Visual: BookingsVisual,
    items: [
      "cat_item_calendar_scheduling",
      "cat_item_online_booking",
      "cat_item_checkout_pos",
      "cat_item_deposits",
      "cat_item_payments",
      "cat_item_gift_cards",
      "cat_item_waitlist",
    ],
  },
  {
    titleKey: "cat_clients_relationships",
    Visual: ClientsVisual,
    items: [
      "cat_item_client_management",
      "cat_item_client_profiles",
      "cat_item_forms",
      "cat_item_appointment_history",
      "cat_item_before_after",
      "cat_item_memberships_packages",
      "cat_item_loyalty",
      "cat_item_reviews",
    ],
  },
  {
    titleKey: "cat_marketing_communication",
    Visual: MarketingVisual,
    items: [
      "cat_item_messages",
      "cat_item_appointment_reminders",
      "cat_item_automated_flows",
      "cat_item_campaigns",
      "cat_item_promotions",
      "cat_item_rebooking",
      "cat_item_birthday_messages",
      "cat_item_client_segmentation",
    ],
  },
  {
    titleKey: "cat_business_management",
    Visual: ManagementVisual,
    items: [
      "cat_item_staff_management",
      "cat_item_services",
      "cat_item_inventory_retail",
      "cat_item_reports",
      "cat_item_multiple_locations",
      "cat_item_business_hours",
      "cat_item_website_branding",
    ],
  },
];

const BEAUTY_CATEGORIES: { labelKey: TranslationKey; image: string | null }[] = [
  { labelKey: "cat_hair_salons", image: PHOTO_ASSETS.hair },
  { labelKey: "cat_nail_salons", image: PHOTO_ASSETS.nails },
  { labelKey: "cat_lash_brow_studios", image: PHOTO_ASSETS.lashesBrows },
  { labelKey: "cat_makeup_studios", image: PHOTO_ASSETS.makeup },
];

function footerGroups(locale: Locale): { title: string; links: { label: string; href?: string }[] }[] {
  return [
    {
      title: t(locale, "footer_product"),
      links: [
        { label: t(locale, "nav_features"), href: "#features" },
        { label: t(locale, "footer_online_booking"), href: "#features" },
        { label: t(locale, "nav_clients"), href: "#features" },
        { label: t(locale, "nav_payments"), href: "#payments" },
        { label: t(locale, "nav_marketing"), href: "#features" },
        { label: t(locale, "feature_website_title"), href: "#features" },
      ],
    },
    {
      title: t(locale, "footer_company"),
      links: [
        { label: t(locale, "nav_about"), href: "#about" },
        { label: t(locale, "footer_contact") },
        { label: t(locale, "footer_support") },
        { label: t(locale, "footer_help_center") },
        { label: t(locale, "footer_contact_support") },
      ],
    },
    {
      title: t(locale, "footer_legal"),
      links: [{ label: t(locale, "footer_privacy") }, { label: t(locale, "footer_terms") }, { label: t(locale, "footer_cookies") }],
    },
  ];
}

export default async function HomePage() {
  const locale = await getPublicLocale();
  const FOOTER_GROUPS = footerGroups(locale);

  return (
    <main>
      <SiteNav locale={locale} />

      {/* 01 — HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="" className="animate-hero-zoom h-full w-full object-cover" style={{ objectPosition: "50% 30%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/75 via-charcoal/55 to-charcoal/85" />
        </div>

        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-16 text-center sm:px-10">
          <span className="animate-hero-fade-up font-display text-xs uppercase tracking-[0.4em] text-gold" style={{ animationDelay: "0.1s" }}>
            {t(locale, "hero_eyebrow")}
          </span>
          <h1 className="animate-hero-fade-up mt-6 font-display text-4xl leading-tight text-white sm:text-6xl" style={{ animationDelay: "0.25s" }}>
            {t(locale, "hero_headline")}
          </h1>
          <p className="animate-hero-fade-up mt-6 max-w-xl text-balance text-base text-white/85 sm:text-lg" style={{ animationDelay: "0.4s" }}>
            {t(locale, "hero_subhead")}
          </p>
          <div className="animate-hero-fade-up mt-10 flex flex-col items-center gap-4" style={{ animationDelay: "0.55s" }}>
            <Link href="/register" className="rounded-sm bg-gold-deep px-9 py-3.5 text-sm font-medium tracking-wide text-white transition hover:opacity-90">
              {t(locale, "start_free_month_cta")}
            </Link>
            <Link href="/login" className="text-sm font-medium tracking-wide text-white/70 underline-offset-4 transition hover:text-white hover:underline">
              {t(locale, "nav_log_in")}
            </Link>
          </div>
          <p className="animate-hero-fade-up mt-4 text-xs text-white/60" style={{ animationDelay: "0.65s" }}>
            {t(locale, "hero_trial_note")}
          </p>
        </div>
      </section>

      {/* 02 — MEET LUXORE */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <Reveal className="text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "meet_eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-5xl">{t(locale, "meet_title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink">{t(locale, "meet_subhead")}</p>
        </Reveal>
        <Reveal delayMs={150} className="mt-14">
          <FullDashboardMock />
        </Reveal>
      </section>

      {/* 03 — EVERYTHING YOUR BEAUTY BUSINESS NEEDS */}
      <section id="features" className="scroll-mt-20 bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "features_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "features_title")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-ink sm:text-base">{t(locale, "features_subhead")}</p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
            {FEATURE_CATEGORIES.map((cat, i) => (
              <Reveal key={cat.titleKey} delayMs={i * 80}>
                <div className="flex items-center gap-3">
                  <cat.Visual />
                  <h3 className="font-display text-xl text-charcoal">{t(locale, cat.titleKey)}</h3>
                </div>
                <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-ink sm:grid-cols-2">
                  {cat.items.map((itemKey) => (
                    <li key={itemKey} className="border-b border-border/70 py-1.5">
                      {t(locale, itemKey)}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — SCHEDULING & PAYMENTS */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "bookings_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "bookings_title")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">{t(locale, "bookings_body")}</p>
            <ul className="mt-5 flex flex-col gap-2 text-sm text-ink">
              <li>— {t(locale, "bookings_li1")}</li>
              <li>— {t(locale, "bookings_li2")}</li>
              <li>— {t(locale, "bookings_li3")}</li>
              <li>— {t(locale, "bookings_li4")}</li>
            </ul>
          </Reveal>
          <Reveal delayMs={120}>
            <PhoneMock locale={locale} />
          </Reveal>
        </div>
      </section>

      <section id="payments" className="scroll-mt-20 bg-cream-deep/30 px-6 py-24 sm:px-10">
        <Reveal className="text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "payments_eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "payments_title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-ink sm:text-base">{t(locale, "payments_body")}</p>
        </Reveal>

        <Reveal delayMs={120} className="mx-auto mt-14 max-w-sm">
          <CheckoutMock />
        </Reveal>

        <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-3">
          {HARDWARE_CATALOG.map((hw, i) => (
            <Reveal key={hw.key} delayMs={i * 100} className="text-center">
              <span className="font-display text-3xl text-gold">{hw.index}</span>
              <h3 className="mt-3 font-display text-xl text-charcoal">{t(locale, hw.headlineKey)}</h3>
              <p className="mt-2 text-sm text-ink">{t(locale, hw.bodyKey)}</p>
              <button
                type="button"
                disabled
                title="Hardware details are coming soon."
                className="mt-4 rounded-sm border border-border px-5 py-2 text-xs font-medium tracking-wide text-ink/50"
              >
                {t(locale, hw.ctaKey)}
              </button>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-ink/50">{t(locale, "hardware_note")}</p>

        <Reveal delayMs={100} className="relative mt-20 h-72 overflow-hidden rounded-md sm:h-96">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTO_ASSETS.paymentsFrontDesk} alt="" className="h-full w-full object-cover" style={{ objectPosition: "50% 35%" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
          <p className="absolute bottom-6 left-6 right-6 font-display text-xl text-white sm:text-2xl">{t(locale, "payments_title")}</p>
        </Reveal>
      </section>

      {/* 05 — CLIENTS & RELATIONSHIPS */}
      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <ClientProfileMock />
          </Reveal>
          <Reveal delayMs={120} className="order-1 lg:order-2">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "clients_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "clients_section_title")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">{t(locale, "clients_body")}</p>
          </Reveal>
        </div>
      </section>

      {/* 06 — MARKETING & COMMUNICATION */}
      <section className="bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <AutomationMock />
          </Reveal>
          <Reveal delayMs={120} className="order-1 lg:order-2">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "marketing_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "marketing_title")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">{t(locale, "marketing_body")}</p>
          </Reveal>
        </div>
      </section>

      {/* 07 — BUSINESS MANAGEMENT (Inventory + Website) */}
      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "cat_business_management")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "inventory_title")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">{t(locale, "inventory_body")}</p>
          </Reveal>
          <Reveal delayMs={120}>
            <InventoryMock />
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "websites_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "websites_title")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink sm:text-base">{t(locale, "websites_body")}</p>
          </Reveal>
          <Reveal delayMs={120} className="mt-14">
            <WebsiteExamplesMock />
          </Reveal>
        </div>
      </section>

      {/* 09 — MADE FOR EVERY BEAUTY BUSINESS */}
      <section className="px-6 py-24 sm:px-10">
        <Reveal className="mx-auto max-w-6xl text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "made_for_beauty_eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "made_for_beauty_title")}</h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BEAUTY_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.labelKey} delayMs={i * 90} className="group relative h-80 overflow-hidden rounded-md sm:h-[26rem]">
              {cat.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    style={{ objectPosition: "50% 25%" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                  <p className="absolute bottom-5 left-4 right-4 font-display text-lg text-white">{t(locale, cat.labelKey)}</p>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-cream-deep/60 px-6 text-center">
                  <p className="font-display text-lg text-charcoal">{t(locale, cat.labelKey)}</p>
                </div>
              )}
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink/60">{t(locale, "made_for_beauty_note")}</p>
      </section>

      {/* 10 — ABOUT / WHY LUXORE */}
      <section id="about" className="scroll-mt-20 bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <Reveal>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "about_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "about_title")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">{t(locale, "about_body")}</p>
          </Reveal>
          <Reveal delayMs={120}>
            <div className="overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PHOTO_ASSETS.about} alt="" className="h-80 w-full object-cover sm:h-[28rem]" style={{ objectPosition: "50% 25%" }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 11 — TEAM */}
      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <Reveal className="order-2 sm:order-1">
            <div className="overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={PHOTO_ASSETS.team} alt="" className="h-80 w-full object-cover sm:h-[28rem]" style={{ objectPosition: "50% 20%" }} />
            </div>
          </Reveal>
          <Reveal delayMs={120} className="order-1 sm:order-2">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "team_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "team_title")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">{t(locale, "team_body")}</p>
          </Reveal>
        </div>
      </section>

      {/* 12 — HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 bg-charcoal py-24 text-cream">
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <Reveal className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold">{t(locale, "how_it_works_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">{t(locale, "how_it_works_title")}</h2>
          </Reveal>

          <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent sm:block" />
            {STEPS.map((s, i) => (
              <Reveal key={s.step} delayMs={i * 150} className="relative text-center sm:text-left">
                <span className="relative z-10 inline-block bg-charcoal pr-3 font-display text-4xl text-gold">{s.step}</span>
                <h3 className="mt-4 font-display text-xl text-white">{t(locale, s.titleKey)}</h3>
                <p className="mt-2 text-sm text-white/70">{t(locale, s.bodyKey)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 13 — 30-DAY FREE TRIAL */}
      <section className="px-6 py-20 text-center sm:px-10">
        <Reveal className="mx-auto max-w-xl">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "trial_banner_eyebrow")}</span>
          <h2 className="mt-3 font-display text-2xl text-charcoal sm:text-3xl">{t(locale, "trial_banner_title")}</h2>
          <p className="mt-4 text-sm text-ink sm:text-base">{t(locale, "trial_banner_body")}</p>
        </Reveal>
      </section>

      {/* SUCCESS STORIES */}
      <section className="bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "reviews_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "reviews_title")}</h2>
          </Reveal>
          <Reveal delayMs={120} className="mt-14">
            <ReviewsPlaceholder locale={locale} />
          </Reveal>
        </div>
      </section>

      {/* 14 — FAQ */}
      <section className="px-6 py-24 sm:px-10">
        <Reveal className="text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "faq_eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "faq_title")}</h2>
        </Reveal>
        <div className="mt-14">
          <Faq locale={locale} />
        </div>
      </section>

      {/* 15 — FINAL CTA */}
      <section className="relative flex min-h-[32rem] items-center overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PHOTO_ASSETS.finalCta} alt="" className="h-full w-full object-cover" style={{ objectPosition: "50% 35%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/60 to-charcoal/80" />
        </div>
        <Reveal className="relative mx-auto max-w-2xl px-6 py-20 text-center sm:px-10">
          <h2 className="font-display text-3xl text-white sm:text-4xl">{t(locale, "final_cta_title")}</h2>
          <p className="mt-3 font-display text-xl text-gold sm:text-2xl">{t(locale, "final_cta_subtitle")}</p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-sm bg-gold-deep px-10 py-3.5 text-sm font-medium tracking-wide text-white transition hover:opacity-90"
          >
            {t(locale, "start_free_month_cta")}
          </Link>
        </Reveal>
      </section>

      {/* 16 — FOOTER */}
      <footer className="border-t border-border px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <span className="font-display text-sm uppercase tracking-[0.3em] text-charcoal">Luxore</span>
              <p className="mt-3 text-xs leading-relaxed text-ink/60">{t(locale, "footer_tagline")}</p>
            </div>
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{group.title}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {group.links.map((link) =>
                    link.href ? (
                      <li key={link.label}>
                        <a href={link.href} className="text-sm text-ink/70 transition hover:text-gold-deep">
                          {link.label}
                        </a>
                      </li>
                    ) : (
                      <li key={link.label} className="text-sm text-ink/40">
                        {link.label}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-xs text-ink/50">
              © {new Date().getFullYear()} Luxore. {t(locale, "footer_rights")}
            </p>
            <div className="flex items-center gap-6 text-xs text-ink/40">
              <div className="flex gap-4">
                <span>Instagram</span>
                <span>Facebook</span>
                <span>TikTok</span>
              </div>
              <span className="flex items-center gap-1.5">
                <span>{t(locale, "footer_language")}:</span>
                <span className="font-medium text-ink/60">EN / ES</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
