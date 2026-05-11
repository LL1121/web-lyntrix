import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, type AppLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Start a Project — Lyntrix",
  description: "Ready to build something extraordinary? Drop us a signal and we will respond within 48 hours.",
};

function pickLocale(acceptLanguage: string | null): AppLocale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const preferred = acceptLanguage
    .split(",")
    .map((item) => item.split(";")[0]?.trim().toLowerCase())
    .find((lang) => lang && LOCALES.includes(lang.slice(0, 2) as AppLocale));
  return preferred ? (preferred.slice(0, 2) as AppLocale) : DEFAULT_LOCALE;
}

export default async function ContactPage() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get("lang")?.value;
  const locale = cookieLocale && LOCALES.includes(cookieLocale as AppLocale)
    ? (cookieLocale as AppLocale)
    : pickLocale(headerStore.get("accept-language"));
  redirect(`/${locale}/contact`);
}
