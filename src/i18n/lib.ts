import { type Locale } from "next-intl";

export const I18N_COOKIE_NAME = "cheappis-locale";

export const SUPPORTED_LOCALES: Record<
  Locale,
  { text: string; countryCode: string }
> = {
  en: {
    text: "English",
    countryCode: "UK",
  },
  el: {
    text: "Ελληνικά",
    countryCode: "GR",
  },
  ru: {
    text: "Русский",
    countryCode: "RU",
  },
};
