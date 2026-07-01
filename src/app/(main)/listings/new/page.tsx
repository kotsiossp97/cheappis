import { NewListingForm } from "@/components/forms/new-listing-form";
import { getTranslations } from "next-intl/server";

async function NewAdPage() {
  const t = await getTranslations("NewListingForm.page");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm">{t("subtitle")}</p>
      <NewListingForm />
    </div>
  );
}

export default NewAdPage;
