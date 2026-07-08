"use client";

import ListingUserCard from "@/components/listings/listing-user-details";
import TooltipWrapper from "@/components/reusable/tooltip-wrapper";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { type Listing } from "@/lib/types/listing";
import { MapPin, Tag } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

interface ListingDetailsProps {
  listing: Listing;
}

export default function ListingDetails({ listing }: ListingDetailsProps) {
  const format = useFormatter();
  // const tCat = useTranslations("Categories");
  const t = useTranslations("Listing");
  const tDistrict = useTranslations("LocationCombobox.districts");

  const now = new Date();

  const formatPrice = (price?: number | null) => {
    if (listing.isFree) {
      return t("free");
    }
    if (price === null || price === undefined) {
      return t("priceNotAvailable");
    }
    return format.number(price, { style: "currency", currency: "EUR" });
  };

  return (
    <div>
      {listing.featured && <Badge>{t("featured")}</Badge>}
      <h2 className="my-2 text-2xl font-semibold">{listing.title}</h2>
      <div className="my-3 flex flex-wrap gap-2">
        <Badge variant="outline">
          <MapPin />
          {tDistrict(listing.location)}
        </Badge>
        <TooltipWrapper
          tooltipContent={format.dateTime(new Date(listing.createdAt), {
            dateStyle: "long",
            timeStyle: "short",
          })}
        >
          <Badge variant="outline">
            {format.relativeTime(new Date(listing.createdAt), now)}
          </Badge>
        </TooltipWrapper>
      </div>

      <div className="my-5 flex items-center gap-4">
        <span className="text-primary text-3xl font-medium">
          {formatPrice(listing.price)}
        </span>

        {listing.priceNegotiable && (
          <Badge
            variant="ghost"
            className="text-muted-foreground text-xs capitalize"
          >
            <Tag />
            {t("priceNegotiable")}
          </Badge>
        )}
      </div>
      <Separator className="my-5" />
      <h3 className="mb-2 text-lg font-semibold">{t("description")}</h3>
      {listing?.description || listing?.description === "" ? (
        <p className="mt-4">{listing.description}</p>
      ) : (
        <p className="text-muted-foreground mt-4 text-center text-sm">
          {t("descriptionNotAvailable")}
        </p>
      )}

      <Separator className="my-5" />

      <ListingUserCard listing={listing} />
    </div>
  );
}
