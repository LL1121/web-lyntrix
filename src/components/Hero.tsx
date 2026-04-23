"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { heroLogoRef } from "@/lib/logo-refs";

const letterAnimation = {
  hidden: { opacity: 0, y: 34, rotateX: -50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.34,
      delay: i * 0.018,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const futureAnimation = {
  hidden: { opacity: 0, y: 24, rotateX: -35, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      delay: 0.14 + i * 0.022,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const LOGO_LETTER_INDEX = 6; // "L" in "We build the"

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollY } = useScroll();
  const heroLogoOpacity = useTransform(scrollY, [20, 85], [1, 0]);
  const headlineTop = "We build the";
  const headlineBottom = "future.";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${p.opacity})`;
        ctx.fill();
      });

      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0, 210, 255, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40" />
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(0,210,255,0.07) 0%, rgba(58,123,213,0.04) 60%, transparent 100%)",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 14, scale: 1.02, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: "auto" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, delay: 0.1 }}
          className="mb-6"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wider uppercase backdrop-blur-sm"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: "#00D2FF" }}
            />
            AI-Powered Solutions
          </span>
        </motion.div>

        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
          <span className="block overflow-hidden" style={{ perspective: "1000px" }}>
            {headlineTop.split("").map((char, i) => {
              if (i === LOGO_LETTER_INDEX) {
                return (
                  <motion.span
                    key={`top-${i}`}
                    custom={i}
                    variants={letterAnimation}
                    initial="hidden"
                    animate="visible"
                    style={{ display: "inline-block", transformOrigin: "bottom", opacity: heroLogoOpacity }}
                  >
                    <motion.span
                      ref={heroLogoRef}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "0.74em",
                        minHeight: "0.74em",
                        lineHeight: 0,
                        verticalAlign: "0em",
                        marginLeft: "0.05em",
                        marginRight: "0.05em",
                      }}
                      initial={false}
                      animate={{
                        scale: [0.95, 1.06, 1],
                        filter: [
                          "drop-shadow(0 0 0px rgba(0,210,255,0))",
                          "drop-shadow(0 0 20px rgba(0,210,255,0.55))",
                          "drop-shadow(0 0 0px rgba(0,210,255,0))",
                        ],
                      }}
                      transition={{ duration: 0.34, delay: 0.02, ease: "easeOut" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/logo-l.png"
                        alt="L"
                        style={{
                          height: "0.72em",
                          width: "auto",
                          display: "block",
                          opacity: 1,
                          filter: "invert(1) hue-rotate(180deg)",
                        }}
                      />
                    </motion.span>
                  </motion.span>
                );
              }

              return (
                <motion.span
                  key={`top-${i}`}
                  custom={i}
                  variants={letterAnimation}
                  initial="hidden"
                  animate="visible"
                  className="inline-block text-white"
                  style={{ transformOrigin: "bottom" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              );
            })}
          </span>

          <span className="mt-2 block overflow-hidden" style={{ perspective: "1000px" }}>
            {headlineBottom.split("").map((char, i) => (
              <motion.span
                key={`bottom-${i}`}
                custom={i}
                variants={futureAnimation}
                initial="hidden"
                animate="visible"
                className="inline-block"
                style={{
                  transformOrigin: "bottom",
                  background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.28 }}
          className="mt-8 max-w-lg text-base leading-relaxed sm:text-lg"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Technology studio crafting next-gen web experiences, AI integrations & scalable cloud
          architecture.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-24 flex flex-col items-center gap-4 sm:flex-row"
          style={{ marginTop: "30px" }}
        >
          <a
            href="/work"
            className="hover:opacity-95"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 36px",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 600,
              color: "white",
              textDecoration: "none",
              background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
              transition: "opacity 0.25s ease, filter 0.25s ease",
              flexShrink: 0,
              filter: "saturate(1)",
            }}
          >
            Let&apos;s talk
          </a>

          <a
            href="/work"
            className="hover:text-white"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              transition: "border-color 0.25s ease, color 0.25s ease, background 0.25s ease",
              flexShrink: 0,
              background: "rgba(255,255,255,0.01)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "rgba(255,255,255,0.2)";
              el.style.color = "white";
              el.style.background = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "rgba(255,255,255,0.12)";
              el.style.color = "rgba(255,255,255,0.65)";
              el.style.background = "rgba(255,255,255,0.01)";
            }}
          >
            View our work
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-medium tracking-[0.3em] text-white/20 uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="h-8 w-px bg-linear-to-b from-white/20 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
