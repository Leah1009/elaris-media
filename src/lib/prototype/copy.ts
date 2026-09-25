export type Lang = "en" | "es";

export const copy: Record<
  Lang,
  {
    kicker: string;
    camera: { eyebrow: string; headline: string; body: string };
    phone: { eyebrow: string; headline: string; body: string };
    reduced: { headline: string; body: string };
    scrollHint: string;
  }
> = {
  en: {
    kicker: "Elaris Media — Prototype",
    camera: {
      eyebrow: "Where the story starts",
      headline: "One camera. Every story.",
      body: "Every brand begins with a single frame worth capturing.",
    },
    phone: {
      eyebrow: "Where it's seen",
      headline: "Now it lives on every screen.",
      body: "From capture to feed — content built for how people actually watch.",
    },
    reduced: {
      headline: "From camera to screen.",
      body: "Content that moves from capture to feed, built for how people actually watch.",
    },
    scrollHint: "Scroll to transform",
  },
  es: {
    kicker: "Elaris Media — Prototipo",
    camera: {
      eyebrow: "Donde empieza la historia",
      headline: "Una cámara. Toda una historia.",
      body: "Cada marca empieza con un solo momento que vale la pena capturar.",
    },
    phone: {
      eyebrow: "Donde se ve",
      headline: "Ahora vive en cada pantalla.",
      body: "De la captura al feed — contenido hecho para cómo la gente realmente mira.",
    },
    reduced: {
      headline: "De la cámara a la pantalla.",
      body: "Contenido que va de la captura al feed, hecho para cómo la gente realmente mira.",
    },
    scrollHint: "Desliza para transformar",
  },
};
