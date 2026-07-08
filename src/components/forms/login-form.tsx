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
import { ArrowLeft, Home } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import SocialLoginForm from "@/components/forms/login/social-login";
import { AuthError } from "@/lib/custom-errors";
import { authClient } from "@/server/better-auth/client";
import { api } from "@/trpc/react";
import { PasswordInput } from "@/components/ui/password-input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const getSafeNextPath = (value: string | null) => {
  if (!value) {
    return "/";
  }

  return value.startsWith("/") ? value : "/";
};

const loginFormSchema = z
  .object({
    email: z.email({ message: "errors.invalidEmail" }),
    password: z.string(),
    signInMode: z.enum(["email", "password"]),
  })
  .superRefine((data, ctx) => {
    if (data.signInMode !== "password") {
      return;
    }

    if (data.password.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "errors.password.required",
      });
      return;
    }

    if (data.password.length < 8) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "errors.password.tooShort",
      });
    }
  });

type LoginFormValues = z.infer<typeof loginFormSchema>;

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
  const [signInMode, setSignInMode] = useState<"email" | "password">("email");

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      signInMode,
    },
    resolver: zodResolver(loginFormSchema),
    mode: "onSubmit",
  });
  const email = useWatch({ control: form.control, name: "email" }) ?? "";
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);
  const [emailSentExpiresInMinutes, setEmailSentExpiresInMinutes] = useState<
    number | null
  >(null);
  const [passwordSignInPending, setPasswordSignInPending] = useState(false);

  const getTranslatedFieldError = (slug?: string) => {
    if (!slug) {
      return null;
    }

    return t.has(slug as Parameters<typeof t>[0])
      ? t(slug as Parameters<typeof t>[0])
      : slug;
  };

  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get("next")),
    [searchParams],
  );

  const handleEmailSignIn = async (values: LoginFormValues) => {
    try {
      const trimmedEmail = values.email.trim().toLowerCase();
      form.setValue("email", trimmedEmail, {
        shouldDirty: true,
        shouldValidate: true,
      });
      const methodResult = await signInMethodMutation.mutateAsync({
        email: trimmedEmail,
      });

      if (methodResult.method === "password") {
        setSignInMode("password");
        form.setValue("signInMode", "password", {
          shouldDirty: false,
          shouldValidate: false,
        });
        setEmailSentTo(null);
        setEmailSentExpiresInMinutes(null);
        return;
      }

      const res = await emailVerificationInitMutation.mutateAsync({
        email: trimmedEmail,
        locale: locale as "en" | "el" | "ru",
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
      let error = t("errors.generic");
      if (err instanceof AuthError) {
        if (err.errorSlug) {
          error = t(err.errorSlug);
        } else {
          error = err.message;
        }
      }
      toast.error(error);
    }
  };

  const handlePasswordSignIn = async (values: LoginFormValues) => {
    setPasswordSignInPending(true);

    try {
      const { error } = await authClient.signIn.email({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        callbackURL: nextPath,
      });

      if (error) {
        throw new AuthError("errors.invalidCredentials", error.message);
      }

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      let error = t("errors.generic");
      if (err instanceof AuthError) {
        if (err.errorSlug) {
          error = t(err.errorSlug);
        } else {
          error = err.message;
        }
      }
      toast.error(error);
    } finally {
      setPasswordSignInPending(false);
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    if (signInMode === "password") {
      await handlePasswordSignIn(values);
      return;
    }

    await handleEmailSignIn(values);
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        {signInMode === "password" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            className="-ml-4"
          >
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => {
                setSignInMode("email");
                form.setValue("signInMode", "email", {
                  shouldDirty: false,
                  shouldValidate: false,
                });
              }}
            >
              <ArrowLeft />
              {t("back")}
            </Button>
          </motion.div>
        )}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {t(signInMode === "password" ? "welcomeBack" : "title")}
          </h1>
          {signInMode !== "password" && (
            <p className="text-muted-foreground text-sm text-balance">
              {t("subtitle")}
            </p>
          )}
        </div>
        <AnimatePresence>
          {signInMode === "email" && (
            <motion.div
              className={"space-y-5"}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SocialLoginForm />
              <FieldSeparator className="my-2">
                {t("continueWith")}
              </FieldSeparator>
            </motion.div>
          )}
        </AnimatePresence>

        <>
          {signInMode === "password" ? (
            <>
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.3 } }}
                  >
                    <Field>
                      <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
                      <Input value={field.value} disabled readOnly />
                    </Field>
                  </motion.div>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.4 } }}
                  >
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">
                        {t("passwordLabel")}
                      </FieldLabel>
                      <PasswordInput id="password" {...field} autoFocus />
                      {fieldState.error?.message && (
                        <FieldError>
                          {getTranslatedFieldError(fieldState.error.message)}
                        </FieldError>
                      )}
                    </Field>
                  </motion.div>
                )}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
              >
                <Link
                  href={`/auth/forgot-password?next=${encodeURIComponent(
                    nextPath,
                  )}`}
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  {t("forgotPassword")}
                </Link>
              </motion.div>
            </>
          ) : emailSentTo ? (
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-muted/40 space-y-2 rounded-lg border p-4 text-sm"
            >
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
            </motion.div>
          ) : (
            <motion.div
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">{t("emailLabel")}</FieldLabel>
                    <Input
                      {...field}
                      placeholder={t("emailPlaceholder")}
                      autoComplete="email webauthn"
                    />
                    {fieldState.error?.message && (
                      <FieldError>
                        {getTranslatedFieldError(fieldState.error.message)}
                      </FieldError>
                    )}
                  </Field>
                )}
              />
            </motion.div>
          )}
        </>
        <Field>
          <Button
            type="submit"
            disabled={
              emailVerificationInitMutation.isPending ||
              signInMethodMutation.isPending ||
              passwordSignInPending
            }
            className={cn(
              emailSentTo ||
                signInMode === "password" ||
                (email && email.trim().length > 0)
                ? "opacity-100"
                : "invisible opacity-0",
              "transition-all",
            )}
          >
            {emailVerificationInitMutation.isPending ||
            signInMethodMutation.isPending ||
            passwordSignInPending
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
