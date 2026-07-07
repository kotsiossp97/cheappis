"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Home } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import SocialLoginForm from "@/components/forms/login/social-login";
import { AuthError } from "@/lib/custom-errors";
import { authClient } from "@/server/better-auth/client";
import { api } from "@/trpc/react";

const getSafeNextPath = (value: string | null) => {
  if (!value) {
    return "/";
  }

  return value.startsWith("/") ? value : "/";
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const t = useTranslations("SignInPage");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const emailVerificationInitMutation =
    api.auth.emailVerificationInit.useMutation();
  const signInMethodMutation = api.auth.signInMethod.useMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInMode, setSignInMode] = useState<"email" | "password">("email");
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const [emailSentExpiresInMinutes, setEmailSentExpiresInMinutes] = useState<
    number | null
  >(null);

  const [authError, setAuthError] = useState<string | null>(null);

  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get("next")),
    [searchParams],
  );

  const authLocale =
    locale === "el" || locale === "ru" || locale === "en" ? locale : "en";

  const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const methodResult = await signInMethodMutation.mutateAsync({
        email: trimmedEmail,
      });

      if (methodResult.method === "password") {
        setSignInMode("password");
        setEmailSentTo(null);
        setEmailSentExpiresInMinutes(null);
        return;
      }

      const res = await emailVerificationInitMutation.mutateAsync({
        email: trimmedEmail,
        locale: authLocale,
        callbackPath: nextPath,
      });

      if (!res.success) {
        throw new AuthError("errors.generic", res.message);
      }

      setEmailSentTo(trimmedEmail);
      setEmailSentExpiresInMinutes(
        res.expiresInSeconds
          ? Math.ceil(res.expiresInSeconds / 60)
          : emailSentExpiresInMinutes,
      );
    } catch (err) {
      if (err instanceof AuthError) {
        if (err.errorSlug) {
          setAuthError(t(err.errorSlug));
        } else {
          setAuthError(err.message);
        }
      } else {
        setAuthError(t("errors.generic"));
      }
    }
  };

  const handlePasswordSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
        callbackURL: nextPath,
      });

      if (error) {
        throw new AuthError("errors.invalidCredentials", error.message);
      }

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      if (err instanceof AuthError) {
        if (err.errorSlug) {
          setAuthError(t(err.errorSlug));
        } else {
          setAuthError(err.message);
        }
      } else {
        setAuthError(t("errors.generic"));
      }
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={signInMode === "password" ? handlePasswordSignIn : handleEmailSignIn}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("subtitle")}
          </p>
        </div>
        {signInMode === "email" && (
          <>
            <SocialLoginForm />
            <FieldSeparator className="my-2">{t("continueWith")}</FieldSeparator>
          </>
        )}

        {signInMode === "password" ? (
          <>
            <Field>
              <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                disabled
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">{t("passwordLabel")}</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </Field>
          </>
        ) : emailSentTo ? (
          <div className="bg-muted/40 space-y-2 rounded-lg border p-4 text-sm">
            <p className="font-medium">{t("emailSentTitle")}</p>
            <p className="text-muted-foreground">
              {t("emailSentDescription", { email: emailSentTo })}
            </p>
            <p className="text-muted-foreground">
              {emailSentExpiresInMinutes !== null
                ? t("emailSentHintWithExpiry", {
                    minutes: emailSentExpiresInMinutes,
                  })
                : t("emailSentHint")}
            </p>
          </div>
        ) : (
          <Field>
            <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email webauthn"
              required
            />
          </Field>
        )}
        {authError && <FieldError>{authError}</FieldError>}
        <Field>
          <Button
            type="submit"
            disabled={
              emailVerificationInitMutation.isPending || signInMethodMutation.isPending
            }
            className={cn(
              emailSentTo || signInMode === "password" || (email && email.trim().length > 0)
                ? "opacity-100"
                : "invisible opacity-0",
              "transition-all",
            )}
          >
            {emailVerificationInitMutation.isPending || signInMethodMutation.isPending
              ? t("loading")
              : signInMode === "password"
                ? t("passwordSignInButton")
              : emailSentTo
                ? t("resendButton")
                : t("continueButton")}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-1 text-sm"
          >
            <Home className="size-4" />
            {t("backToHome")}
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
