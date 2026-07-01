import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

interface StarRatingProps extends React.ComponentPropsWithoutRef<"div"> {
  rating?: number;
  maxRating?: number;
  reviewsCount?: number;
  starClassName?: string;
  textClassName?: string;
}

export default function StarRating({
  rating = 0,
  maxRating = 5,
  reviewsCount,
  className,
  starClassName,
  textClassName,
  ...props
}: StarRatingProps) {
  const t = useTranslations("Listing");

  return (
    <div
      className={cn("flex flex-col items-end gap-0.5", className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, index) => {
          const isFilled = index < rating;
          return (
            <Star
              key={index}
              className={cn(
                starClassName,
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-amber-400",
              )}
            />
          );
        })}
      </div>
      {reviewsCount !== undefined && (
        <span className={cn("text-muted-foreground text-xs", textClassName)}>
          {t("basedOnReviews", { reviews: reviewsCount })}
        </span>
      )}
    </div>
  );
}
