"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FREE_PLAN_MAX_IMAGES } from "@/lib/listing-image-constraints";
import { useTranslations } from "next-intl";

export default function NewListingChecklist() {
  const t = useTranslations("NewListingForm");

  return (
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
          <p className="font-medium capitalize">{t("checklist.limit.title")}</p>
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
  );
}
