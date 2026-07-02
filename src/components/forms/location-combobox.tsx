"use client";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useTranslations } from "next-intl";
import {
  Controller,
  type Path,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

interface LocationComboboxProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
}

export default function LocationCombobox<T extends FieldValues>({
  form,
  name,
}: LocationComboboxProps<T>) {
  const t = useTranslations("LocationCombobox");

  const districts = [
    "nicosia",
    "limassol",
    "larnaca",
    "paphos",
    "famagusta",
    "kyrenia",
  ];

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{t("label")}</FieldLabel>
          <Combobox items={districts} onValueChange={field.onChange} {...field}>
            <ComboboxTrigger
              render={
                <Button variant="outline" className="w-full font-normal">
                  {field.value
                    ? t(`districts.${field.value as string}`)
                    : t("placeholder")}
                </Button>
              }
            />
            <ComboboxContent>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {t(`districts.${item}`)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
