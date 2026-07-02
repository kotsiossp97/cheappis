"use client";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
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
import { api } from "@/trpc/react";
import { useMemo } from "react";
import IconImageRender from "@/components/helpers/icon-image-render";

interface CategoryComboboxProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
}

export default function CategoryCombobox<T extends FieldValues>({
  form,
  name,
}: CategoryComboboxProps<T>) {
  const t = useTranslations("Categories");
  const categoriesQuery = api.category.list.useQuery();

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{t("field.label")}</FieldLabel>
          <Combobox
            items={categories}
            onValueChange={field.onChange}
            {...field}
          >
            <ComboboxTrigger
              render={
                <Button variant="outline" className="w-full font-normal">
                  {field.value ? (
                    <>
                      <IconImageRender
                        source={
                          categories.find((c) => c.slug === field.value)
                            ?.icon ?? ""
                        }
                        className="mr-2"
                      />
                      {t(field.value as string)}
                    </>
                  ) : (
                    t("field.placeholder")
                  )}
                </Button>
              }
            />
            <ComboboxContent>
              <ComboboxInput
                showTrigger={false}
                placeholder={t("field.search")}
              />
              <ComboboxEmpty>{t("field.noResults")}</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.id} value={item.slug}>
                    <IconImageRender source={item.icon} className="mr-2" />
                    {t(item.slug as string)}
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
