"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface HeaderSearchProps {
  defaultValue?: string;
  placeholderKey?: "search" | "search2";
}

export function HeaderSearch({
  defaultValue = "",
  placeholderKey = "search",
}: HeaderSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const t = useTranslations("SiteHeader");

  function onSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.push(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form onSubmit={onSubmit} className="relative w-full" role="search">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t(placeholderKey)}
        aria-label={t(placeholderKey)}
        className="h-10 pl-9"
        aria-autocomplete="none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        enterKeyHint="search"
        role="searchbox"
      />
    </form>
  );
}
