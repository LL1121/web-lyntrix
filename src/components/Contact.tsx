"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check } from "lucide-react";

interface FieldState {
  focused: boolean;
  error: string;
}

const FIELDS = [
  { name: "name" as const, placeholder: "Your name", multiline: false },
  { name: "email" as const, placeholder: "your@email.com", multiline: false },
  { name: "message" as const, placeholder: "Tell us about your project...", multiline: true },
];

export default function Contact() {
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({
    name: { focused: false, error: "" },
    email: { focused: false, error: "" },
    message: { focused: false, error: "" },
  });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (field: string, partial: Partial<FieldState>) =>
    setFieldStates((prev) => ({ ...prev, [field]: { ...prev[field], ...partial } }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    const name = (fd.get("name") as string).trim();
    const email = (fd.get("email") as string).trim();
    const message = (fd.get("message") as string).trim();

    let ok = true;
    if (!name) { update("name", { error: "Name is required" }); ok = false; }
    else update("name", { error: "" });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      update("email", { error: "Valid email is required" }); ok = false;
    } else update("email", { error: "" });
    if (!message) { update("message", { error: "Message is required" }); ok = false; }
    else update("message", { error: "" });

    if (ok) setSubmitted(true);
  };

  return (
    <section id="contact" style={{ position: "relative", padding: "96px 0" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
        }}
      />

      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(0,210,255,0.025)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 32px", position: "relative" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <span
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#00D2FF",
              marginBottom: "14px",
            }}
          >
            Signal
          </span>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "white",
              marginBottom: "14px",
            }}
          >
            Let&apos;s build{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              together
            </span>
          </h2>
          <p style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
            Ready to elevate your digital presence? Drop us a signal.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "56px 32px",
                borderRadius: "20px",
                border: "1px solid rgba(0,210,255,0.2)",
                background: "rgba(0,210,255,0.04)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                  boxShadow: "0 0 32px rgba(0,210,255,0.3)",
                }}
              >
                <Check style={{ width: "28px", height: "28px", color: "white" }} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "white", marginBottom: "10px" }}>
                Signal received
              </h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>
                We&apos;ll get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
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
                const borderColor = state.error
                  ? "rgba(248,113,113,0.55)"
                  : state.focused
                  ? "rgba(0,210,255,0.45)"
                  : "rgba(255,255,255,0.1)";
                const bg = state.focused
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(255,255,255,0.02)";
                const shadow = state.focused && !state.error
                  ? "0 0 0 3px rgba(0,210,255,0.07)"
                  : "none";

                const sharedStyle: React.CSSProperties = {
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: `1px solid ${borderColor}`,
                  background: bg,
                  boxShadow: shadow,
                  color: "white",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  transition: "border-color 0.22s, background 0.22s, box-shadow 0.22s",
                  resize: "none" as const,
                  boxSizing: "border-box" as const,
                };

                return (
                  <div key={name}>
                    {multiline ? (
                      <textarea
                        name={name}
                        placeholder={placeholder}
                        rows={5}
                        style={sharedStyle}
                        onFocus={() => update(name, { focused: true })}
                        onBlur={() => update(name, { focused: false })}
                      />
                    ) : (
                      <input
                        name={name}
                        placeholder={placeholder}
                        style={sharedStyle}
                        onFocus={() => update(name, { focused: true })}
                        onBlur={() => update(name, { focused: false })}
                      />
                    )}
                    <AnimatePresence>
                      {state.error && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          style={{
                            marginTop: "6px",
                            fontSize: "12px",
                            color: "rgba(248,113,113,0.85)",
                          }}
                        >
                          {state.error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  marginTop: "8px",
                  width: "100%",
                  padding: "15px 24px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #00D2FF, #3a7bd5)",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontFamily: "inherit",
                  transition: "box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 0 40px rgba(0,210,255,0.22)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                Send signal
                <Send style={{ width: "16px", height: "16px" }} />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Placeholder color fix */}
      <style>{`
        input::placeholder,
        textarea::placeholder {
          color: rgba(255,255,255,0.22);
        }
        input,
        textarea {
          color-scheme: dark;
        }
      `}</style>
    </section>
  );
}
