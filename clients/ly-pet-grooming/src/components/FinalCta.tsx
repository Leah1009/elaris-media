import { finalCta } from "@/content";
import { bookingHref } from "@/lib/links";
import StageSlot from "./StageSlot";

export default function FinalCta() {
  return (
    <section className="final" aria-labelledby="final-title">
      <div className="container final__inner">
        <StageSlot id="final" className="final__stage" />
        <h2 id="final-title" className="h2 final__title" data-reveal>
          {finalCta.title}
        </h2>
        <p className="lead" data-reveal>
          {finalCta.text}
        </p>
        <div data-reveal>
          <a href={bookingHref} className="btn btn--dark" target="_blank" rel="noopener">
            {finalCta.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
