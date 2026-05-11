"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, type AppLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export function getLocaleFromPathname(pathname: string): AppLocale {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isLocale(first) ? first : DEFAULT_LOCALE;
}

export function useLocale() {
  const pathname = usePathname();
  return getLocaleFromPathname(pathname);
}

export function useDictionary() {
  const locale = useLocale();
  return getDictionary(locale);
}

