"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { DictKey } from "@/lib/i18n/dictionary";
import Reveal from "@/components/Reveal";
import { CONTACT_EMAIL, waLink } from "@/lib/constants";

const CHIPS: { key: string; labelKey: DictKey }[] = [
  { key: "social", labelKey: "form.chip.social" },
  { key: "web", labelKey: "form.chip.web" },
  { key: "ads", labelKey: "form.chip.ads" },
  { key: "branding", labelKey: "form.chip.branding" },
  { key: "dental", labelKey: "form.chip.dental" },
  { key: "admin", labelKey: "form.chip.admin" },
  { key: "notsure", labelKey: "form.chip.notsure" },
];

export default function ContactSection() {
  const { t, lang } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);
  const [business, setBusiness] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const toggleChip = (key: string) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const services = selected.map((key) => t(CHIPS.find((c) => c.key === key)!.labelKey)).join(", ");
    const bodyLines =
      lang === "es"
        ? [
            `Negocio: ${business}`,
            `Nombre: ${name}`,
            `Correo: ${email}`,
            phone ? `Teléfono: ${phone}` : null,
            services ? `Necesita ayuda con: ${services}` : null,
            message ? `Mensaje: ${message}` : null,
          ]
        : [
            `Business: ${business}`,
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : null,
            services ? `Needs help with: ${services}` : null,
            message ? `Message: ${message}` : null,
          ];
    const body = bodyLines.filter(Boolean).join("\n");
    const subject = lang === "es" ? `Plan personalizado — ${business || name}` : `Custom plan — ${business || name}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const waMessage =
    lang === "es"
      ? "Hola Elaris Media! Me gustaría agendar una llamada de estrategia gratis."
      : "Hi Elaris Media! I'd like to book a free strategy call.";

  return (
    <section id="contact" className="bg-ink px-6 py-28 text-cream-soft">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-light">{t("finalcta.eyebrow")}</span>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl md:text-4xl">
            {t("finalcta.headline")} <em className="text-gold-light not-italic">{t("finalcta.accent")}</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-cream-soft/70">{t("finalcta.body")}</p>
          <a
            href={waLink(waMessage)}
            target="_blank"
            rel="noopener"
            className="mt-7 inline-block rounded-full border border-cream-soft/25 px-6 py-2.5 text-[12px] uppercase tracking-[0.12em] text-cream-soft transition hover:border-gold-light hover:text-gold-light"
          >
            {t("finalcta.ctaSecondary")}
          </a>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-16 max-w-2xl rounded-lg bg-cream-soft p-8 text-ink md:p-10">
          <span className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">{t("form.eyebrow")}</span>
          <h3
            className="mt-2 font-display text-2xl text-ink"
            dangerouslySetInnerHTML={{ __html: t("form.headline") }}
          />
          <p className="mt-2 text-sm text-ink/60">{t("form.body")}</p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-[12px] uppercase tracking-[0.1em] text-ink/60">
                {t("form.businessName")}
                <input
                  required
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  className="rounded-md border border-ink/15 bg-cream px-3.5 py-2.5 text-sm normal-case tracking-normal text-ink outline-none focus:border-gold-deep"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-[12px] uppercase tracking-[0.1em] text-ink/60">
                {t("form.yourName")}
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-md border border-ink/15 bg-cream px-3.5 py-2.5 text-sm normal-case tracking-normal text-ink outline-none focus:border-gold-deep"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-[12px] uppercase tracking-[0.1em] text-ink/60">
                {t("form.email")}
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md border border-ink/15 bg-cream px-3.5 py-2.5 text-sm normal-case tracking-normal text-ink outline-none focus:border-gold-deep"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-[12px] uppercase tracking-[0.1em] text-ink/60">
                {t("form.phone")}
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-md border border-ink/15 bg-cream px-3.5 py-2.5 text-sm normal-case tracking-normal text-ink outline-none focus:border-gold-deep"
                />
              </label>
            </div>

            <div>
              <span className="text-[12px] uppercase tracking-[0.1em] text-ink/60">{t("form.serviceLabel")}</span>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {CHIPS.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => toggleChip(chip.key)}
                    className={`rounded-full border px-3.5 py-1.5 text-[12px] transition ${
                      selected.includes(chip.key)
                        ? "border-ink bg-ink text-cream-soft"
                        : "border-ink/20 text-ink/70 hover:border-ink/40"
                    }`}
                  >
                    {t(chip.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex flex-col gap-1.5 text-[12px] uppercase tracking-[0.1em] text-ink/60">
              {t("form.message")}
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none rounded-md border border-ink/15 bg-cream px-3.5 py-2.5 text-sm normal-case tracking-normal text-ink outline-none focus:border-gold-deep"
              />
            </label>

            <button
              type="submit"
              className="mt-1 rounded-full bg-ink px-7 py-3 text-[12px] uppercase tracking-[0.14em] text-cream-soft transition hover:bg-gold-deep"
            >
              {t("form.submit")}
            </button>
            <p className="text-[11px] text-ink/40">{t("form.disclaimer")}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
