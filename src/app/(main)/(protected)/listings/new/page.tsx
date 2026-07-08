import { NewListingForm } from "@/components/forms/new-listing-form";

import { Suspense } from "react";
import AppLoadingSpinner from "@/components/layout/app-loading-spinner";
import { getTranslations } from "next-intl/server";

async function NewListingPage() {
  const t = await getTranslations("NewListingForm.page");

  return (
    <Suspense fallback={<AppLoadingSpinner />}>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-sm">{t("subtitle")}</p>
        <NewListingForm />
      </div>
    </Suspense>
  );
}

export default NewListingPage;
