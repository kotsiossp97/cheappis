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
import Link from "next/link";

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
              <BreadcrumbLink asChild>
                <Link href="/">{tPages("home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/listings">{t("listing", { count: 2 })}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {category_slug && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/listings/categories/${category_slug}`}>
                  {tCat(category_slug)}
                </Link>
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
