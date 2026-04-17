import { createRef } from "react";

// Shared singleton refs for the logo transition animation.
// heroLogoRef  → the "L" in "build" inside the Hero headline
// navLogoRef   → the logo slot inside the Navbar (target of the flying animation)
export const heroLogoRef = createRef<HTMLSpanElement>();
export const navLogoRef = createRef<HTMLAnchorElement>();
