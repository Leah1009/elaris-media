import { about } from "@/content";

export default function About() {
  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <figure className="about__media" data-reveal="image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={about.image} alt={about.imageAlt} width={1200} height={1500} loading="lazy" decoding="async" />
        </figure>
        <div className="about__copy">
          <p className="eyebrow" data-reveal>
            {about.eyebrow}
          </p>
          <h2 id="about-title" className="h2" data-reveal>
            {about.title}
          </h2>
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} className="body-lg" data-reveal>
              {p}
            </p>
          ))}
          <p className="about__signature" data-reveal>
            {about.signature}
          </p>
        </div>
      </div>
    </section>
  );
}
