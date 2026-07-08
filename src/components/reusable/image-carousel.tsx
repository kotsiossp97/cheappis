"use client";

import CarouselPreview from "@/components/reusable/carousel-preview";
import TooltipWrapper from "@/components/reusable/tooltip-wrapper";
import { ZoomBubbleImage } from "@/components/reusable/zoom-bubble-image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Fullscreen, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";

interface ImageCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[];
  listingTitle: string;
  minimizedClassName?: string;
}

export default function ImageCarousel({
  images,
  listingTitle,
  className,
  minimizedClassName = "max-w-lg md:max-w-4xl",
  ...props
}: ImageCarouselProps) {
  const t = useTranslations("Listing");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenToggle = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsFullscreen(false);
      }
    },
    [],
  );

  return (
    <>
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogPortal>
          <DialogOverlay className="z-40" />
        </DialogPortal>
      </Dialog>

      <div
        className={cn(
          isFullscreen && "fixed inset-0 z-50 p-4 md:p-8",
          !isFullscreen && minimizedClassName,
          !isFullscreen && className,
        )}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <Carousel>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div
                  className={cn(
                    "bg-muted/75 overflow-hidden rounded-xl supports-backdrop-filter:backdrop-blur-sm",
                    isFullscreen ? "h-[90svh]" : "aspect-3/2",
                  )}
                >
                  <ZoomBubbleImage
                    src={image}
                    alt={`Image ${index + 1} of ${listingTitle}`}
                    className={cn("h-full w-full object-contain")}
                    bubbleSize={isFullscreen ? 250 : 150}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className={cn("left-4", "bg-secondary/50")}
            variant={"secondary"}
          />

          <CarouselNext
            className={cn("right-4", "bg-secondary/50")}
            variant={"secondary"}
          />

          <CarouselPreview />

          <div className="absolute top-2 right-2 z-20">
            <TooltipWrapper
              tooltipContent={
                <span className="capitalize">
                  {t(isFullscreen ? "close" : "fullscreen")}
                </span>
              }
            >
              <Button
                size="icon"
                className={cn(
                  isFullscreen && "rounded-full p-5",
                  "bg-secondary/80",
                )}
                variant="secondary"
                onClick={handleFullscreenToggle}
                autoFocus
              >
                {isFullscreen ? <X /> : <Fullscreen />}
              </Button>
            </TooltipWrapper>
          </div>
        </Carousel>
      </div>
    </>
  );
}
