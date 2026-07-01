"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import TooltipWrapper from "@/components/reusable/tooltip-wrapper";

export function ThemeSwitch() {
  const { setTheme } = useTheme();
  const t = useTranslations("SiteHeader");

  const cycleThemes = () => {
    setTheme((prevTheme) => {
      if (prevTheme === "light") return "dark";
      if (prevTheme === "dark") return "light";
      return "system";
    });
  };

  return (
    <TooltipWrapper tooltipContent={t("theme")}>
      <Button variant="outline" size="icon" onClick={cycleThemes}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </TooltipWrapper>
  );
}
