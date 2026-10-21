"use client";

import { useRef, useState } from "react";
import { work } from "@/content";

export default function Work() {
  const [pos, setPos] = useState(50);
  const rail = useRef<HTMLUListElement>(null);
  const { beforeAfter: ba } = work;

  const scrollRail = (dir: 1 | -1) => {
    const el = rail.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className="work section" id="work" aria-labelledby="work-title">
      <div className="container">
        <header className="work__head">
          <div>
            <p className="eyebrow" data-reveal>
              {work.eyebrow}
            </p>
            <h2 id="work-title" className="h2" data-reveal>
              {work.title}
            </h2>
          </div>
          <div className="work__arrows" data-reveal>
            <button type="button" className="icon-btn" onClick={() => scrollRail(-1)} aria-label="Previous photos">
              ←
            </button>
            <button type="button" className="icon-btn" onClick={() => scrollRail(1)} aria-label="Next photos">
              →
            </button>
          </div>
        </header>

        <figure className="ba" data-reveal="image" style={{ "--pos": `${pos}%` } as React.CSSProperties}>
          <div className="ba__frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ba.after} alt={`${ba.alt} — after`} width={1600} height={1000} loading="lazy" decoding="async" />
            <div className="ba__before">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ba.before} alt={`${ba.alt} — before`} width={1600} height={1000} loading="lazy" decoding="async" />
            </div>
            <span className="ba__label ba__label--before">Before</span>
            <span className="ba__label ba__label--after">After</span>
            <span className="ba__handle" aria-hidden="true">
              <i />
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Drag to compare before and after"
              className="ba__range"
            />
          </div>
          <figcaption>{ba.caption}</figcaption>
        </figure>
      </div>

      <ul className="rail" ref={rail} aria-label="Grooming gallery">
        {work.gallery.map((g, i) => (
          <li key={g.src + i} className={`rail__item rail__item--${g.shape}`}>
            <figure>
              <div className="rail__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {g.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
