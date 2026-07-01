"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "motion/react";

interface CheappisLogoProps {
  containerClassName?: string;
  imageClassName?: string;
  textClassName?: string;
  animated?: boolean;
}

function CheappisLogo({
  containerClassName,
  imageClassName,
  textClassName,
  animated = true,
}: CheappisLogoProps) {
  return (
    <div
      className={cn(
        "font-cheappis-logo flex items-center font-bold",
        containerClassName,
      )}
    >
      {animated ? (
        <motion.img
          src="/logos/cheappis_monogram.svg"
          alt="Cheapππης Logo"
          width={32}
          height={32}
          className={cn("size-10", imageClassName)}
          initial={{ rotate: 0 }}
          animate={{
            rotate: [0, 360],
            transition: { duration: 1.5, ease: "anticipate" },
          }}
        />
      ) : (
        <Image
          src="/logos/cheappis_monogram.svg"
          alt="Cheapππης Logo"
          width={32}
          height={32}
          className={cn("size-10", imageClassName)}
        />
      )}
      <span className={cn("font-cheappis-logo text-xl", textClassName)}>
        Chea<span className="text-cheappis">ππης</span>
      </span>
    </div>
  );
}

export default CheappisLogo;
