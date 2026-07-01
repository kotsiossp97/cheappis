import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { type Listing } from "@/lib/types/listing";
import { useTranslations } from "next-intl";

interface ListingBreadcrumbProps {
  category_slug?: string;
  listing?: Listing;
}

export default function ListingBreadcrumb({
  category_slug,
  listing,
}: ListingBreadcrumbProps) {
  const t = useTranslations("Listing");
  const tCat = useTranslations("Categories");
  const tPages = useTranslations("Pages");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {!category_slug && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{tPages("home")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbLink href="/listings">
            {t("listing", { count: 2 })}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {category_slug && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/listings/categories/${category_slug}`}>
                {tCat(category_slug)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        {listing && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{listing.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
