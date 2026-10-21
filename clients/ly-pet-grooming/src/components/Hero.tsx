import { hero } from "@/content";
import { bookingHref } from "@/lib/links";
import StageSlot from "./StageSlot";

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow intro-anim" style={{ "--d": 0 } as React.CSSProperties}>
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="line">
              <span className="intro-anim" style={{ "--d": 1 } as React.CSSProperties}>
                {hero.titleLine1}
              </span>
            </span>
            <span className="line">
              <em className="intro-anim" style={{ "--d": 2 } as React.CSSProperties}>
                {hero.titleLine2}
              </em>
            </span>
          </h1>
          <p className="hero__text lead intro-anim" style={{ "--d": 3 } as React.CSSProperties}>
            {hero.text}
          </p>
          <div className="hero__actions intro-anim" style={{ "--d": 4 } as React.CSSProperties}>
            <a href={bookingHref} className="btn btn--dark" target="_blank" rel="noopener">
              {hero.primaryCta}
            </a>
            <a href="#services" className="link-arrow">
              {hero.secondaryCta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <StageSlot id="hero" className="hero__stage" />
      </div>
      <div className="hero__scroll container" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
