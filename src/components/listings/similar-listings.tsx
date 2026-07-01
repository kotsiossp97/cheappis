"use client";

import ListingCard from "@/components/home/listing-card";
import { type Listing } from "@/lib/types/listing";
import { useTranslations } from "next-intl";

interface SimilarListingsProps {
  listings: Listing[];
}

export default function SimilarListings({ listings }: SimilarListingsProps) {
  const t = useTranslations("Listing");

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
