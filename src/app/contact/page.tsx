import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a Project — Lyntrix",
  description: "Ready to build something extraordinary? Drop us a signal. Limited availability — 2 project slots for Q3 2025.",
};

export default function ContactPage() {
  return (
    <main style={{ paddingTop: "80px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Page header */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "64px 32px 0",
          textAlign: "center",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.25em", color: "#00D2FF", textTransform: "uppercase", marginBottom: "20px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D2FF", display: "inline-block", animation: "pulse 2s infinite" }} />
          Now taking projects
        </span>
        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "white",
            lineHeight: 1.05,
            marginBottom: "16px",
          }}
        >
          Let&apos;s build{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            the impossible.
          </span>
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.38)", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
          2 project slots remaining for Q3 2025. Tell us what you&apos;re building and we&apos;ll respond within 48 hours.
        </p>
      </div>

      <Contact />
      <div style={{ flex: 1 }} />
      <Footer />
    </main>
  );
}
