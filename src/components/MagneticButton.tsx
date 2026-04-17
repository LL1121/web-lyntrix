"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  style?: React.CSSProperties;
}

export default function MagneticButton({
  href,
  children,
  variant = "primary",
  size = "md",
  style,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x   = useMotionValue(0);
  const y   = useMotionValue(0);
  const xS  = useSpring(x, { stiffness: 180, damping: 14, mass: 0.6 });
  const yS  = useSpring(y, { stiffness: 180, damping: 14, mass: 0.6 });

  const handleMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left - r.width  / 2) * 0.32);
    y.set((e.clientY - r.top  - r.height / 2) * 0.32);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  const padding  = size === "lg" ? "18px 48px" : "14px 36px";
  const fontSize = size === "lg" ? "16px" : "14px";

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding,
        borderRadius: "999px",
        fontSize,
        fontWeight: 600,
        textDecoration: "none",
        cursor: "pointer",
        x: xS,
        y: yS,
        ...(variant === "primary"
          ? { background: "linear-gradient(135deg, #00D2FF, #3a7bd5)", color: "white" }
          : { border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.04)" }),
        ...style,
      } as React.CSSProperties & { x: typeof xS; y: typeof yS }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        if (variant === "primary") {
          el.style.boxShadow = "0 0 55px rgba(0,210,255,0.45), 0 0 22px rgba(58,123,213,0.3)";
        } else {
          el.style.borderColor = "rgba(0,210,255,0.4)";
          el.style.color = "white";
        }
      }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.a>
  );
}
