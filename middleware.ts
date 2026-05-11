import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale, LOCALES } from "@/lib/i18n";

function detectLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get("lang")?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  const accept = request.headers.get("accept-language") ?? "";
  const preferred = accept
    .split(",")
    .map((item) => item.split(";")[0]?.trim().toLowerCase())
    .find((lang) => lang && LOCALES.includes(lang.slice(0, 2) as (typeof LOCALES)[number]));

  if (!preferred) return DEFAULT_LOCALE;
  return preferred.slice(0, 2);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore Next internals and static/assets/api.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (firstSegment && isLocale(firstSegment)) {
    const response = NextResponse.next();
    response.cookies.set("lang", firstSegment, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set("lang", locale, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

