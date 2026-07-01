"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Info, Star, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";

import {
  FREE_PLAN_MAX_IMAGES,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from "@/lib/listing-image-constraints";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";

const isValidHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const createSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(5, t("errors.titleTooShort"))
      .max(120, t("errors.titleTooLong")),
    categorySlug: z.string().trim().min(1, t("errors.categoryRequired")),
    location: z
      .string()
      .trim()
      .min(2, t("errors.locationRequired"))
      .max(120, t("errors.locationTooLong")),
    description: z
      .string()
      .trim()
      .max(5000, t("errors.descriptionTooLong"))
      .optional(),
    price: z.string().trim().optional(),
    isFree: z.boolean(),
    priceNegotiable: z.boolean(),
    imageUrls: z
      .array(z.string().trim().url(t("errors.invalidImageUrl")))
      .min(1, t("errors.noImagesSelected"))
      .max(
        FREE_PLAN_MAX_IMAGES,
        t("errors.tooManyImages", { max: FREE_PLAN_MAX_IMAGES }),
      ),
  });

type NewListingFormValues = {
  title: string;
  categorySlug: string;
  location: string;
  description?: string;
  price?: string;
  isFree: boolean;
  priceNegotiable: boolean;
  imageUrls: string[];
};

export function NewListingForm() {
  const t = useTranslations("NewListingForm");
  const tCat = useTranslations("Categories");
  const router = useRouter();
  const categoriesQuery = api.category.list.useQuery();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const schema = useMemo(() => createSchema(t), [t]);

  const createListingMutation = api.listing.create.useMutation({
    onSuccess: (listing) => {
      router.push(
        `/listings/categories/${listing.categorySlug}/${listing.slug}`,
      );
    },
  });

  const form = useForm<NewListingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      categorySlug: "",
      location: "",
      description: "",
      price: "",
      isFree: false,
      priceNegotiable: false,
      imageUrls: [],
    },
    mode: "onBlur",
  });

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );

  const imageUrls =
    useWatch({ control: form.control, name: "imageUrls" }) ?? [];
  const isFreeSelected =
    useWatch({ control: form.control, name: "isFree" }) ?? false;
  const isNegotiableSelected =
    useWatch({ control: form.control, name: "priceNegotiable" }) ?? false;

  const validImageCount = imageUrls.filter((url) => isValidHttpUrl(url)).length;
  const reachedImageLimit = imageUrls.length >= FREE_PLAN_MAX_IMAGES;

  const removeImageSlot = (index: number) => {
    const nextUrls = imageUrls.filter(
      (_, currentIndex) => currentIndex !== index,
    );
    form.setValue("imageUrls", nextUrls, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const getUploadErrorMessage = (errorKey?: string) => {
    switch (errorKey) {
      case "errors.noImagesSelected":
        return t("errors.noImagesSelected");
      case "errors.tooManyImages":
        return t("errors.tooManyImages", { max: FREE_PLAN_MAX_IMAGES });
      case "errors.unsupportedFileType":
        return t("errors.unsupportedFileType");
      case "errors.fileTooLarge":
        return t("errors.fileTooLarge", {
          maxMb: Math.floor(MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024)),
        });
      case "errors.uploadFailed":
      default:
        return t("errors.uploadFailed");
    }
  };

  const onChooseImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const availableSlots = FREE_PLAN_MAX_IMAGES - imageUrls.length;

    if (availableSlots <= 0) {
      setUploadError(t("errors.tooManyImages", { max: FREE_PLAN_MAX_IMAGES }));
      event.target.value = "";
      return;
    }

    const acceptedFiles = files.slice(0, availableSlots);

    if (acceptedFiles.some((file) => file.size > MAX_IMAGE_FILE_SIZE_BYTES)) {
      setUploadError(
        t("errors.fileTooLarge", {
          maxMb: Math.floor(MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024)),
        }),
      );
      event.target.value = "";
      return;
    }

    setUploadError(null);
    setUploadingImages(true);

    try {
      const payload = new FormData();
      for (const file of acceptedFiles) {
        payload.append("files", file);
      }

      const response = await fetch("/api/uploads/listing-images", {
        method: "POST",
        body: payload,
      });

      const data = (await response.json()) as
        { urls?: string[]; errorKey?: string } | undefined;

      if (!response.ok || !data?.urls) {
        setUploadError(getUploadErrorMessage(data?.errorKey));
        return;
      }

      form.setValue("imageUrls", [...imageUrls, ...data.urls], {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch {
      setUploadError(t("errors.uploadFailed"));
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const onSubmit = (values: NewListingFormValues) => {
    const parsedPrice = values.price?.trim() ? Number(values.price) : null;

    if (Number.isNaN(parsedPrice)) {
      form.setError("price", {
        message: t("errors.invalidPrice"),
      });
      return;
    }

    createListingMutation.mutate({
      title: values.title,
      categorySlug: values.categorySlug,
      location: values.location,
      description: values.description?.trim() || undefined,
      price: values.isFree ? null : parsedPrice,
      isFree: values.isFree,
      priceNegotiable: values.priceNegotiable,
      imageUrls: values.imageUrls,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={onChooseImages}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("form.card.title")}</CardTitle>
            <CardDescription>{t("form.card.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">
                  {t("fields.title.label")}
                </FieldLabel>
                <Input
                  id="title"
                  placeholder={t("fields.title.placeholder")}
                  {...form.register("title")}
                />
                <FieldError errors={[form.formState.errors.title]} />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="categorySlug"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        {t("fields.category.label")}
                      </FieldLabel>
                      <Combobox
                        items={categories}
                        onValueChange={field.onChange}
                        {...field}
                      >
                        <ComboboxTrigger
                          render={
                            <Button
                              variant="outline"
                              className="w-full justify-between font-normal"
                            >
                              {field.value
                                ? tCat(field.value)
                                : t("fields.category.placeholder")}
                            </Button>
                          }
                        />
                        <ComboboxContent>
                          <ComboboxInput
                            showTrigger={false}
                            placeholder={t("fields.category.search")}
                          />
                          <ComboboxEmpty>No items found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.id} value={item.slug}>
                                {tCat(item.slug)}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Field>
                  <FieldLabel htmlFor="location">
                    {t("fields.location.label")}
                  </FieldLabel>
                  <Input
                    id="location"
                    placeholder={t("fields.location.placeholder")}
                    {...form.register("location")}
                  />
                  <FieldError errors={[form.formState.errors.location]} />
                </Field>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="price">
                    {t("fields.price.label")}
                  </FieldLabel>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    disabled={isFreeSelected}
                    placeholder={t("fields.price.placeholder")}
                    {...form.register("price")}
                  />
                  <FieldError errors={[form.formState.errors.price]} />
                </Field>

                <Field>
                  <FieldLabel>{t("fields.options.label")}</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={isFreeSelected ? "default" : "outline"}
                      onClick={() => {
                        form.setValue("isFree", !isFreeSelected);
                        if (!isFreeSelected) {
                          form.setValue("priceNegotiable", false);
                        }
                      }}
                      className={"capitalize"}
                    >
                      {t("fields.options.free")}
                    </Button>
                    <Button
                      type="button"
                      variant={isNegotiableSelected ? "default" : "outline"}
                      onClick={() =>
                        form.setValue("priceNegotiable", !isNegotiableSelected)
                      }
                      className={"capitalize"}
                      disabled={isFreeSelected}
                    >
                      {t("fields.options.negotiable")}
                    </Button>
                  </div>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="description">
                  {t("fields.description.label")}
                </FieldLabel>
                <Textarea
                  id="description"
                  rows={7}
                  placeholder={t("fields.description.placeholder")}
                  {...form.register("description")}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>{t("checklist.title")}</CardTitle>
            <CardDescription>{t("checklist.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="bg-muted/50 rounded-2xl p-3">
              <p className="font-medium capitalize">
                {t("checklist.quality.title")}
              </p>
              <p className="text-muted-foreground mt-1">
                {t("checklist.quality.body")}
              </p>
            </div>
            <div className="bg-muted/50 rounded-2xl p-3">
              <p className="font-medium capitalize">
                {t("checklist.limit.title")}
              </p>
              <p className="text-muted-foreground mt-1">
                {t("checklist.limit.body", { max: FREE_PLAN_MAX_IMAGES })}
              </p>
            </div>
            <div className="bg-muted/50 rounded-2xl p-3">
              <p className="font-medium capitalize">
                {t("checklist.primary.title")}
              </p>
              <p className="text-muted-foreground mt-1">
                {t("checklist.primary.body")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>{t("images.title")}</CardTitle>
              <CardDescription>{t("images.description")}</CardDescription>
            </div>
            <Badge variant="secondary">
              {t("images.counter", {
                valid: validImageCount,
                max: FREE_PLAN_MAX_IMAGES,
              })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={uploadingImages || reachedImageLimit}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="size-4" />
              {uploadingImages ? t("images.uploading") : t("images.addButton")}
            </Button>
            <FieldDescription className="flex items-center gap-1">
              <Info className="size-4" />
              {t("images.helper", {
                max: FREE_PLAN_MAX_IMAGES,
                maxMb: Math.floor(MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024)),
              })}
            </FieldDescription>
          </div>

          {uploadError && <FieldError>{uploadError}</FieldError>}

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {imageUrls.length === 0 && (
              <div className="text-muted-foreground bg-muted/30 col-span-full rounded-2xl border border-dashed p-8 text-center text-sm">
                <ImagePlus className="mx-auto mb-2 size-5" />
                {t("images.emptyState")}
              </div>
            )}

            {imageUrls.map((imageUrl, index) => (
              <div
                key={`${index}-${imageUrl}`}
                className="bg-muted/30 rounded-2xl border p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant={index === 0 ? "default" : "outline"}>
                    {index === 0 ? (
                      <>
                        <Star className="size-3" /> {t("images.primary")}
                      </>
                    ) : (
                      t("images.imageN", { index: index + 1 })
                    )}
                  </Badge>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeImageSlot(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="bg-background relative aspect-4/3 overflow-hidden rounded-xl border">
                  <Image
                    src={imageUrl}
                    alt={t("images.previewAlt", { index: index + 1 })}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>

          <FieldError className="mt-3">
            {form.formState.errors.imageUrls?.message}
          </FieldError>
        </CardContent>
        <CardFooter className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          {createListingMutation.error ? (
            <FieldError>{createListingMutation.error.message}</FieldError>
          ) : (
            <p className="text-muted-foreground text-sm">{t("footer.note")}</p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={createListingMutation.isPending || uploadingImages}
          >
            {createListingMutation.isPending
              ? t("footer.submitting")
              : t("footer.submit")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
