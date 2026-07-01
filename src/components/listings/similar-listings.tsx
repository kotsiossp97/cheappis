"use client";

import ListingCard from "@/components/home/listing-card";
import { DUMMY_DATA } from "@/lib/dummy_data";
import { type Listing } from "@/lib/types/listing";
import { useTranslations } from "next-intl";

interface SimilarListingsProps {
  listing: Listing;
}

export default function SimilarListings({ listing }: SimilarListingsProps) {
  const t = useTranslations("Listing");

  const listings = DUMMY_DATA.listings
    .filter(
      (l) => l.categorySlug === listing.categorySlug && l.slug !== listing.slug,
    )
    .sort((l) => (l.featured ? -1 : 1))
    .slice(0, 6);
  return (
    <div>
      <h3 className="text-lg font-semibold">{t("similarListings")}</h3>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {listings.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center text-sm capitalize">
            {t("listing", { count: 0 })}
          </p>
        )}

        {listings.map((l) => (
          <ListingCard key={l.slug} listing={l} />
        ))}
      </div>
    </div>
  );
}
