"use client";

import { motion } from "framer-motion";
import { Brain, Globe, Cloud, Zap, Code2, Shield } from "lucide-react";
import { useLocale } from "@/lib/use-locale";

export default function Services() {
  const locale = useLocale();
  const smallCards = locale === "es"
    ? [
        { icon: Globe, title: "Desarrollo Web", description: "Experiencias web de alta fidelidad. Performance obsesiva y ejecución pixel-perfect.", accent: "#3a7bd5" },
        { icon: Cloud, title: "Arquitectura Cloud", description: "Infraestructura escalable para mañana. AWS, GCP y más.", accent: "#00D2FF" },
        { icon: Code2, title: "Software a Medida", description: "Aplicaciones diseñadas desde cero para la lógica única de tu negocio.", accent: "#3a7bd5" },
        { icon: Zap, title: "Automatización", description: "Flujos end-to-end que eliminan fricción y aceleran el crecimiento.", accent: "#00D2FF" },
        { icon: Shield, title: "Seguridad y DevOps", description: "Despliegues robustos con excelencia CI/CD. Seguro y confiable a escala.", accent: "#3a7bd5" },
      ]
    : [
        { icon: Globe, title: "Web Development", description: "High-fidelity web experiences. Performance-obsessed, pixel-perfect execution.", accent: "#3a7bd5" },
        { icon: Cloud, title: "Cloud Architecture", description: "Scalable infrastructure for tomorrow. AWS, GCP and beyond.", accent: "#00D2FF" },
        { icon: Code2, title: "Custom Software", description: "Bespoke applications engineered from the ground up for your unique logic.", accent: "#3a7bd5" },
        { icon: Zap, title: "Automation", description: "End-to-end workflows that eliminate friction and accelerate growth.", accent: "#00D2FF" },
        { icon: Shield, title: "Security & DevOps", description: "Hardened deployments with CI/CD excellence. Secure and reliable at scale.", accent: "#3a7bd5" },
      ];
  return (
    <section id="services" style={{ position: "relative", padding: "96px 0" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "48px" }}
        >
          <span
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase" as const,
              color: "#00D2FF",
              marginBottom: "14px",
            }}
          >
            {locale === "es" ? "El Stack" : "The Stack"}
          </span>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "white",
              }}
            >
              {locale === "es" ? "Lo que" : "What we"}{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {locale === "es" ? "entregamos" : "deliver"}
              </span>
            </h2>
            <span
              style={{ fontSize: "13px", color: "rgba(255,255,255,0.22)" }}
              className="hidden md:block"
            >
              {locale === "es" ? "6 capacidades clave" : "6 core capabilities"}
            </span>
          </div>
        </motion.div>

        {/* ── Featured AI card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "16px",
            padding: "36px 40px",
            marginBottom: "16px",
            border: "1px solid rgba(0,210,255,0.18)",
            background:
              "linear-gradient(135deg, rgba(0,210,255,0.08) 0%, rgba(58,123,213,0.05) 60%, rgba(0,0,0,0) 100%)",
          }}
          className="group"
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              right: "-60px",
              top: "-60px",
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              background: "rgba(0,210,255,0.07)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Top row: icon + title + tags */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    flexShrink: 0,
                    padding: "12px",
                    borderRadius: "14px",
                    background: "rgba(0,210,255,0.1)",
                    border: "1px solid rgba(0,210,255,0.22)",
                  }}
                >
                  <Brain
                    style={{ width: "24px", height: "24px", color: "#00D2FF" }}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)", fontWeight: 700, color: "white" }}>
                  {locale === "es" ? "Inteligencia Artificial" : "Artificial Intelligence"}
                </h3>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["LLMs", "RAG", "MLOps", "Vision"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 500,
                      border: "1px solid rgba(0,210,255,0.22)",
                      color: "rgba(0,210,255,0.75)",
                      background: "rgba(0,210,255,0.07)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                marginTop: "20px",
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.5)",
                maxWidth: "680px",
              }}
            >
              {locale === "es"
                ? "LLMs personalizados, visión por computadora, pipelines RAG y automatización inteligente que convierten datos en ventaja competitiva. Desde entrenamiento de modelos hasta despliegue productivo."
                : "Custom LLMs, computer vision, RAG pipelines and intelligent automation that transform raw data into compounding business advantage. From model training to production deployment."}
            </p>
          </div>
        </motion.div>

        {/* ── Small cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "12px",
          }}
        >
          {smallCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.07,
                  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
                }}
                style={{
                  borderRadius: "14px",
                  padding: "24px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                  cursor: "default",
                  transition: "border-color 0.25s, background 0.25s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = `${card.accent}45`;
                  el.style.background = `${card.accent}09`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(255,255,255,0.07)";
                  el.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    padding: "10px",
                    borderRadius: "10px",
                    background: `${card.accent}14`,
                    border: `1px solid ${card.accent}28`,
                    marginBottom: "14px",
                  }}
                >
                  <Icon
                    style={{ width: "18px", height: "18px", color: card.accent }}
                    strokeWidth={1.5}
                  />
                </div>
                <h3
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "white",
                    marginBottom: "8px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.38)",
                  }}
                >
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
