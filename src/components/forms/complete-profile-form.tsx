"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { api } from "@/trpc/react";

const getSafeNextPath = (value: string | null) => {
  if (!value) {
    return "/";
  }

  return value.startsWith("/") ? value : "/";
};

const completeProfileSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z.string().trim().min(2, t("errors.nameRequired")).max(80),
    surname: z.string().trim().min(2, t("errors.surnameRequired")).max(80),
    phone: z.string().trim().min(8, t("errors.phoneRequired")).max(30),
    password: z
      .string()
      .min(10, t("errors.passwordWeak"))
      .regex(/[a-z]/, t("errors.passwordWeak"))
      .regex(/[A-Z]/, t("errors.passwordWeak"))
      .regex(/[0-9]/, t("errors.passwordWeak"))
      .regex(/[^a-zA-Z0-9]/, t("errors.passwordWeak")),
  });

type CompleteProfileValues = z.infer<ReturnType<typeof completeProfileSchema>>;

export function CompleteProfileForm() {
  const t = useTranslations("CompleteProfilePage");
  const router = useRouter();
  const searchParams = useSearchParams();
  const completeProfileMutation = api.auth.completeProfile.useMutation({
    onSuccess: () => {
      router.push(getSafeNextPath(searchParams.get("next")));
      router.refresh();
    },
  });

  const form = useForm<CompleteProfileValues>({
    resolver: zodResolver(completeProfileSchema(t)),
    defaultValues: {
      name: "",
      surname: "",
      phone: "",
      password: "",
    },
    mode: "onBlur",
  });
  const phoneValue = useWatch({ control: form.control, name: "phone" });

  const onSubmit = (values: CompleteProfileValues) => {
    completeProfileMutation.mutate(values);
  };

  return (
    <form className="mt-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">{t("fields.name.label")}</FieldLabel>
          <Input
            id="name"
            placeholder={t("fields.name.placeholder")}
            {...form.register("name")}
          />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="surname">{t("fields.surname.label")}</FieldLabel>
          <Input
            id="surname"
            placeholder={t("fields.surname.placeholder")}
            {...form.register("surname")}
          />
          <FieldError errors={[form.formState.errors.surname]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">{t("fields.phone.label")}</FieldLabel>
          <PhoneInput
            id="phone"
            defaultCountry="CY"
            value={phoneValue}
            onChange={(value) => {
              form.setValue("phone", value ?? "", {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          />
          <FieldDescription>{t("fields.phone.description")}</FieldDescription>
          <FieldError errors={[form.formState.errors.phone]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">{t("fields.password.label")}</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder={t("fields.password.placeholder")}
            autoComplete="new-password"
            {...form.register("password")}
          />
          <FieldDescription>{t("fields.password.description")}</FieldDescription>
          <FieldError errors={[form.formState.errors.password]} />
        </Field>

        {completeProfileMutation.error && (
          <FieldError>{completeProfileMutation.error.message}</FieldError>
        )}

        <Button type="submit" disabled={completeProfileMutation.isPending}>
          {completeProfileMutation.isPending
            ? t("actions.submitting")
            : t("actions.submit")}
        </Button>
      </FieldGroup>
    </form>
  );
}
