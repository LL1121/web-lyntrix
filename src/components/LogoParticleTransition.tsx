"use client";

import { useEffect, useRef, useState } from "react";
import { heroLogoRef, navLogoRef } from "@/lib/logo-refs";

// ── Scroll thresholds ───────────────────────────────────────────────────────
const DISINT_START  = 20;   // particles begin to emerge
const DISINT_END    = 88;   // disintegration complete — stream begins
const STREAM_END    = 210;  // stream arrives near navbar
const CONVERGE_END  = 278;  // particles converge to exact position
const FADE_END      = 318;  // particles dissolve — wordmark is crystallized

const PARTICLE_COUNT = 48;

// ── Math helpers ────────────────────────────────────────────────────────────
const clamp   = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp    = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - (1 - t) ** 2.2;
const easeIn  = (t: number) => t ** 2;
const easeIO  = (t: number) => t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
const bezier  = (p0: number, p1: number, p2: number, t: number) =>
  (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t * t * p2;

interface Particle {
  relX: number;          // 0–1 within logo image
  relY: number;
  burstAngle: number;    // direction of initial burst
  burstDist:  number;    // max burst spread px
  waveFreq:   number;    // stream oscillation frequency
  waveAmp:    number;    // stream oscillation amplitude
  ctrlOffX:   number;    // bezier mid-point X offset for unique stream path
  ctrlOffY:   number;    // bezier mid-point Y offset
  size:       number;    // dot radius
  delay:      number;    // 0–1 individual stagger within stream
}

interface CachedRect {
  left: number; top: number; w: number; h: number;
}

export default function LogoParticleTransition() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const particles  = useRef<Particle[]>([]);
  const heroRect0  = useRef<CachedRect | null>(null);  // measured at scrollY=0
  const navRect0   = useRef<CachedRect | null>(null);  // fixed element
  const rafId      = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  // ── Setup: sample logo pixels + measure element positions ─────────────────
  useEffect(() => {
    const init = async () => {
      // Wait for fonts / layout to settle
      await new Promise((r) => setTimeout(r, 700));

      const heroEl = heroLogoRef.current;
      const navEl  = navLogoRef.current;
      if (!heroEl || !navEl) return;

      const hr = heroEl.getBoundingClientRect();
      const nr = navEl.getBoundingClientRect();

      // Store hero position compensated for current scroll
      heroRect0.current = {
        left: hr.left,
        top:  hr.top + window.scrollY,  // absolute page position
        w:    hr.width,
        h:    hr.height,
      };
      // Nav is position:fixed — viewport coords are stable
      navRect0.current = { left: nr.left, top: nr.top, w: nr.width, h: nr.height };

      // ── Sample logo-l.png pixels to get organic particle spawn points ──
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload  = () => res(i);
        i.onerror = rej;
        i.src = "/logo-l.png";
      });

      const SW = 80, SH = Math.round(80 * (img.height / img.width));
      const oc = document.createElement("canvas");
      oc.width = SW; oc.height = SH;
      const oct = oc.getContext("2d")!;
      oct.drawImage(img, 0, 0, SW, SH);
      const { data } = oct.getImageData(0, 0, SW, SH);

      // Collect non-white pixels (logo content)
      const pts: { rx: number; ry: number }[] = [];
      for (let y = 0; y < SH; y += 2) {
        for (let x = 0; x < SW; x += 2) {
          const idx = (y * SW + x) * 4;
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          if (r > 230 && g > 230 && b > 230) continue; // skip white bg
          pts.push({ rx: x / SW, ry: y / SH });
        }
      }

      // Subsample to desired particle count for performance
      const stride = Math.max(1, Math.floor(pts.length / PARTICLE_COUNT));
      const sel = pts.filter((_, i) => i % stride === 0).slice(0, PARTICLE_COUNT);

      particles.current = sel.map((p, i) => ({
        relX:      p.rx,
        relY:      p.ry,
        burstAngle: (i / sel.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.6,
        burstDist:  14 + Math.random() * 20,
        waveFreq:   1.4 + Math.random() * 1.6,
        waveAmp:    7   + Math.random() * 14,
        ctrlOffX:   (Math.random() - 0.5) * 70,
        ctrlOffY:   -(15 + Math.random() * 45),
        size:       1.6 + Math.random() * 1.8,
        delay:      Math.random() * 0.18,
      }));

      setReady(true);
    };

    init();
  }, []);

  // ── RAF animation loop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t0: number | null = null;

    const loop = (ts: number) => {
      if (!t0) t0 = ts;
      const elapsed = (ts - t0) / 1000;
      const sy = window.scrollY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Use LIVE getBoundingClientRect for hero (moves as page scrolls)
      // so particles always originate from the actual logo position on screen
      const heroEl = heroLogoRef.current;
      const navEl  = navLogoRef.current;
      const nr = navRect0.current;

      if (!heroEl || !navEl || !nr || sy < DISINT_START - 2 || sy > FADE_END + 20) {
        rafId.current = requestAnimationFrame(loop);
        return;
      }

      const liveHR = heroEl.getBoundingClientRect();

      // Phase progress (0→1)
      const pD = clamp((sy - DISINT_START)  / (DISINT_END   - DISINT_START),  0, 1);
      const pS = clamp((sy - DISINT_END)    / (STREAM_END   - DISINT_END),    0, 1);
      const pC = clamp((sy - STREAM_END)    / (CONVERGE_END - STREAM_END),    0, 1);
      const pF = clamp((sy - CONVERGE_END)  / (FADE_END     - CONVERGE_END),  0, 1);

      particles.current.forEach((p, i) => {
        // Live viewport position of the hero logo element
        const srcX = liveHR.left  + p.relX * liveHR.width;
        const srcY = liveHR.top   + p.relY * liveHR.height;

        // Burst-scattered src position
        const bX = srcX + Math.cos(p.burstAngle) * p.burstDist * easeOut(pD);
        const bY = srcY + Math.sin(p.burstAngle) * p.burstDist * 0.45 * easeOut(pD);

        // Target: nav logo slot (fixed element — use live BCR too)
        const liveNR = navEl.getBoundingClientRect();
        const tX = liveNR.left + p.relX * liveNR.width;
        const tY = liveNR.top  + p.relY * liveNR.height;

        // Stream bezier control point (unique per particle)
        const cX = (bX + tX) / 2 + p.ctrlOffX;
        const cY = (bY + tY) / 2 + p.ctrlOffY;

        let px: number, py: number, alpha: number, sz: number;

        if (pS === 0) {
          // ── Phase 1: Disintegration burst ──
          px    = bX;
          py    = bY;
          alpha = easeOut(pD);
          sz    = p.size;

        } else if (pC === 0) {
          // ── Phase 2: Stream (data river flowing upward) ──
          const personal = clamp((pS - p.delay) / (1 - p.delay), 0, 1);
          const t        = easeIO(personal);
          // Perpendicular wave that fades as particles approach target
          const wave     = p.waveAmp * (1 - t) * Math.sin(elapsed * p.waveFreq * 3 + i * 0.65);
          px    = bezier(bX, cX, tX, t) + wave;
          py    = bezier(bY, cY, tY, t);
          alpha = 1;
          sz    = lerp(p.size, p.size * 0.65, t);

        } else if (pF === 0) {
          // ── Phase 3: Convergence (particles snap to exact target) ──
          const t = easeOut(pC);
          px    = lerp(tX + p.ctrlOffX * 0.08, tX, t);
          py    = lerp(tY - 8, tY, t);
          // Brief size pulse at convergence (data crystallizing)
          sz    = lerp(p.size * 0.65, p.size * 1.3, easeIn(Math.min(pC * 2, 1)));
          alpha = 1;

        } else {
          // ── Phase 4: Fade out — wordmark materializes ──
          px    = tX;
          py    = tY;
          sz    = p.size * 1.3;
          alpha = 1 - easeOut(pF);
        }

        // Draw — same dot style as the hero particle background
        const glowAlpha = alpha * 0.7;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fillStyle    = `rgba(0, 210, 255, ${alpha})`;
        ctx.shadowColor  = `rgba(0, 210, 255, ${glowAlpha})`;
        ctx.shadowBlur   = sz * 4;
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
    };
  }, [ready]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 180 }}
    />
  );
}
