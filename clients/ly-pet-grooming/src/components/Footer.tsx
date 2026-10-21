import { contact, footer, nav, site } from "@/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a href="/" className="brand brand--sm" aria-label={`${site.name} — home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.logo} alt="" width={36} height={36} loading="lazy" />
          <span>{site.name}</span>
        </a>
        <nav className="footer__nav" aria-label="Footer">
          {nav.slice(1).map((l) => (
            <a key={l.href} href={`/${l.href}`}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="container footer__base">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span className="footer__links">
          {footer.legal.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href={contact.instagram} target="_blank" rel="noopener">
            Instagram
          </a>
          <a href={contact.facebook} target="_blank" rel="noopener">
            Facebook
          </a>
        </span>
      </div>
    </footer>
  );
}
