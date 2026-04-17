# Lyntrix — Technology Studio

Landing page for **Lyntrix**, a technology studio specializing in AI solutions, high-fidelity web development, and scalable cloud architecture.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion + GSAP
- **Smooth Scroll**: Lenis
- **Language**: TypeScript
- **Icons**: Lucide React

## Pages

| Route | Description |
|---|---|
| `/` | Hero + Manifesto + CTA |
| `/work` | Services + Portfolio |
| `/contact` | Contact form |

## Key Features

- **Particle logo transition** — the brand mark in the hero disintegrates into data particles that stream to the navbar and crystallize into the wordmark on scroll
- **Multi-page architecture** — 3 dedicated pages with smooth page transitions
- **Irresistible CTAs** — magnetic buttons with cursor-tracking glow, animated counters, urgency badges
- **Bento grid services** — interactive cards with hover micro-interactions
- **Horizontal scroll vault** — portfolio with scroll hijacking (vertical → horizontal → vertical)
- **Manifesto section** — word-by-word scroll-triggered text illumination
- **Particle canvas background** — connected dot network in the hero

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Home
│   ├── work/page.tsx     # Portfolio & Services
│   ├── contact/page.tsx  # Contact
│   ├── layout.tsx
│   └── template.tsx      # Page transitions
├── components/
│   ├── Hero.tsx
│   ├── Manifesto.tsx
│   ├── Services.tsx
│   ├── Vault.tsx
│   ├── Contact.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── LogoParticleTransition.tsx
│   ├── PageCTAWork.tsx
│   ├── PageCTAContact.tsx
│   └── MagneticButton.tsx
└── lib/
    ├── logo-refs.ts
    └── utils.ts
```

## Deploy

Optimized for deployment on [Vercel](https://vercel.com).
