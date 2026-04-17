"use client";

import SmoothScroll from "@/components/SmoothScroll";
import GrainOverlay from "@/components/GrainOverlay";
import Navbar from "@/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <GrainOverlay />
      <Navbar />
      {children}
    </SmoothScroll>
  );
}
