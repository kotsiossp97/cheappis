"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps extends React.ComponentPropsWithoutRef<
  typeof Tooltip
> {
  tooltipContent?: React.ReactNode;
  asChild?: boolean;
}

export default function TooltipWrapper({
  tooltipContent,
  children,
  asChild = true,
  ...props
}: TooltipWrapperProps) {
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}
