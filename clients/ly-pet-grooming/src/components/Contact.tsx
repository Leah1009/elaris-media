import { contact, contactSection as c } from "@/content";
import { bookingHref, emailHref, telHref, whatsappHref } from "@/lib/links";

export default function Contact() {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Phone", value: <a href={telHref}>{contact.phoneDisplay}</a> },
    {
      label: "WhatsApp",
      value: (
        <a href={whatsappHref} target="_blank" rel="noopener">
          Message us
        </a>
      ),
    },
    { label: "Email", value: <a href={emailHref}>{contact.email}</a> },
    { label: "Service Area", value: contact.serviceArea },
    {
      label: "Hours",
      value: (
        <span className="hours">
          {contact.hours.map((h) => (
            <span key={h.days}>
              <span>{h.days}</span>
              <span>{h.time}</span>
            </span>
          ))}
        </span>
      ),
    },
    {
      label: "Instagram",
      value: (
        <a href={contact.instagram} target="_blank" rel="noopener">
          {contact.instagramHandle}
        </a>
      ),
    },
    {
      label: "Facebook",
      value: (
        <a href={contact.facebook} target="_blank" rel="noopener">
          Facebook
        </a>
      ),
    },
  ];

  return (
    <section className="contact section" id="contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__intro">
          <p className="eyebrow" data-reveal>
            {c.eyebrow}
          </p>
          <h2 id="contact-title" className="h2" data-reveal>
            {c.title}
          </h2>
          <p className="lead" data-reveal>
            {c.text}
          </p>
          <div className="contact__actions" data-reveal>
            <a href={telHref} className="btn btn--dark">
              {c.callCta}
            </a>
            <a href={whatsappHref} className="btn btn--line" target="_blank" rel="noopener">
              {c.whatsappCta}
            </a>
            <a href={bookingHref} className="btn btn--line" target="_blank" rel="noopener">
              {c.bookCta}
            </a>
          </div>
        </div>
        <dl className="contact__list">
          {rows.map((r) => (
            <div key={r.label} className="contact__row" data-reveal>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
