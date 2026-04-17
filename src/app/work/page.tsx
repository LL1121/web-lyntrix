import Services from "@/components/Services";
import Vault from "@/components/Vault";
import PageCTAContact from "@/components/PageCTAContact";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work — Lyntrix",
  description: "50+ projects shipped. AI solutions, high-fidelity web development and cloud architecture that drives real results.",
};

export default function WorkPage() {
  return (
    <main style={{ paddingTop: "80px" }}>
      {/* Page header */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "64px 32px 0",
        }}
      >
        <span style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.25em", color: "#00D2FF", textTransform: "uppercase", marginBottom: "16px" }}>
          Our capabilities
        </span>
        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "white",
            lineHeight: 1.05,
            marginBottom: "20px",
          }}
        >
          Built to perform.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Engineered to scale.
          </span>
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.38)", maxWidth: "480px", lineHeight: 1.7 }}>
          From AI pipelines to cloud architecture — every solution is built with one goal: compounding growth for your business.
        </p>
      </div>

      <Services />
      <Vault />
      <PageCTAContact />
      <Footer />
    </main>
  );
}
