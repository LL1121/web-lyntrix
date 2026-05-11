"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useDictionary } from "@/lib/use-locale";

function AnimatedLine({
  text,
  bold,
  range,
  progress,
  isLast,
}: {
  text: string;
  bold: boolean;
  range: [number, number];
  progress: MotionValue<number>;
  isLast: boolean;
}) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  const y = useTransform(progress, range, [10, 0]);

  return (
    <motion.p
      style={{
        opacity,
        y,
        fontWeight: bold ? 600 : 400,
        color: bold ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.78)",
        fontSize: "1.125rem",
        lineHeight: 1.7,
        marginBottom: isLast ? 0 : "1.5rem",
      }}
    >
      {text}
    </motion.p>
  );
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.15"],
  });
  const dict = useDictionary();
  const lines = dict.manifesto.lines;

  return (
    <section id="vision" ref={sectionRef} style={{ position: "relative", padding: "96px 0" }}>
      {/* Separator */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
        }}
      />

      <div
        ref={contentRef}
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        {/* Mobile: stacked, Desktop: two-col */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "48px",
          }}
          className="manifesto-grid"
        >
          {/* Left column */}
          <div>
            <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#00D2FF",
                marginBottom: "20px",
              }}
            >
              {dict.manifesto.kicker}
            </span>
            <h2
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: "white",
                marginBottom: "24px",
              }}
            >
              {dict.manifesto.titleTop}
              <br />
              {dict.manifesto.titleBottom}
            </h2>
            <div
              style={{
                width: "48px",
                height: "2px",
                background: "linear-gradient(to right, #00D2FF, transparent)",
                marginBottom: "20px",
                borderRadius: "1px",
              }}
            />
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.35)",
                maxWidth: "280px",
              }}
            >
              {dict.manifesto.sideCopy}
            </p>
          </div>

          {/* Right column — animated text */}
          <div
            style={{
              position: "relative",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              paddingLeft: "clamp(24px, 4vw, 48px)",
            }}
          >
            {/* Glowing dot */}
            <div
              style={{
                position: "absolute",
                left: "-5px",
                top: "4px",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#00D2FF",
                boxShadow: "0 0 14px #00D2FF, 0 0 6px #00D2FF",
              }}
            />

            {lines.map((line, i) => (
              <AnimatedLine
                key={i}
                text={line.text}
                bold={line.bold}
                range={[i / lines.length, (i + 1) / lines.length]}
                progress={scrollYProgress}
                isLast={i === lines.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Responsive grid CSS */}
      <style>{`
        @media (min-width: 900px) {
          .manifesto-grid {
            grid-template-columns: 260px 1fr !important;
            gap: 64px !important;
          }
        }
      `}</style>
    </section>
  );
}
