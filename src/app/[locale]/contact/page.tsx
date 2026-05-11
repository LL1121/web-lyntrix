import type { Metadata } from "next";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, isLocale, type AppLocale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

function resolveLocale(value: string): AppLocale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = resolveLocale(locale);
  return currentLocale === "es"
    ? {
        title: "Iniciar Proyecto — Lyntrix",
        description: "¿Listo para construir algo extraordinario? Envíanos una señal y te respondemos en 48 horas.",
      }
    : {
        title: "Start a Project — Lyntrix",
        description: "Ready to build something extraordinary? Drop us a signal and we will respond within 48 hours.",
      };
}

export default async function LocalizedContactPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(resolveLocale(locale));

  return (
    <main style={{ paddingTop: "80px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 32px 0", textAlign: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.25em", color: "#00D2FF", textTransform: "uppercase", marginBottom: "20px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D2FF", display: "inline-block", animation: "pulse 2s infinite" }} />
          {dict.pages.contact.kicker}
        </span>
        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "white", lineHeight: 1.05, marginBottom: "16px" }}>
          {dict.pages.contact.titlePrefix}{" "}
          <span style={{ background: "linear-gradient(135deg, #00D2FF, #3a7bd5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {dict.pages.contact.titleHighlight}
          </span>
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.38)", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
          {dict.pages.contact.description}
        </p>
      </div>

      <Contact />
      <div style={{ flex: 1 }} />
      <Footer />
    </main>
  );
}

