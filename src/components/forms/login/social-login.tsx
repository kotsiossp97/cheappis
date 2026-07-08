"use client";

import AppleIcon from "@/components/reusable/icons/apple";
import FacebookIcon from "@/components/reusable/icons/facebook";
import GoogleIcon from "@/components/reusable/icons/google";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { AuthError } from "@/lib/custom-errors";
import { authClient, type SocialProvider } from "@/server/better-auth/client";
import { KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const getSafeNextPath = (value: string | null) => {
  if (!value) return "/";

  return value.startsWith("/") ? value : "/";
};

export default function SocialLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("SignInPage");

  const [submitting, setSubmitting] = useState(false);
  const [activeSocialProvider, setActiveSocialProvider] =
    useState<SocialProvider | null>(null);
  const [passkeyPending, setPasskeyPending] = useState(false);

  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get("next")),
    [searchParams],
  );

  const handleSocialSignIn = async (provider: SocialProvider) => {
    setSubmitting(true);
    setActiveSocialProvider(provider);
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: nextPath,
      });

      if (error) {
        if (error.message?.includes("cancel")) {
          throw new AuthError("errors.userCancelled");
        }
        throw new AuthError("errors.generic", error.message);
      }
    } catch (err) {
      let errorMessage = t("errors.generic");
      if (err instanceof AuthError) {
        if (err.errorSlug) {
          errorMessage = t(err.errorSlug);
        } else {
          errorMessage = err.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      setActiveSocialProvider(null);
    }
  };

  const handlePasskeySignIn = async () => {
    setSubmitting(true);
    setPasskeyPending(true);
    try {
      if (!window.PublicKeyCredential) {
        throw new AuthError("errors.passkeyUnavailable");
      }
      const result = await authClient.signIn.passkey({
        autoFill: false,
      });

      if (result.error) {
        if (result.error.message?.includes("cancel")) {
          throw new AuthError("errors.userCancelled");
        }
        throw new AuthError("errors.generic", result.error.message);
      }

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      let errorMessage = t("errors.generic");
      if (err instanceof AuthError) {
        if (err.errorSlug) {
          errorMessage = t(err.errorSlug);
        } else {
          errorMessage = err.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
      setPasskeyPending(false);
    }
  };

  return (
    <>
      <Field>
        <Button
          variant="outline"
          type="button"
          disabled={
            submitting || passkeyPending || activeSocialProvider !== null
          }
          onClick={() => handleSocialSignIn("google")}
          className="border-[#747775] bg-white text-[#1f1f1f] dark:border-[#8e918f] dark:bg-[#131314] dark:text-[#e3e3e3]"
        >
          <GoogleIcon />
          {activeSocialProvider === "google" ? t("loading") : t("google")}
        </Button>
      </Field>
      <Field>
        <Button
          variant="outline"
          type="button"
          disabled={
            submitting || passkeyPending || activeSocialProvider !== null
          }
          onClick={() => handleSocialSignIn("apple")}
          className={"border-[#747775] dark:border-[#8e918f]"}
        >
          <AppleIcon />
          {activeSocialProvider === "apple" ? t("loading") : t("apple")}
        </Button>
      </Field>
      <Field>
        <Button
          variant="outline"
          type="button"
          disabled={
            submitting || passkeyPending || activeSocialProvider !== null
          }
          className="text-primary-foreground! bg-[#1877F2] hover:bg-blue-600 dark:bg-[#1877F2] dark:hover:bg-blue-800"
          onClick={() => handleSocialSignIn("facebook")}
        >
          <FacebookIcon />
          {activeSocialProvider === "facebook" ? t("loading") : t("facebook")}
        </Button>
      </Field>

      <Field>
        <Button
          variant="default"
          type="button"
          disabled={
            submitting || passkeyPending || activeSocialProvider !== null
          }
          onClick={handlePasskeySignIn}
        >
          <KeyRound className="size-4" />
          {passkeyPending ? t("loading") : t("passkeyButton")}
        </Button>
      </Field>
    </>
  );
}
