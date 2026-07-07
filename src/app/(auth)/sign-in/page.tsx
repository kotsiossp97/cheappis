import { LoginForm } from "@/components/forms/login-form";
import CheappisLogo from "@/components/reusable/logo";
import LanguageSwitch from "@/components/toggles/language-switch";
import { ThemeSwitch } from "@/components/toggles/theme-switch";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { getSession } from "@/server/better-auth/server";

export default async function SignInPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  const t = await getTranslations("SignInPage");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-around gap-2 md:justify-between">
          <Link href="/">
            <CheappisLogo />
          </Link>
          <div className="flex items-center gap-1">
            <LanguageSwitch />
            <ThemeSwitch />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/login_splash.svg"
          alt={t("splashAlt")}
          width={100}
          height={100}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
