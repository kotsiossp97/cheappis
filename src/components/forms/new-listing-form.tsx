"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Info, Star, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Value } from "platejs";
import { type ChangeEvent, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";

import {
  FREE_PLAN_MAX_IMAGES,
  MAX_IMAGE_FILE_SIZE_BYTES,
  SUPPORTED_IMAGE_MIME_TYPES,
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
import { api } from "@/trpc/react";
import NewListingChecklist from "@/components/forms/new-listing-checklist";
import LocationCombobox from "@/components/forms/location-combobox";
import CategoryCombobox from "@/components/forms/category-combobox";
import ListingEditor from "@/components/reusable/editor/listing-editor";

const MAX_DESCRIPTION_TEXT_LENGTH = 5000;

const getDefaultDescriptionValue = (): Value => [
  {
    type: "p",
    children: [{ text: "" }],
  },
];

const extractPlainTextFromSlateNode = (node: unknown): string => {
  if (!node || typeof node !== "object") {
    return "";
  }

  const record = node as Record<string, unknown>;
  const ownText = typeof record.text === "string" ? record.text : "";
  const children = Array.isArray(record.children) ? record.children : [];

  return ownText + children.map(extractPlainTextFromSlateNode).join("");
};

const getPlainTextFromSlateValue = (value: unknown): string => {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.map(extractPlainTextFromSlateNode).join("");
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
    description: z.array(z.any()).superRefine((value, ctx) => {
      if (
        getPlainTextFromSlateValue(value).trim().length >
        MAX_DESCRIPTION_TEXT_LENGTH
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("errors.descriptionTooLong"),
        });
      }
    }),
    price: z.string().trim().optional(),
    isFree: z.boolean(),
    priceNegotiable: z.boolean(),
  });

type NewListingFormValues = {
  title: string;
  categorySlug: string;
  location: string;
  description: Value;
  price?: string;
  isFree: boolean;
  priceNegotiable: boolean;
};

type SelectedImage = {
  file: File;
  previewUrl: string;
};

export function NewListingForm() {
  const t = useTranslations("NewListingForm");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const schema = useMemo(() => createSchema(t), [t]);

  const createListingMutation = api.listing.create.useMutation();
  const attachImagesMutation = api.listing.attachImages.useMutation();

  const form = useForm<NewListingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      categorySlug: "",
      location: "",
      description: getDefaultDescriptionValue(),
      price: "",
      isFree: false,
      priceNegotiable: false,
    },
    mode: "onBlur",
  });

  const isFreeSelected =
    useWatch({ control: form.control, name: "isFree" }) ?? false;
  const isNegotiableSelected =
    useWatch({ control: form.control, name: "priceNegotiable" }) ?? false;

  const validImageCount = selectedImages.length;
  const reachedImageLimit = selectedImages.length >= FREE_PLAN_MAX_IMAGES;

  const removeImageSlot = (index: number) => {
    setSelectedImages((current) => {
      const imageToRemove = current[index];
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return current.filter((_, currentIndex) => currentIndex !== index);
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

  const onChooseImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const availableSlots = FREE_PLAN_MAX_IMAGES - selectedImages.length;

    if (availableSlots <= 0) {
      setUploadError(t("errors.tooManyImages", { max: FREE_PLAN_MAX_IMAGES }));
      event.target.value = "";
      return;
    }

    const acceptedFiles = files.slice(0, availableSlots);

    if (
      acceptedFiles.some(
        (file) =>
          !SUPPORTED_IMAGE_MIME_TYPES.includes(
            file.type as (typeof SUPPORTED_IMAGE_MIME_TYPES)[number],
          ),
      )
    ) {
      setUploadError(t("errors.unsupportedFileType"));
      event.target.value = "";
      return;
    }

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
    const newImages = acceptedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedImages((current) => [...current, ...newImages]);
    event.target.value = "";
  };

  const onSubmit = async (values: NewListingFormValues) => {
    if (selectedImages.length === 0) {
      setUploadError(t("errors.noImagesSelected"));
      return;
    }

    const parsedPrice = values.price?.trim() ? Number(values.price) : null;

    if (Number.isNaN(parsedPrice)) {
      form.setError("price", {
        message: t("errors.invalidPrice"),
      });
      return;
    }

    setUploadError(null);
    setUploadingImages(true);

    const descriptionText = getPlainTextFromSlateValue(
      values.description,
    ).trim();

    try {
      const listing = await createListingMutation.mutateAsync({
        title: values.title,
        categorySlug: values.categorySlug,
        location: values.location,
        description:
          descriptionText.length > 0 ? values.description : undefined,
        price: values.isFree ? null : parsedPrice,
        isFree: values.isFree,
        priceNegotiable: values.priceNegotiable,
      });

      const payload = new FormData();
      payload.append("listingId", listing.id);

      for (const image of selectedImages) {
        payload.append("files", image.file);
      }

      const uploadResponse = await fetch("/api/uploads/listing-images", {
        method: "POST",
        body: payload,
      });

      const uploadData = (await uploadResponse.json()) as
        { urls?: string[]; errorKey?: string } | undefined;

      if (!uploadResponse.ok || !uploadData?.urls) {
        setUploadError(getUploadErrorMessage(uploadData?.errorKey));
        return;
      }

      const updatedListing = await attachImagesMutation.mutateAsync({
        listingId: listing.id,
        imageUrls: uploadData.urls,
      });

      for (const image of selectedImages) {
        URL.revokeObjectURL(image.previewUrl);
      }
      setSelectedImages([]);

      router.push(
        `/listings/categories/${updatedListing.categorySlug}/${updatedListing.slug}`,
      );
    } catch {
      setUploadError(t("errors.uploadFailed"));
    } finally {
      setUploadingImages(false);
    }
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
                <CategoryCombobox form={form} name="categorySlug" />

                <LocationCombobox form={form} name="location" />
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

              <Controller
                control={form.control}
                name="description"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="description">
                      {t("fields.description.label")}
                    </FieldLabel>
                    <div>
                      <ListingEditor
                        initialValue={field.value}
                        onChange={(value) => field.onChange(value)}
                        placeholder={t("fields.description.placeholder")}
                      />
                    </div>
                    <FieldError errors={[form.formState.errors.description]} />
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <NewListingChecklist />
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
            {selectedImages.length === 0 && (
              <div className="text-muted-foreground bg-muted/30 col-span-full rounded-2xl border border-dashed p-8 text-center text-sm">
                <ImagePlus className="mx-auto mb-2 size-5" />
                {t("images.emptyState")}
              </div>
            )}

            {selectedImages.map((image, index) => (
              <div
                key={`${index}-${image.previewUrl}`}
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
                    src={image.previewUrl}
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
        </CardContent>
        <CardFooter className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          {createListingMutation.error || attachImagesMutation.error ? (
            <FieldError>
              {attachImagesMutation.error?.message ??
                createListingMutation.error?.message}
            </FieldError>
          ) : (
            <p className="text-muted-foreground text-sm">{t("footer.note")}</p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={
              createListingMutation.isPending ||
              attachImagesMutation.isPending ||
              uploadingImages
            }
          >
            {createListingMutation.isPending ||
            attachImagesMutation.isPending ||
            uploadingImages
              ? t("footer.submitting")
              : t("footer.submit")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
