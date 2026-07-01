"use client";

import React from "react";
import Image from "next/image";
import * as LucideIcons from "lucide-react";

type IconImageRenderProps = {
  source: string;
  size?: number;
  alt?: string;
  className?: string;
};

const IconImageRender = ({
  source,
  size = 24,
  alt = "",
  className,
}: IconImageRenderProps) => {
  const isUrl = /^https?:\/\//i.test(source);
  const isBase64 = /^data:image\/[a-zA-Z]+;base64,/i.test(source);

  // Try to resolve Lucide icon
  const LucideIcon = LucideIcons[source as keyof typeof LucideIcons] as
    React.FC<React.SVGProps<SVGSVGElement>> | undefined;

  // URL or Base64 → render <Image>
  if (isUrl || isBase64) {
    return (
      <Image
        src={source}
        alt={alt}
        width={size}
        height={size}
        className={className}
      />
    );
  }

  // Lucide icon → render icon component
  if (LucideIcon) {
    return <LucideIcon className={className} />;
  }

  // Fallback: unknown string
  return (
    <div
      className={`flex items-center justify-center rounded ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      ?
    </div>
  );
};

export default IconImageRender;
