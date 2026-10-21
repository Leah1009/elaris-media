import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <Header home={false} />
      <main id="main" className="legal container">
        <p className="eyebrow">Last updated · {updated}</p>
        <h1 className="h2">{title}</h1>
        <div className="legal__body">{children}</div>
      </main>
      <Footer />
    </>
  );
}
