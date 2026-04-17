"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLogoRef } from "@/lib/logo-refs";

const navLinks = [
  { label: "Vision",   href: "#vision"   },
  { label: "Services", href: "#services" },
  { label: "Work",     href: "#work"     },
  { label: "Contact",  href: "#contact"  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome   = pathname === "/";
  const { scrollY } = useScroll();

  // ── Scroll thresholds (home only — on inner pages navbar is always visible) ──
  const APPEAR_START = 80;
  const APPEAR_END   = 200;

  const containerOpacity = useTransform(scrollY, [APPEAR_START, APPEAR_END], [0, 1]);
  const containerBlur    = useTransform(scrollY, [APPEAR_START, APPEAR_END], [8, 0]);
  const containerY       = useTransform(scrollY, [APPEAR_START, APPEAR_END], [-16, 0]);
  const springY          = useSpring(containerY, { stiffness: 160, damping: 26 });
  const blurFilter       = useTransform(containerBlur, (v) => `blur(${v}px)`);

  // For inner pages: override with static values
  const navOpacity = isHome ? containerOpacity : 1;
  const navY       = isHome ? springY          : 0;
  const navFilter  = isHome ? blurFilter       : "blur(0px)";

  // Glass background intensifies as user scrolls deeper
  const glassBg = useTransform(
    scrollY,
    [APPEAR_END, APPEAR_END + 200],
    ["rgba(0,0,0,0.45)", "rgba(0,0,0,0.82)"]
  );
  const glassBorder = useTransform(
    scrollY,
    [APPEAR_END, APPEAR_END + 150],
    ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.1)"]
  );

  const LINKS_START = APPEAR_START + 20;
  const CTA_START   = APPEAR_START + 40;

  // Scroll-based stagger values (used on home page only)
  const scrollLogoOp    = useTransform(scrollY, [275, 338], [0, 1]);
  const scrollLogoScale = useTransform(scrollY, [275, 338], [0.85, 1]);
  const scrollLinksOp   = useTransform(scrollY, [LINKS_START, LINKS_START + 80], [0, 1]);
  const scrollLinksY    = useTransform(scrollY, [LINKS_START, LINKS_START + 80], [6, 0]);
  const scrollCtaOp     = useTransform(scrollY, [CTA_START,   CTA_START   + 80], [0, 1]);
  const scrollCtaY      = useTransform(scrollY, [CTA_START,   CTA_START   + 80], [6, 0]);

  // On inner pages all elements are immediately visible
  const logoOp    = isHome ? scrollLogoOp    : 1;
  const logoScale = isHome ? scrollLogoScale : 1;
  const linksOp   = isHome ? scrollLinksOp   : 1;
  const linksY    = isHome ? scrollLinksY    : 0;
  const ctaOp     = isHome ? scrollCtaOp     : 1;
  const ctaY      = isHome ? scrollCtaY      : 0;

  return (
    <>
      {/* ── Desktop floating navbar ── */}
      <motion.div
        className="hidden md:block"
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          x: "-50%",
          zIndex: 50,
          width: "calc(100% - 48px)",
          maxWidth: "1100px",
          opacity: navOpacity,
          y: navY,
          filter: navFilter,
        }}
      >
        <motion.nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px 10px 20px",
            borderRadius: "16px",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            background: glassBg,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
            border: `1px solid`,
            borderColor: glassBorder,
          }}
        >
          {/* Logo — crystallizes from particles at scrollY ~270–340 */}
          <motion.a
            href="#"
            ref={navLogoRef}
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              opacity: logoOp,
              scale: logoScale,
              transformOrigin: "left center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Lyntrix"
              style={{
                height: "26px",
                width: "auto",
                display: "block",
                filter: "invert(1) hue-rotate(180deg)",
              }}
            />
          </motion.a>

          {/* Links — centered */}
          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: linksOp,
              y: linksY,
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: "7px 14px",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "white";
                  el.style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "rgba(255,255,255,0.5)";
                  el.style.background = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.a
            href="#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "9px 20px",
              borderRadius: "10px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: "white",
              textDecoration: "none",
              background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
              flexShrink: 0,
              opacity: ctaOp,
              y: ctaY,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 24px rgba(0,210,255,0.4)";
              (e.currentTarget as HTMLAnchorElement).style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
            }}
          >
            Start a project
          </motion.a>
        </motion.nav>
      </motion.div>

      {/* ── Mobile navbar ── */}
      <motion.div
        className="md:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          opacity: navOpacity,
          y: navY,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <a href="#" style={{ textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Lyntrix"
              style={{ height: "22px", width: "auto", filter: "invert(1) hue-rotate(180deg)" }}
            />
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              width: "38px", height: "38px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <X style={{ width: "18px", height: "18px", color: "white" }} />
              : <Menu style={{ width: "18px", height: "18px", color: "white" }} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              style={{
                overflow: "hidden",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(0,0,0,0.95)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px 16px 20px" }}>
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.65)",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    marginTop: "8px",
                    padding: "13px 20px",
                    borderRadius: "11px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "white",
                    textDecoration: "none",
                    background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
                    display: "inline-block",
                    width: "fit-content",
                  }}
                >
                  Start a project
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
