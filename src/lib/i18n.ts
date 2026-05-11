export const LOCALES = ["en", "es"] as const;
export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

export function isLocale(value: string): value is AppLocale {
  return LOCALES.includes(value as AppLocale);
}

