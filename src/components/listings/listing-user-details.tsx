"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useFormatter, useTranslations } from "next-intl";
import { type Listing } from "@/lib/types/listing";
import TooltipWrapper from "@/components/reusable/tooltip-wrapper";
import { BadgeCheck, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import StarRating from "@/components/reusable/star-rating";
import { Button } from "@/components/ui/button";
import ShowPhoneButton from "@/components/listings/show-phone-button";
import { getUserInitials } from "@/lib/utils";

interface ListingUserCardProps {
  listing: Listing;
}

export default function ListingUserCard({ listing }: ListingUserCardProps) {
  const format = useFormatter();
  const t = useTranslations("Listing");
  const now = new Date();

  return (
    <Card className="">
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Avatar size="lg">
            <AvatarImage src={listing.user.image ?? undefined} />
            <AvatarFallback>
              {getUserInitials(listing.user.name, listing.user.surname)}
            </AvatarFallback>
            <AvatarBadge className="bg-green-600" />
          </Avatar>
          <div className="flex items-center">
            <p className="flex flex-col">
              <span className="font-semibold capitalize">
                {listing.user.name}{" "}
                {listing.user?.surname?.charAt(0).toUpperCase()}.
              </span>

              <TooltipWrapper
                tooltipContent={format.dateTime(
                  new Date(listing.user.createdAt),
                  {
                    dateStyle: "long",
                    timeStyle: "short",
                  },
                )}
              >
                <span className="text-muted-foreground text-xs">
                  {t("memberSince", {
                    relativeTime: format.relativeTime(
                      new Date(listing.createdAt),
                      now,
                    ),
                  })}
                </span>
              </TooltipWrapper>
            </p>
            {listing.user.verified && (
              <span className="bg-primary text-primary-foreground ml-2 self-center rounded-full p-1 transition hover:scale-110 hover:rotate-360">
                <TooltipWrapper tooltipContent={t("verifiedSeller")}>
                  <BadgeCheck className="size-5" />
                </TooltipWrapper>
              </span>
            )}
          </div>

          <Separator orientation="vertical" className="mx-1 md:mx-2" />

          <div className="flex flex-1 flex-col items-end gap-1">
            <StarRating
              rating={3.435}
              starClassName="size-4 md:size-5"
              reviewsCount={32}
              className="text-end"
              textClassName="text-[0.7rem]"
            />
          </div>
        </div>
        <Separator className="my-3" />
        <div className="mt-5 space-y-4 text-center">
          <ShowPhoneButton phoneNumber={"+35799123456"} />
          <Button className="capitalize" variant={"secondary"}>
            <MessageCircle />
            {t("messageSeller")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
