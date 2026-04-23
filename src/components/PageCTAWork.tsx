"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";

const stats = [
  { value: 50,  suffix: "+",  label: "Projects Shipped" },
  { value: 340, suffix: "%",  label: "Avg Conversion Lift" },
  { value: 85,  suffix: "%",  label: "Faster Deployment" },
  { value: 4.9, suffix: "★",  label: "Client Satisfaction" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const isDecimal = value % 1 !== 0;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => {
        el.textContent = (isDecimal ? v.toFixed(1) : Math.floor(v).toString()) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

// Auto-scrolling project preview strip
const projects = [
  { name: "Neural Commerce", cat: "AI / E-Commerce" },
  { name: "CloudVault Pro",  cat: "Cloud / SaaS"    },
  { name: "Synthwave AI",    cat: "AI / Generative"  },
  { name: "FlowOps",         cat: "DevOps"           },
  { name: "DataPulse",       cat: "Analytics"        },
  { name: "QuantumShift",    cat: "Web / Platform"   },
];

export default function PageCTAWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ padding: "120px 0 140px", background: "#000" }}
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setMousePos({ x: e.clientX / r.width, y: e.clientY / r.height });
      }}
    >
      {/* Cursor-following radial glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(0,210,255,0.07) 0%, transparent 60%)`,
        }}
      />

      {/* Top separator */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(0,210,255,0.2), transparent)" }} />

      {/* Stats row */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
            marginBottom: "80px",
            maxWidth: "760px",
            margin: "0 auto 80px",
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              style={{
                padding: "28px 24px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2.4rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main CTA headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "24px", width: "100%", maxWidth: "760px", marginInline: "auto" }}
        >
          <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.25em", color: "#00D2FF", textTransform: "uppercase", display: "block", marginBottom: "20px" }}>
            The Work
          </span>
          <h2
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "white",
              marginBottom: "20px",
            }}
          >
            Engineering that{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ships.
            </span>
          </h2>
          <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.4)", maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.65 }}>
            Explore the full portfolio — products built for performance, designed for conversion.
          </p>
          <MagneticButton href="/work" size="lg">
            Explore our work
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>
        </motion.div>

        {/* Auto-scrolling project strip */}
        <div style={{ marginTop: "64px", overflow: "hidden", width: "100%", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear", repeatType: "loop" }}
            style={{ display: "flex", gap: "16px", width: "max-content", justifyContent: "center", marginInline: "auto" }}
          >
            {[...projects, ...projects, ...projects].map((p, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  padding: "16px 24px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.025)",
                  minWidth: "200px",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 600, color: "white", marginBottom: "4px" }}>{p.name}</div>
                <div style={{ fontSize: "11px", color: "rgba(0,210,255,0.6)" }}>{p.cat}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
