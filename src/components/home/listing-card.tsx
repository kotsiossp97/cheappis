import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export type ListingCardListing = {
  slug: string;
  title: string;
  price: number | null;
  isFree: boolean;
  location: string;
  createdAt: Date | string;
  featured: boolean;
  category: {
    slug: string;
  };
  images: Array<{
    url: string;
  }>;
};

interface ListingCardProps {
  listing: ListingCardListing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const format = useFormatter();
  const tCat = useTranslations("Categories");
  const tDistrict = useTranslations("LocationCombobox.districts");

  const t = useTranslations("Listing");

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
    <Link
      href={`/listings/categories/${listing.category.slug}/${listing.slug}`}
      className="group border-border bg-card focus-visible:ring-ring flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="bg-muted relative aspect-4/3 overflow-hidden">
        <Image
          src={listing.images?.[0]?.url || "/assets/hero_bg.png"}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {listing.featured && (
          <Badge className="absolute top-2 left-2" variant={"default"}>
            {t("featured")}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-foreground text-lg leading-tight font-bold">
          {formatPrice(listing.price)}
        </p>
        <h3 className="text-foreground line-clamp-2 text-sm leading-snug font-medium">
          {listing.title}
        </h3>
        <div className="text-muted-foreground mt-auto flex items-center gap-1 pt-2 text-xs">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{tDistrict(listing.location)}</span>
          <span aria-hidden="true">·</span>
          <span className="shrink-0">
            {format.relativeTime(new Date(listing.createdAt), now)}
          </span>
        </div>
        <span className="text-muted-foreground text-xs">
          {tCat(listing.category.slug)}
        </span>
      </div>
    </Link>
  );
}
