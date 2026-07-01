/* eslint-disable react-hooks/refs */
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";

interface ZoomBubbleImageProps extends React.ComponentProps<typeof Image> {
  bubbleSize?: number;
  zoomFactor?: number;
}

export function ZoomBubbleImage({
  src,
  alt,
  className,
  bubbleSize = 160,
  zoomFactor = 2.5,
}: ZoomBubbleImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const lastTap = useRef<number>(0);

  const toggleZoom = useCallback(() => setActive((v) => !v), []);
  const handleDoubleClick = useCallback(() => toggleZoom(), [toggleZoom]);

  const handleTouchStart = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) toggleZoom();
    lastTap.current = now;
  }, [toggleZoom]);

  const updatePos = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: clientX - rect.left, y: clientY - rect.top });
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      updatePos(e.clientX, e.clientY);
    },
    [updatePos],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!active || e.touches.length === 0) return;
      e.preventDefault();
      updatePos(e.touches[0].clientX, e.touches[0].clientY);
    },
    [active, updatePos],
  );

  const handleMouseLeave = useCallback(() => {
    if (active) setActive(false);
  }, [active]);

  const half = bubbleSize / 2;
  const containerRect = containerRef?.current?.getBoundingClientRect();
  const containerW = containerRect?.width ?? 0;
  const containerH = containerRect?.height ?? 0;

  // object-contain letterboxes the image. The <img> element's getBoundingClientRect
  // returns the element box (= container size), NOT the rendered pixel area.
  // We must compute the rendered rect from the image's natural aspect ratio.
  const img = imgRef?.current;
  const naturalW = img?.naturalWidth ?? 1920;
  const naturalH = img?.naturalHeight ?? 1080;
  const naturalAspect = naturalW / naturalH;
  const containerAspect = containerW / (containerH || 1);

  // Which axis is the constraining one for object-contain?
  let renderedW: number;
  let renderedH: number;
  if (naturalAspect > containerAspect) {
    // Image is wider than container aspect → constrained by width
    renderedW = containerW;
    renderedH = containerW / naturalAspect;
  } else {
    // Image is taller → constrained by height
    renderedH = containerH;
    renderedW = containerH * naturalAspect;
  }

  // Letterbox offsets (image is centered inside the element by object-contain)
  const offsetX = (containerW - renderedW) / 2;
  const offsetY = (containerH - renderedH) / 2;

  // Cursor position relative to the rendered image pixels
  const imgPosX = pos.x - offsetX;
  const imgPosY = pos.y - offsetY;

  // background-size matches the rendered image scaled up by zoomFactor
  const bgW = renderedW * zoomFactor;
  const bgH = renderedH * zoomFactor;

  // background-position: shift so the pixel under cursor is at bubble center
  const bgX = half - imgPosX * zoomFactor;
  const bgY = half - imgPosY * zoomFactor;

  const clampedX = Math.max(half, Math.min(pos.x, containerW - half));
  const clampedY = Math.max(half, Math.min(pos.y, containerH - half));

  const srcString =
    typeof src === "string" ? src : (src as { src: string }).src;

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full touch-none select-none")}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        className={cn("h-auto w-full object-contain", className)}
        draggable={false}
      />

      {active && (
        <div
          aria-hidden
          className="border-border pointer-events-none absolute rounded-full border-2 drop-shadow-xl"
          style={{
            width: bubbleSize,
            height: bubbleSize,
            left: clampedX - half,
            top: clampedY - half,
            backgroundImage: `url(${srcString})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${bgW}px ${bgH}px`,
            backgroundPosition: `${bgX}px ${bgY}px`,
          }}
        />
      )}
    </div>
  );
}
