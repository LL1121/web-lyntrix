"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLenisInstance } from "@/lib/lenis-context";

const projects = [
  {
    title: "Neural Commerce",
    category: "AI / E-Commerce",
    description:
      "AI-powered recommendation engine that increased conversion by 340% for a leading retail platform.",
    gradient: "linear-gradient(135deg, #0c1445 0%, #1a0a2e 50%, #0d1b3e 100%)",
    accent: "#00D2FF",
    year: "2025",
  },
  {
    title: "CloudVault Pro",
    category: "Cloud / SaaS",
    description:
      "Enterprise cloud management dashboard serving 50k+ users with real-time infrastructure monitoring.",
    gradient: "linear-gradient(135deg, #0a192f 0%, #112240 50%, #0a1628 100%)",
    accent: "#3a7bd5",
    year: "2025",
  },
  {
    title: "Synthwave AI",
    category: "AI / Generative",
    description:
      "Generative AI platform for creating production-ready marketing assets in seconds.",
    gradient: "linear-gradient(135deg, #1a0533 0%, #0d1b3e 50%, #150a2e 100%)",
    accent: "#00D2FF",
    year: "2024",
  },
  {
    title: "FlowOps",
    category: "Automation / DevOps",
    description:
      "Intelligent CI/CD orchestration platform that reduced deployment time by 85% across 200+ microservices.",
    gradient: "linear-gradient(135deg, #001a1a 0%, #0a2530 50%, #051520 100%)",
    accent: "#3a7bd5",
    year: "2024",
  },
];

const CARD_WIDTH = 420;
const CARD_GAP = 20;
const SIDE_PADDING = 64;

export default function Vault() {
  const { lenis } = useLenisInstance();
  const sectionRef = useRef<HTMLDivElement>(null);

  // ── All scroll-logic state in refs (no stale closures) ─────────────────
  const isLockedRef      = useRef(false);   // currently locked to horizontal
  const isExperiencedRef = useRef(false);   // user scrolled through all cards already
  const brakeTargetRef   = useRef<number | null>(null); // target Y for smooth braking
  const offsetRef        = useRef(0);
  const maxOffsetRef     = useRef(0);

  // UI state (for rendering only)
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);

  const x       = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 140, damping: 30, mass: 1.1 });

  // ── Max offset calculation ──────────────────────────────────────────────
  useEffect(() => {
    const calc = () => {
      const total = projects.length * CARD_WIDTH + (projects.length - 1) * CARD_GAP + SIDE_PADDING * 2;
      maxOffsetRef.current = Math.max(0, total - window.innerWidth);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // ── Reset carousel when section leaves viewport completely ─────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        // Reset everything when section leaves viewport
        offsetRef.current = 0;
        x.set(0);
        setProgress(0);
        isExperiencedRef.current = false;
        brakeTargetRef.current = null;
        if (isLockedRef.current) {
          lenis?.start();
          isLockedRef.current = false;
          setIsActive(false);
        }
      }
    }, { threshold: 0 });
    obs.observe(section);
    return () => obs.disconnect();
  }, [lenis, x]);

  // ── Master wheel handler ────────────────────────────────────────────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const scrollingDown = e.deltaY > 0;

      // ── If already experienced, upscroll passes freely ──────────────────
      // (Only allow re-locking if scrolled away entirely — handled by IntersectionObserver)
      if (isExperiencedRef.current) return;

      const rect = section.getBoundingClientRect();
      const vh   = window.innerHeight;

      // Is section completely outside viewport?
      if (rect.bottom < 0 || rect.top > vh) return;

      const sectionCenterViewport = rect.top + rect.height / 2;
      const viewportCenter        = vh / 2;

      // ── LOCKED: horizontal scroll active ────────────────────────────────
      if (isLockedRef.current) {
        e.preventDefault();
        e.stopPropagation();

        const max     = maxOffsetRef.current;
        const current = offsetRef.current;

        // At start + scrolling up → release WITHOUT marking experienced
        if (!scrollingDown && current >= 0) {
          lenis?.start();
          isLockedRef.current = false;
          setIsActive(false);
          brakeTargetRef.current = null;
          return;
        }

        // At end + scrolling down → mark experienced, release
        if (scrollingDown && current <= -max) {
          lenis?.start();
          isLockedRef.current = false;
          isExperiencedRef.current = true;
          setIsActive(false);
          return;
        }

        // Horizontal scroll — 0.35x for deliberate, cinematic feel
        const next = Math.max(-max, Math.min(0, current - e.deltaY * 0.35));
        offsetRef.current = next;
        x.set(next);
        setProgress(Math.abs(next) / max);
        return;
      }

      // ── Only engage on downward scroll ──────────────────────────────────
      if (!scrollingDown) return;

      // ── LOCK ZONE: section center at viewport center (±55px) ────────────
      const atCenter = Math.abs(sectionCenterViewport - viewportCenter) <= 55;
      if (atCenter) {
        e.preventDefault();
        lenis?.stop();
        isLockedRef.current = true;
        brakeTargetRef.current = null;
        setIsActive(true);
        return;
      }

      // ── APPROACH ZONE: section entering from below, not yet centered ─────
      // Section is partially visible from below (top > 0, approaching center)
      const isApproaching = rect.top < vh && sectionCenterViewport > viewportCenter + 55;
      if (isApproaching) {
        // Braking multiplier: 1.0 (just entering) → 0.08 (just before lock)
        // Distance from lock: sectionCenter - viewportCenter - 55
        const distToLock  = sectionCenterViewport - viewportCenter - 55;
        // Scale distance: 0 = at lock edge, ~300 = far away
        const normalised  = Math.min(1, distToLock / 280);
        // Ease so it feels like a smooth deceleration
        const brake       = 0.08 + normalised * 0.92;

        e.preventDefault();
        e.stopPropagation();

        // Drive Lenis to scroll a reduced amount
        const reducedDelta = e.deltaY * brake;
        const currentY     = window.scrollY;
        lenis?.scrollTo(currentY + reducedDelta, { immediate: true });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [lenis, x]);

  // Touch support
  const touchStartY = useRef(0);
  useEffect(() => {
    const onStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onMove  = (e: TouchEvent) => {
      if (!isLockedRef.current) return;
      const dy  = touchStartY.current - e.touches[0].clientY;
      const max = maxOffsetRef.current;
      const next = Math.max(-max, Math.min(0, offsetRef.current - dy * 0.5));
      offsetRef.current = next;
      x.set(next);
      setProgress(Math.abs(next) / max);
      touchStartY.current = e.touches[0].clientY;
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
    };
  }, [x]);

  return (
    <section id="work" style={{ position: "relative", padding: "96px 0" }}>
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

      {/* Header */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", marginBottom: "48px" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}
        >
          <div>
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
              The Vault
            </span>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "white",
              }}
            >
              Selected{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                work
              </span>
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "2px",
                      borderRadius: "1px",
                      background: "rgba(255,255,255,0.1)",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      style={{
                        height: "100%",
                        background: "linear-gradient(to right, #00D2FF, #3a7bd5)",
                        borderRadius: "1px",
                        scaleX: progress,
                        transformOrigin: "left",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                    {Math.round(progress * 100)}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.25)" }} className="hidden md:block">
              {isActive ? "Scrolling horizontally" : "Scroll to explore →"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Cards track — pinned section for hijacking */}
      <div
        ref={sectionRef}
        style={{
          overflow: "hidden",
          paddingBottom: "8px",
        }}
      >
        <motion.div
          style={{
            x: xSpring,
            display: "flex",
            gap: `${CARD_GAP}px`,
            paddingLeft: `${SIDE_PADDING}px`,
            paddingRight: `${SIDE_PADDING}px`,
            width: "max-content",
          }}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
              }}
              className="group"
              style={{
                width: `${CARD_WIDTH}px`,
                flexShrink: 0,
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                transition: "border-color 0.3s",
              }}
              whileHover={{ borderColor: "rgba(0,210,255,0.34)", y: -8, scale: 1.015 } as never}
              onClick={() => setSelectedProject(project)}
            >
              {/* Image area */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/9",
                  background: project.gradient,
                  overflow: "hidden",
                }}
              >
                {/* Grid pattern */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                  }}
                />
                {/* Glow */}
                <motion.div
                  style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: `${project.accent}35`,
                    filter: "blur(32px)",
                  }}
                  whileHover={{ scale: 1.5, opacity: 0.95 }}
                />
                {/* Bottom fade */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                  }}
                />
                {/* Arrow button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(8px)",
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ArrowUpRight style={{ width: "16px", height: "16px", color: "white" }} />
                </motion.div>
              </div>

              {/* Card body */}
              <div
                style={{
                  padding: "20px 24px 24px",
                  background: "rgba(255,255,255,0.015)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 500,
                      border: `1px solid ${project.accent}35`,
                      color: `${project.accent}90`,
                      background: `${project.accent}0A`,
                    }}
                  >
                    {project.category}
                  </span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
                    {project.year}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "white",
                    letterSpacing: "-0.01em",
                    marginBottom: "8px",
                  }}
                >
                  {project.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Activation hint */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: "fixed",
              bottom: "32px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
              padding: "10px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(0,210,255,0.25)",
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(16px)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "11px", color: "rgba(0,210,255,0.8)", fontWeight: 500, letterSpacing: "0.05em" }}>
              ← Scroll to navigate projects →
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 250,
              background: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(10px)",
              display: "grid",
              placeItems: "center",
              padding: "24px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(880px, 100%)",
                borderRadius: "18px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(8,8,10,0.95)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/8",
                  background: selectedProject.gradient,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "45%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    background: `${selectedProject.accent}45`,
                    filter: "blur(36px)",
                  }}
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "white",
                    background: "rgba(0,0,0,0.35)",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ padding: "26px 28px 30px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      border: `1px solid ${selectedProject.accent}44`,
                      color: `${selectedProject.accent}cc`,
                      background: `${selectedProject.accent}14`,
                    }}
                  >
                    {selectedProject.category}
                  </span>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{selectedProject.year}</span>
                </div>
                <h3 style={{ fontSize: "30px", color: "white", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "10px" }}>
                  {selectedProject.title}
                </h3>
                <p style={{ fontSize: "15px", lineHeight: 1.75, color: "rgba(255,255,255,0.46)", marginBottom: "24px" }}>
                  {selectedProject.description}
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a
                    href="/contact"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 18px",
                      borderRadius: "999px",
                      background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
                      color: "white",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Start similar project
                  </a>
                  <a
                    href="/contact"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 18px",
                      borderRadius: "999px",
                      border: "1px solid rgba(255,255,255,0.16)",
                      color: "rgba(255,255,255,0.86)",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Request case study
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
