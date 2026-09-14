import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SiteNav } from "@/components/marketing/site-nav";
import { FullDashboardMock } from "@/components/marketing/dashboard-mock";
import {
  BookingsVisual,
  ClientsVisual,
  PaymentsVisual,
  InventoryVisual,
  MarketingVisual,
  WebsiteVisual,
} from "@/components/marketing/feature-visual";
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

const HERO_IMAGE = "https://i.pinimg.com/736x/8d/f5/db/8df5dbceaa157a59d536cf4290773977.jpg";

const OVERVIEW_FEATURES: { titleKey: TranslationKey; bodyKey: TranslationKey; Visual: () => React.JSX.Element }[] = [
  { titleKey: "feature_bookings_title", bodyKey: "feature_bookings_body", Visual: BookingsVisual },
  { titleKey: "feature_clients_title", bodyKey: "feature_clients_body", Visual: ClientsVisual },
  { titleKey: "feature_payments_title", bodyKey: "feature_payments_body", Visual: PaymentsVisual },
  { titleKey: "feature_inventory_title", bodyKey: "feature_inventory_body", Visual: InventoryVisual },
  { titleKey: "feature_marketing_title", bodyKey: "feature_marketing_body", Visual: MarketingVisual },
  { titleKey: "feature_website_title", bodyKey: "feature_website_body", Visual: WebsiteVisual },
];

const STEPS: { step: string; titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { step: "01", titleKey: "step1_title", bodyKey: "step1_body" },
  { step: "02", titleKey: "step2_title", bodyKey: "step2_body" },
  { step: "03", titleKey: "step3_title", bodyKey: "step3_body" },
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
        { label: t(locale, "footer_hardware"), href: "#payments" },
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

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_IMAGE} alt="" className="animate-hero-zoom h-full w-full object-cover" />
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

      {/* MEET LUXORE */}
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

      {/* EVERYTHING, CONNECTED */}
      <section id="features" className="scroll-mt-20 bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "features_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "features_title")}</h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OVERVIEW_FEATURES.map((f, i) => (
              <Reveal key={f.titleKey} delayMs={i * 80}>
                <div className="group h-full rounded-md border border-border bg-white p-6 transition duration-300 hover:border-gold-deep hover:shadow-md hover:shadow-charcoal/5">
                  <f.Visual />
                  <h3 className="mt-4 font-display text-lg text-charcoal">{t(locale, f.titleKey)}</h3>
                  <p className="mt-1.5 text-sm text-ink">{t(locale, f.bodyKey)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKINGS & CALENDAR */}
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
            <PhoneMock />
          </Reveal>
        </div>
      </section>

      {/* CLIENTS & FORMS */}
      <section className="bg-cream-deep/30 px-6 py-24 sm:px-10">
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

      {/* PAYMENTS + HARDWARE */}
      <section id="payments" className="scroll-mt-20 mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <Reveal className="text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "payments_eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "payments_title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-ink sm:text-base">{t(locale, "payments_body")}</p>
        </Reveal>

        <Reveal delayMs={120} className="mx-auto mt-14 max-w-sm">
          <CheckoutMock />
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-3">
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
      </section>

      {/* INVENTORY */}
      <section className="bg-cream-deep/30 px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "inventory_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "inventory_title")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">{t(locale, "inventory_body")}</p>
          </Reveal>
          <Reveal delayMs={120}>
            <InventoryMock />
          </Reveal>
        </div>
      </section>

      {/* MARKETING & GROWTH */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
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

      {/* PERSONALIZED WEBSITES */}
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

      {/* HOW IT WORKS */}
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

      {/* ABOUT */}
      <section id="about" className="scroll-mt-20 mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-2">
          <Reveal>
            <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "about_eyebrow")}</span>
            <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "about_title")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink sm:text-base">{t(locale, "about_body")}</p>
          </Reveal>
          <Reveal delayMs={120}>
            <div className="overflow-hidden rounded-md border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HERO_IMAGE} alt="" className="h-80 w-full object-cover sm:h-[26rem]" />
            </div>
          </Reveal>
        </div>
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

      {/* FAQ */}
      <section className="bg-cream-deep/30 px-6 py-24 sm:px-10">
        <Reveal className="text-center">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-gold-deep">{t(locale, "faq_eyebrow")}</span>
          <h2 className="mt-3 font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "faq_title")}</h2>
        </Reveal>
        <div className="mt-14">
          <Faq locale={locale} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center sm:px-10">
        <Reveal>
          <h2 className="font-display text-3xl text-charcoal sm:text-4xl">{t(locale, "final_cta_title")}</h2>
          <p className="mt-4 text-sm text-ink sm:text-base">{t(locale, "hero_trial_note")}</p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-sm bg-charcoal px-10 py-3.5 text-sm font-medium tracking-wide text-white transition hover:bg-charcoal-soft"
          >
            {t(locale, "start_free_month_cta")}
          </Link>
        </Reveal>
      </section>

      {/* FOOTER */}
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
            <div className="flex gap-4 text-xs text-ink/40">
              <span>Instagram</span>
              <span>Facebook</span>
              <span>TikTok</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
