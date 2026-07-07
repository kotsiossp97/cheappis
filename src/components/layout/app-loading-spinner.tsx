"use client";

import Image from "next/image";

export default function AppLoadingSpinner() {
  return (
    <div className="bg-background/30 flex h-screen flex-col items-center justify-center">
      <div className="aspect-square w-28 animate-pulse ease-in-out sm:w-48">
        <Image
          src={"/logos/cheappis_monogram.svg"}
          alt="Cheappis Monogram"
          width={100}
          height={100}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
