"use server";

import { I18N_COOKIE_NAME } from "@/i18n/lib";
import { type Locale } from "next-intl";
import { cookies } from "next/headers";

async function changeLocaleAction(locale: Locale) {
  "use server";
  const store = await cookies();
  store.set(I18N_COOKIE_NAME, locale);
}

export default changeLocaleAction;
