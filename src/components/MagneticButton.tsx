"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

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
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] && isLocale(segments[0]) ? segments[0] : DEFAULT_LOCALE;
  const resolvedHref = href.startsWith("/") ? `/${locale}${href}` : href;
  const ref = useRef<HTMLAnchorElement>(null);
  const x   = useMotionValue(0);
  const y   = useMotionValue(0);
  const xS  = useSpring(x, { stiffness: 220, damping: 24, mass: 0.9 });
  const yS  = useSpring(y, { stiffness: 220, damping: 24, mass: 0.9 });

  const handleMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    // Keep a subtle magnetic response to avoid exaggerated motion.
    x.set((e.clientX - r.left - r.width  / 2) * 0.12);
    y.set((e.clientY - r.top  - r.height / 2) * 0.12);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  const padding  = size === "lg" ? "18px 48px" : "14px 36px";
  const fontSize = size === "lg" ? "16px" : "14px";

  return (
    <motion.a
      ref={ref}
      href={resolvedHref}
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
        transition: "opacity 0.22s ease, border-color 0.22s ease, background 0.22s ease, color 0.22s ease",
        ...style,
      } as React.CSSProperties & { x: typeof xS; y: typeof yS }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        if (variant === "primary") {
          el.style.opacity = "0.92";
          el.style.filter = "saturate(1.04)";
        } else {
          el.style.borderColor = "rgba(255,255,255,0.24)";
          el.style.color = "white";
          el.style.background = "rgba(255,255,255,0.08)";
        }
      }}
      onMouseUp={handleLeave}
      onMouseDown={handleMove}
      onMouseOut={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        if (variant === "primary") {
          el.style.opacity = "1";
          el.style.filter = "saturate(1)";
        } else {
          el.style.borderColor = "rgba(255,255,255,0.14)";
          el.style.color = "rgba(255,255,255,0.8)";
          el.style.background = "rgba(255,255,255,0.04)";
        }
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
    >
      {children}
    </motion.a>
  );
}
