import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, type AppLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Our Work — Lyntrix",
  description: "50+ projects shipped. AI solutions, high-fidelity web development and cloud architecture that drives real results.",
};

function pickLocale(acceptLanguage: string | null): AppLocale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const preferred = acceptLanguage
    .split(",")
    .map((item) => item.split(";")[0]?.trim().toLowerCase())
    .find((lang) => lang && LOCALES.includes(lang.slice(0, 2) as AppLocale));
  return preferred ? (preferred.slice(0, 2) as AppLocale) : DEFAULT_LOCALE;
}

export default async function WorkPage() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get("lang")?.value;
  const locale = cookieLocale && LOCALES.includes(cookieLocale as AppLocale)
    ? (cookieLocale as AppLocale)
    : pickLocale(headerStore.get("accept-language"));
  redirect(`/${locale}/work`);
}
