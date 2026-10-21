import { reviews } from "@/content";

export default function Reviews() {
  return (
    <section className="reviews section" id="reviews" aria-labelledby="reviews-title">
      <div className="container">
        <header className="section-head section-head--center">
          <p className="eyebrow" data-reveal>
            {reviews.eyebrow}
          </p>
          <h2 id="reviews-title" className="h2" data-reveal>
            {reviews.title}
          </h2>
        </header>
        <ul className="reviews__list">
          {reviews.items.slice(0, 3).map((r, i) => (
            <li key={i} className="review" data-reveal style={{ "--d": i } as React.CSSProperties}>
              <figure>
                <span className="review__mark" aria-hidden="true">
                  “
                </span>
                <blockquote>
                  <p>{r.quote}</p>
                </blockquote>
                <figcaption>
                  <strong>{r.name}</strong>
                  <span>{r.detail}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
