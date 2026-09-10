const FAQS = [
  {
    q: "Is there really a free trial?",
    a: "Yes — 30 days free, no credit card required to sign up. You can explore the full dashboard before deciding on a plan.",
  },
  {
    q: "Can my clients book online at any time?",
    a: "Yes. Once online booking is turned on, clients can see real availability based on your staff, services and business hours, and book 24/7.",
  },
  {
    q: "Do I need special hardware to accept payments?",
    a: "No. You can accept cards through a secure checkout link today, plus cash and other manual methods. Tap to Pay and a dedicated card reader are coming soon.",
  },
  {
    q: "Can I customize my booking page?",
    a: "Yes — your logo, cover image, brand color, tagline and which sections appear (like Team or Reviews) are all configurable from Settings → Website.",
  },
  {
    q: "What happens when my trial ends?",
    a: "You'll be prompted to choose a plan to keep using your dashboard. Your business data stays safe and waiting either way.",
  },
  {
    q: "Is my client data kept separate from other businesses?",
    a: "Yes. Every business's data is isolated at the database level — no other Luxore business can ever see your clients, appointments or reports.",
  },
];

export function Faq() {
  return (
    <div className="mx-auto max-w-2xl divide-y divide-border">
      {FAQS.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-charcoal">
            {item.q}
            <span className="shrink-0 text-xl text-gold-deep transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
