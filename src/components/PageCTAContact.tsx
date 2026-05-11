"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import { useDictionary } from "@/lib/use-locale";

export default function PageCTAContact() {
  const dict = useDictionary();
  const trustBadges = dict.pageCtaContact.badges;
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: "120px 0 140px", background: "#000" }}
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setMousePos({ x: e.clientX / r.width, y: e.clientY / r.height });
      }}
    >
      {/* Cursor-following glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-200"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(58,123,213,0.1) 0%, transparent 60%)`,
        }}
      />

      {/* Top separator with glow */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(58,123,213,0.3), rgba(0,210,255,0.3), rgba(58,123,213,0.3), transparent)" }} />

      <div className="mx-auto max-w-5xl px-6 lg:px-8" style={{ textAlign: "center" }}>
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.0,
            color: "white",
            marginBottom: "24px",
          }}
        >
          {dict.pageCtaContact.titleTop}
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {dict.pageCtaContact.titleBottom}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.42)",
            maxWidth: "560px",
            margin: "0 auto 48px",
            lineHeight: 1.7,
          }}
        >
          {dict.pageCtaContact.description}
        </motion.p>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: "56px", marginTop: "-12px" }}
        >
          <MagneticButton href="/contact" size="lg">
            {dict.pageCtaContact.cta}
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px" }}
        >
          {trustBadges.map((badge) => (
            <span
              key={badge}
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 500,
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.35)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              ✓ {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
