import type { Metadata } from "next";
import Services from "@/components/Services";
import Vault from "@/components/Vault";
import PageCTAContact from "@/components/PageCTAContact";
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
        title: "Proyectos — Lyntrix",
        description:
          "Más de 50 proyectos entregados. Soluciones de IA, desarrollo web de alta fidelidad y arquitectura cloud orientada a resultados.",
      }
    : {
        title: "Our Work — Lyntrix",
        description:
          "50+ projects shipped. AI solutions, high-fidelity web development and cloud architecture that drives real results.",
      };
}

export default async function LocalizedWorkPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(resolveLocale(locale));

  return (
    <main style={{ paddingTop: "80px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 32px 0" }}>
        <span style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.25em", color: "#00D2FF", textTransform: "uppercase", marginBottom: "16px" }}>
          {dict.pages.work.kicker}
        </span>
        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "white", lineHeight: 1.05, marginBottom: "20px" }}>
          {dict.pages.work.titlePrefix}{" "}
          <span style={{ background: "linear-gradient(135deg, #00D2FF, #3a7bd5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {dict.pages.work.titleHighlight}
          </span>
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.38)", maxWidth: "480px", lineHeight: 1.7 }}>
          {dict.pages.work.description}
        </p>
      </div>

      <Services />
      <Vault />
      <PageCTAContact />
      <Footer />
    </main>
  );
}

