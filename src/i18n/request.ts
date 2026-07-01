import { I18N_COOKIE_NAME } from "@/i18n/lib";
import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async (params) => {
  const store = await cookies();
  const locale = params.locale || store.get(I18N_COOKIE_NAME)?.value || "en";

  return {
    locale,
    messages: (await import(`../translations/${locale}.json`)).default,
  };
});
