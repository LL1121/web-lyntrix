"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import PageCTAWork from "@/components/PageCTAWork";
import Footer from "@/components/Footer";

const LogoParticleTransition = dynamic(
  () => import("@/components/LogoParticleTransition"),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <LogoParticleTransition />
      <main>
        <Hero />
        <Manifesto />
        <PageCTAWork />
        <Footer />
      </main>
    </>
  );
}
