import { why } from "@/content";

const numerals = ["i", "ii", "iii"];

export default function Why() {
  return (
    <section className="why section" aria-labelledby="why-title">
      <div className="container">
        <header className="why__head">
          <p className="eyebrow" data-reveal>
            {why.eyebrow}
          </p>
          <h2 id="why-title" className="h2" data-reveal>
            {why.title}
          </h2>
        </header>
        <ul className="why__list">
          {why.points.map((pt, i) => (
            <li key={pt.title} className="why__item" data-reveal style={{ "--d": i } as React.CSSProperties}>
              <span className="why__num">{numerals[i]}</span>
              <h3 className="why__title">{pt.title}</h3>
              <p>{pt.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
