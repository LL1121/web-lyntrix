"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { Check, Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface FieldState { focused: boolean; error: string; }

const FIELDS = [
  { name: "name"    as const, placeholder: "Your name",                    multiline: false },
  { name: "email"   as const, placeholder: "your@email.com",               multiline: false },
  { name: "message" as const, placeholder: "Tell us about your project...", multiline: true  },
];

// ── Particle explosion on canvas ───────────────────────────────────────────
function useParticleExplosion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);

  const explode = useCallback((originX: number, originY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";

    const ctx = canvas.getContext("2d")!;
    const COUNT = 55;

    interface P { x: number; y: number; vx: number; vy: number; life: number; size: number; }
    const particles: P[] = Array.from({ length: COUNT }, (_, i) => {
      const angle = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 5;
      return {
        x: originX, y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        life: 1,
        size: 2 + Math.random() * 3,
      };
    });

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        if (p.life <= 0) return;
        p.life -= 0.016;
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.12;           // gravity
        p.vx *= 0.97;           // drag
        alive = true;
        const alpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle   = `rgba(0, 210, 255, ${alpha})`;
        ctx.shadowColor = "rgba(0, 210, 255, 0.8)";
        ctx.shadowBlur  = p.size * 4;
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      if (alive) rafRef.current = requestAnimationFrame(loop);
      else canvas.style.display = "none";
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return { canvasRef, explode };
}

export default function Contact() {
  const router = useRouter();
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({
    name:    { focused: false, error: "" },
    email:   { focused: false, error: "" },
    message: { focused: false, error: "" },
  });

  // Animation phases
  type Phase = "idle" | "launching" | "particles" | "confirm" | "flash" | "done";
  const [phase, setPhase] = useState<Phase>("idle");
  const [apiError, setApiError] = useState("");

  const formRef    = useRef<HTMLFormElement>(null);
  const buttonRef  = useRef<HTMLButtonElement>(null);
  const [btnScope, animateBtn] = useAnimate();
  const { canvasRef, explode } = useParticleExplosion();

  const update = (field: string, partial: Partial<FieldState>) =>
    setFieldStates((p) => ({ ...p, [field]: { ...p[field], ...partial } }));

  const validate = (data: FormData) => {
    const name    = (data.get("name")    as string).trim();
    const email   = (data.get("email")   as string).trim();
    const message = (data.get("message") as string).trim();
    let ok = true;
    if (!name)                                            { update("name",    { error: "Name is required" });           ok = false; } else update("name",    { error: "" });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { update("email",   { error: "Valid email required" });       ok = false; } else update("email",   { error: "" });
    if (!message)                                         { update("message", { error: "Message is required" });        ok = false; } else update("message", { error: "" });
    return ok ? { name, email, message } : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase !== "idle") return;

    const fd   = new FormData(formRef.current!);
    const data = validate(fd);
    if (!data) return;

    setApiError("");
    setPhase("launching");

    // ── PHASE 1: Plane shakes then flies to screen center ───────────────
    await animateBtn(
      btnScope.current,
      { rotate: [0, -4, 4, -4, 4, 0] },
      { duration: 0.35 }
    );
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const fromX = rect.left + rect.width / 2;
      const fromY = rect.top + rect.height / 2;
      await animateBtn(
        btnScope.current,
        {
          x: cx - fromX,
          y: cy - fromY,
          rotate: 18,
          scale: 1.22,
        },
        { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
      );
    }
    await animateBtn(btnScope.current, { opacity: 0, scale: 0.4 }, { duration: 0.2 });

    // ── PHASE 2: Particle explosion ──────────────────────────────────────
    setPhase("particles");
    explode(window.innerWidth / 2, window.innerHeight / 2);

    // ── API call (fire in parallel) ──────────────────────────────────────
    const apiPromise = fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => null);

    // ── PHASE 3: Confirmation tick in center ─────────────────────────────
    await new Promise((r) => setTimeout(r, 620));
    setPhase("confirm");
    await new Promise((r) => setTimeout(r, 560));

    // ── PHASE 4: Screen flash ────────────────────────────────────────────
    setPhase("flash");

    await new Promise((r) => setTimeout(r, 450));

    // Wait for API (if still pending) before navigating
    const res = await apiPromise;
    if (res && !res.ok) setApiError("Message failed to send. Please try again.");

    // ── PHASE 5: Navigate home ───────────────────────────────────────────
    setPhase("done");
    router.push("/");
  };

  const isAnimating = phase !== "idle";

  return (
    <section id="contact" style={{ position: "relative", padding: "96px 0" }}>
      {/* Particle canvas overlay */}
      <canvas
        ref={canvasRef}
        style={{
          display: "none",
          position: "fixed",
          top: 0, left: 0,
          pointerEvents: "none",
          zIndex: 9000,
        }}
      />

      {/* Full-screen flash overlay */}
      <AnimatePresence>
        {(phase === "flash" || phase === "done") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 8999,
              background: "radial-gradient(ellipse at center, rgba(0,210,255,0.95) 0%, rgba(58,123,213,0.98) 60%, rgba(0,0,0,1) 100%)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* Confirmation tick */}
      <AnimatePresence>
        {phase === "confirm" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9100,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ boxShadow: "0 0 0 rgba(0,210,255,0)" }}
              animate={{ boxShadow: "0 0 50px rgba(0,210,255,0.55)" }}
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "999px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
              }}
            >
              <Check style={{ width: "44px", height: "44px", color: "white" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Separator */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)" }} />
      <div style={{ position: "absolute", left: "50%", top: "40%", transform: "translate(-50%,-50%)", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(0,210,255,0.025)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 32px", position: "relative" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <span style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase" as const, color: "#00D2FF", marginBottom: "14px" }}>Signal</span>
          <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "white", marginBottom: "14px" }}>
            Let&apos;s build{" "}
            <span style={{ background: "linear-gradient(135deg, #00D2FF, #3a7bd5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              together
            </span>
          </h2>
          <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
            Ready to elevate your digital presence? Drop us a signal.
          </p>
        </motion.div>

        {apiError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", color: "rgba(248,113,113,0.85)", fontSize: "13px", marginBottom: "16px" }}
          >
            {apiError}
          </motion.p>
        )}

        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {FIELDS.map(({ name, placeholder, multiline }) => {
            const state = fieldStates[name];
            const borderColor = state.error ? "rgba(248,113,113,0.55)" : state.focused ? "rgba(0,210,255,0.45)" : "rgba(255,255,255,0.1)";
            const sharedStyle: React.CSSProperties = {
              width: "100%", padding: "14px 18px", borderRadius: "12px",
              border: `1px solid ${borderColor}`,
              background: state.focused ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
              boxShadow: state.focused && !state.error ? "0 0 0 3px rgba(0,210,255,0.07)" : "none",
              color: "white", fontSize: "14px", fontFamily: "inherit",
              outline: "none", transition: "all 0.22s ease",
              resize: "none" as const, boxSizing: "border-box" as const,
              opacity: isAnimating ? 0.5 : 1,
            };
            return (
              <div key={name}>
                {multiline
                  ? <textarea name={name} placeholder={placeholder} rows={5} style={sharedStyle} disabled={isAnimating} onFocus={() => update(name, { focused: true })} onBlur={() => update(name, { focused: false })} />
                  : <input   name={name} placeholder={placeholder}         style={sharedStyle} disabled={isAnimating} onFocus={() => update(name, { focused: true })} onBlur={() => update(name, { focused: false })} />
                }
                <AnimatePresence>
                  {state.error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} style={{ marginTop: "6px", fontSize: "12px", color: "rgba(248,113,113,0.85)" }}>
                      {state.error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Submit button */}
          <button
            ref={buttonRef}
            type="submit"
            disabled={isAnimating}
            style={{
              marginTop: "8px", width: "100%", padding: "15px 24px",
              borderRadius: "12px", border: "none",
              background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
              color: "white", fontSize: "14px", fontWeight: 600,
              cursor: isAnimating ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "10px", fontFamily: "inherit",
              overflow: "hidden", position: "relative",
              opacity: isAnimating ? 0.8 : 1,
              transition: "box-shadow 0.3s",
            }}
            onMouseEnter={(e) => { if (!isAnimating) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(0,210,255,0.22)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
          >
            {phase === "idle" && <>Send signal <span ref={btnScope}><Send style={{ width: "16px", height: "16px" }} /></span></>}
            {phase === "launching" && <span ref={btnScope}><Send style={{ width: "18px", height: "18px" }} /></span>}
            {phase === "particles" && <span style={{ opacity: 0 }}>·</span>}
            {(phase === "flash" || phase === "done") && <span style={{ opacity: 0 }}>·</span>}
          </button>
        </motion.form>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.22); }
        input, textarea { color-scheme: dark; }
      `}</style>
    </section>
  );
}
