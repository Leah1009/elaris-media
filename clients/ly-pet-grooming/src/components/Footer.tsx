import { contact, footer, site } from "@/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a href="/" className="brand brand--small" aria-label={`${site.name} — home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.logo} alt="" width={36} height={36} className="brand__logo" loading="lazy" />
          <span className="brand__name">{site.name}</span>
        </a>
        <nav className="footer__nav" aria-label="Footer">
          {footer.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="footer__social">
          <a href={contact.instagram} target="_blank" rel="noopener">
            Instagram
          </a>
          <a href={contact.facebook} target="_blank" rel="noopener">
            Facebook
          </a>
        </div>
      </div>
      <div className="container footer__base">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span className="footer__legal">
          {footer.legal.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </span>
      </div>
    </footer>
  );
}
