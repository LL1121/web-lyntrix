"use client";

import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useDictionary } from "@/lib/use-locale";
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.75l7.733-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.95 1.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8z" />
  </svg>
);

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.13h-3.2v12.58a2.87 2.87 0 1 1-1.98-2.73V9.12a6.08 6.08 0 1 0 5.19 6.02V8.76a8.06 8.06 0 0 0 4.7 1.5V6.69h-.94z" />
  </svg>
);

const socials: { label: string; icon: () => React.JSX.Element; href: string }[] = [
  { label: "X", icon: XIcon, href: "#" },
  { label: "LinkedIn", icon: LinkedinIcon, href: "#" },
  { label: "GitHub", icon: GithubIcon, href: "#" },
  { label: "Instagram", icon: InstagramIcon, href: "#" },
  { label: "TikTok", icon: TiktokIcon, href: "#" },
];

export default function Footer() {
  const dict = useDictionary();
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const revealY = useSpring(useTransform(scrollYProgress, [0, 1], [68, -8]), {
    stiffness: 90,
    damping: 24,
    mass: 0.9,
  });
  const revealOpacity = useSpring(useTransform(scrollYProgress, [0, 0.55, 1], [0, 0.82, 1]), {
    stiffness: 95,
    damping: 26,
    mass: 0.9,
  });
  const revealScale = useSpring(useTransform(scrollYProgress, [0, 1], [0.985, 1]), {
    stiffness: 100,
    damping: 28,
    mass: 0.9,
  });

  return (
    <motion.footer
      ref={footerRef}
      className="relative"
      style={{
        marginTop: "56px",
        padding: "56px 0 12px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0.004) 28%, transparent 100%)",
        y: revealY,
        opacity: revealOpacity,
        scale: revealScale,
        transformOrigin: "center bottom",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(980px, 86vw)",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(0,210,255,0.34), rgba(58,123,213,0.34), transparent)",
          pointerEvents: "none",
        }}
      />
      <div
        className="mx-auto w-full max-w-none"
        style={{ padding: "30px clamp(22px, 4vw, 56px) 0" }}
      >
          <div
            className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: "14px",
            }}
          >
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Lyntrix"
                style={{
                  height: "28px",
                  width: "auto",
                  display: "block",
                  filter: "invert(1) hue-rotate(180deg)",
                }}
              />
              <p
                style={{
                  marginTop: "12px",
                  maxWidth: "520px",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.42)",
                }}
              >
                {dict.footer.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {socials.map(({ label, icon: Icon, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300"
                  style={{
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.03)",
                    color: "rgba(255,255,255,0.52)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "white";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,210,255,0.45)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,210,255,0.10)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.52)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.14)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          <div
            className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            style={{ marginTop: "18px" }}
          >
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[dict.footer.privacy, dict.footer.terms, dict.footer.cookies].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xs transition-colors duration-300 hover:text-white/75"
                  style={{ color: "rgba(255,255,255,0.34)" }}
                >
                  {item}
                </a>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "12px",
                color: "rgba(255,255,255,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              <span>© {year} Lyntrix</span>
              <span style={{ opacity: 0.35 }}>•</span>
              <span>{dict.footer.crafted}</span>
            </div>
          </div>
      </div>
    </motion.footer>
  );
}
