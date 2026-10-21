"use client";

import { useEffect, useRef, useState } from "react";
import { services } from "@/content";
import { stage } from "@/lib/stage";
import StageSlot from "./StageSlot";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Services() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    stage.servicesTrack = list;
    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-index]"));
    // An item becomes active when it crosses the middle band of the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.index);
          stage.activeService = i;
          setActive(i);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      stage.servicesTrack = null;
    };
  }, []);

  const total = services.items.length;

  return (
    <section className="services section" id="services" aria-labelledby="services-title">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow" data-reveal>
            {services.eyebrow}
          </p>
          <h2 id="services-title" className="h2" data-reveal>
            {services.title}
          </h2>
          <p className="lead section-head__lead" data-reveal>
            {services.intro}
          </p>
        </header>

        <div className="services__layout">
          <div className="services__sticky">
            <StageSlot id="services" className="services__stage" />
            <div className="services__meta" aria-hidden="true">
              <span className="services__count">
                {pad(active + 1)} <span>/ {pad(total)}</span>
              </span>
              <span className="services__current" key={active}>
                {services.items[active]?.title}
              </span>
              <span className="services__bar">
                <i style={{ transform: `scaleX(${(active + 1) / total})` }} />
              </span>
            </div>
          </div>

          <ol className="services__list" ref={listRef}>
            {services.items.map((item, i) => (
              <li
                key={item.title}
                data-index={i}
                className={`service ${i === active ? "is-active" : ""}`}
              >
                <span className="service__index">{pad(i + 1)}</span>
                <h3 className="service__title">{item.title}</h3>
                <p className="service__text">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
