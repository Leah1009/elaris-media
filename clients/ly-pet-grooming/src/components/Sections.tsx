/* eslint-disable @next/next/no-img-element */
import { about, booking, contact, contactSection, gallery, hero, results, reviews, services, why } from "@/content";
import { bookingHref, emailHref, telHref, whatsappHref } from "@/lib/links";

/* ───────────────────────── Hero ───────────────────────── */
export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__title">
            {hero.title} <em>{hero.titleAccent}</em>
          </h1>
          <p className="hero__text">{hero.text}</p>
          <div className="hero__actions">
            <a href={bookingHref} className="btn btn--dark btn--lg" target="_blank" rel="noopener">
              {hero.primaryCta}
            </a>
            <a href="#services" className="btn btn--line btn--lg">
              {hero.secondaryCta}
            </a>
          </div>
          <ul className="trust" aria-label="What we offer">
            {hero.trust.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <figure className="hero__media">
          <img
            src={hero.image}
            alt={hero.imageAlt}
            width={1400}
            height={1750}
            fetchPriority="high"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  );
}

/* ───────────────────────── Results ───────────────────────── */
export function Results() {
  return (
    <section className="section results" aria-labelledby="results-title">
      <div className="container">
        <h2 id="results-title" className="h2 center">
          {results.title}
        </h2>
        <ul className={`results__grid results__grid--${results.items.length}`}>
          {results.items.map((r) => (
            <li key={r.after} className="result">
              <figure>
                {r.before ? (
                  <div className="result__pair">
                    <div className="photo">
                      <img src={r.before} alt={`${r.label} — before`} width={1000} height={1250} loading="lazy" decoding="async" />
                      <span className="tag">Before</span>
                    </div>
                    <div className="photo">
                      <img src={r.after} alt={`${r.label} — after`} width={1000} height={1250} loading="lazy" decoding="async" />
                      <span className="tag tag--after">After</span>
                    </div>
                  </div>
                ) : (
                  <div className="photo">
                    <img src={r.after} alt={r.label} width={1000} height={1250} loading="lazy" decoding="async" />
                  </div>
                )}
                <figcaption>{r.label}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── Services ───────────────────────── */
export function Services() {
  return (
    <section className="section services" id="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <h2 id="services-title" className="h2">
            {services.title}
          </h2>
          <p className="muted">{services.intro}</p>
        </div>
        <ul className="services__list">
          {services.items.map((s) => (
            <li key={s.name} className="service">
              <img src={s.image} alt="" width={160} height={160} loading="lazy" decoding="async" />
              <div>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="center services__cta">
          <a href={bookingHref} className="btn btn--dark btn--lg" target="_blank" rel="noopener">
            Book an Appointment
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Why ───────────────────────── */
export function Why() {
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="container">
        <h2 id="why-title" className="h2 center">
          {why.title}
        </h2>
        <ul className="why__list">
          {why.points.map((p, i) => (
            <li key={p.title}>
              <span className="why__num">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── About ───────────────────────── */
export function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <figure className="photo about__media">
          <img src={about.image} alt={about.imageAlt} width={1200} height={1500} loading="lazy" decoding="async" />
        </figure>
        <div className="about__copy">
          <h2 id="about-title" className="h2">
            {about.title}
          </h2>
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="muted">
              {p}
            </p>
          ))}
          <a href={bookingHref} className="btn btn--line btn--lg" target="_blank" rel="noopener">
            Book an Appointment
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Gallery ───────────────────────── */
export function Gallery() {
  return (
    <section className="section gallery" id="gallery" aria-labelledby="gallery-title">
      <div className="container">
        <h2 id="gallery-title" className="h2 center">
          {gallery.title}
        </h2>
        <ul className="gallery__grid">
          {gallery.items.slice(0, 8).map((g) => (
            <li key={g.src} className="photo">
              <img src={g.src} alt={g.alt} width={1200} height={1200} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
        <div className="center">
          <a href={contact.instagram} className="text-link" target="_blank" rel="noopener">
            {gallery.instagramCta} · {contact.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Reviews ───────────────────────── */
function Stars({ n }: { n: number }) {
  return (
    <span className="stars" role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" className={i < n ? "on" : ""}>
          <path d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.6l-5.1 2.8 1.1-5.8-4.3-4 5.8-.7z" />
        </svg>
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="container">
        <h2 id="reviews-title" className="h2 center">
          {reviews.title}
        </h2>
        <ul className="reviews__list">
          {reviews.items.slice(0, 3).map((r, i) => (
            <li key={i} className="review">
              <Stars n={r.stars} />
              <blockquote>“{r.quote}”</blockquote>
              <p className="review__name">{r.name}</p>
            </li>
          ))}
        </ul>
        {reviews.allReviewsUrl && (
          <div className="center">
            <a href={reviews.allReviewsUrl} className="text-link" target="_blank" rel="noopener">
              Read all reviews
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── Booking CTA ───────────────────────── */
export function BookingCta() {
  return (
    <section className="booking" aria-labelledby="booking-title">
      <div className="container booking__inner">
        <h2 id="booking-title" className="booking__title">
          {booking.title}
        </h2>
        <p>{booking.text}</p>
        <div className="booking__actions">
          <a href={bookingHref} className="btn btn--dark btn--lg" target="_blank" rel="noopener">
            {booking.bookCta}
          </a>
          <a href={telHref} className="btn btn--light btn--lg">
            {booking.callCta}
          </a>
          <a href={whatsappHref} className="btn btn--line btn--lg" target="_blank" rel="noopener">
            {booking.whatsappCta}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Contact ───────────────────────── */
export function Contact() {
  const items: { label: string; value: React.ReactNode }[] = [
    { label: "Phone", value: <a href={telHref}>{contact.phoneDisplay}</a> },
    {
      label: "WhatsApp",
      value: (
        <a href={whatsappHref} target="_blank" rel="noopener">
          Send a message
        </a>
      ),
    },
    { label: "Email", value: <a href={emailHref}>{contact.email}</a> },
    { label: "Service Area", value: contact.serviceArea },
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
          {contact.facebookName}
        </a>
      ),
    },
  ];

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div>
          <h2 id="contact-title" className="h2">
            {contactSection.title}
          </h2>
          <dl className="contact__list">
            {items.map((it) => (
              <div key={it.label}>
                <dt>{it.label}</dt>
                <dd>{it.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="hours">
          <h3>Hours</h3>
          <dl>
            {contact.hours.map((h) => (
              <div key={h.days}>
                <dt>{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
          <a href={bookingHref} className="btn btn--dark btn--lg btn--block" target="_blank" rel="noopener">
            Book an Appointment
          </a>
        </div>
      </div>
    </section>
  );
}
