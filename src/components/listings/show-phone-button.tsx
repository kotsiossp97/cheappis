"use client";

import TooltipWrapper from "@/components/reusable/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PhoneInput } from "@/components/ui/phone-input";
import { Phone, PhoneCall } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

interface ShowPhoneButtonProps {
  phoneNumber: string;
}

export default function ShowPhoneButton({ phoneNumber }: ShowPhoneButtonProps) {
  const t = useTranslations("Listing");
  const [shown, setShown] = useState(false);

  return (
    <Collapsible open={shown} onOpenChange={setShown}>
      <CollapsibleTrigger asChild>
        <Button className="capitalize">
          <PhoneCall />
          {t("showPhoneNumber")}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex items-center justify-center gap-2 py-2">
          <div>
            <PhoneInput value={phoneNumber} readOnly disabled />
          </div>
          {/* <span className="text-lg font-semibold">{phoneNumber}</span> */}
          <TooltipWrapper tooltipContent={t("callSeller")}>
            <Link href={`tel:${phoneNumber}`}>
              <Button size="icon-lg">
                <Phone />
              </Button>
            </Link>
          </TooltipWrapper>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
