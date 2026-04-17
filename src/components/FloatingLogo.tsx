"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { heroLogoRef, navLogoRef } from "@/lib/logo-refs";

// A subtle crossfade bridge: the hero logo-l fades out while a floating
// clone moves gently toward the navbar, handing off to the full wordmark.
// Keeps the visual connection without a complex flying animation.

const TRAVEL = 200;

interface Rect { x: number; y: number; w: number; h: number }

export default function FloatingLogo() {
  const [from, setFrom] = useState<Rect | null>(null);
  const [to,   setTo]   = useState<Rect | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const measure = () => {
      const heroEl = heroLogoRef.current;
      const navEl  = navLogoRef.current;
      if (!heroEl || !navEl) return;
      const h = heroEl.getBoundingClientRect();
      const n = navEl.getBoundingClientRect();
      setFrom({ x: h.left, y: h.top, w: h.width,  h: h.height  });
      setTo  ({ x: n.left, y: n.top, w: n.width,   h: n.height  });
    };
    const t1 = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 900);
    window.addEventListener("resize", measure);
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener("resize", measure); };
  }, []);

  const sf = from ?? { x: 0, y: 0, w: 0, h: 0 };
  const st = to   ?? { x: 0, y: 0, w: 0, h: 0 };

  const rawX = useTransform(scrollY, [0, TRAVEL], [sf.x, st.x]);
  const rawY = useTransform(scrollY, [0, TRAVEL], [sf.y, st.y]);
  const rawW = useTransform(scrollY, [0, TRAVEL], [sf.w, st.w]);
  const rawH = useTransform(scrollY, [0, TRAVEL], [sf.h, st.h]);

  const cfg  = { stiffness: 130, damping: 24 };
  const x    = useSpring(rawX, cfg);
  const y    = useSpring(rawY, cfg);
  const w    = useSpring(rawW, cfg);
  const h    = useSpring(rawH, cfg);

  // Fade in quickly → travel → hand off cleanly to navbar logo
  const opacity = useTransform(scrollY, [0, 14, TRAVEL - 30, TRAVEL + 10], [0, 1, 1, 0]);

  if (!from || !to) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x, y, width: w, height: h,
        pointerEvents: "none",
        zIndex: 200,
        opacity,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-l.png"
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: "invert(1) hue-rotate(180deg)",
          display: "block",
        }}
      />
    </motion.div>
  );
}
