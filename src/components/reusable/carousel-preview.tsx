import { useCarousel } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function CarouselPreview() {
  const { api } = useCarousel();
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (!api) return;
    const nodes = api.slideNodes();
    const imgs = nodes.map((node) => {
      const img = node.querySelector("img");
      return img?.getAttribute("src") ?? "";
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (imgs) setThumbs(imgs);
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const update = () => setCurrentSlide(api.selectedScrollSnap() ?? 0);

    update(); // initial
    api.on("select", update);

    return () => {
      api.off("select", update);
    };
  }, [api]);

  return (
    <div className="bg-card/10 absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 space-x-2 rounded-xl px-3 py-2">
      {thumbs.map((src, index) => (
        <button
          key={index}
          onClick={() => api?.scrollTo(index)}
          className={cn(
            "bg-muted/10 aspect-square overflow-hidden rounded-xl opacity-40 transition hover:scale-105",
            {
              "opacity-100": currentSlide === index,
            },
          )}
        >
          <Image
            src={src}
            width={48}
            height={48}
            unoptimized
            className="aspect-square h-10 object-cover"
            alt={`Thumbnail ${index + 1}`}
          />
        </button>
      ))}
    </div>
  );
}
