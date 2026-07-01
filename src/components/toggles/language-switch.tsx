"use client";

import changeLocaleAction from "@/i18n/change-locale";
import { SUPPORTED_LOCALES } from "@/i18n/lib";
import { type Locale, useLocale, useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Languages } from "lucide-react";
import Image from "next/image";
import TooltipWrapper from "@/components/reusable/tooltip-wrapper";

const LanguageIcon = ({ locale, name }: { locale: string; name: string }) => {
  return (
    <Image
      src={`/assets/icons/flags/${locale}.png`}
      alt={name}
      width={24}
      height={24}
      unoptimized
      className="h-4 w-4 rounded-sm object-cover"
    />
  );
};

const LanguageSwitch = ({
  showFlagIcon = true,
}: {
  showFlagIcon?: boolean;
}) => {
  const locale = useLocale();
  const currentLanguage = SUPPORTED_LOCALES[locale as Locale];
  const t = useTranslations("SiteHeader");

  return (
    <DropdownMenu>
      <TooltipWrapper tooltipContent={t("language")}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"}>
            {showFlagIcon ? (
              <LanguageIcon locale={locale} name={currentLanguage.text} />
            ) : (
              <Languages />
            )}
          </Button>
        </DropdownMenuTrigger>
      </TooltipWrapper>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {Object.entries(SUPPORTED_LOCALES).map(([key, value]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => changeLocaleAction(key as Locale)}
            >
              <LanguageIcon locale={key} name={value.text} />
              {value.text}
              {locale === key && (
                <span className="text-muted-foreground ml-auto">
                  <Check />
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitch;
