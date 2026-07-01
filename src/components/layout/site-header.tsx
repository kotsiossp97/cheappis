"use client";

import Link from "next/link";
import { HeaderSearch } from "./header-search";
import { Clock, Grid2X2, Menu, PlusCircle, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import LanguageSwitch from "@/components/toggles/language-switch";
import { ThemeSwitch } from "@/components/toggles/theme-switch";
import CheappisLogo from "@/components/reusable/logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

function SiteHeader() {
  const t = useTranslations("SiteHeader");
  const tHome = useTranslations("HomePage");
  const [open, setOpen] = useState(false);

  const closeSheet = () => {
    setOpen(false);
  };

  return (
    <header className="border-border bg-background/80 shadow-primary/35 sticky top-0 z-40 border-b shadow-xl backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <CheappisLogo animated />
        </Link>

        <div className="hidden max-w-md flex-1 sm:block">
          <HeaderSearch />
        </div>

        <div className="flex flex-1 items-center justify-end gap-1 sm:hidden">
          <LanguageSwitch />
          <ThemeSwitch />
          <Link href="/listings/new">
            <Button size="icon" variant="outline" className="text-primary">
              <PlusCircle />
            </Button>
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="sm:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <CheappisLogo />
                </SheetTitle>
              </SheetHeader>
              {/* Buttons */}
              <div className="flex flex-col gap-2 px-4">
                <HeaderSearch />
                <div className="my-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    {t("theme")}
                  </span>
                  <ThemeSwitch />
                  <Separator orientation="vertical" className="mx-2" />
                  <span className="text-muted-foreground text-sm">
                    {t("language")}
                  </span>
                  <LanguageSwitch />
                  <Separator orientation="vertical" className="mx-2" />
                  <span className="text-muted-foreground text-sm">
                    {t("signIn")}
                  </span>
                  <Link href="/sign-in">
                    <Button variant="outline" size="icon">
                      <User />
                    </Button>
                  </Link>
                </div>
                <Link href="/listings/new" onClick={closeSheet}>
                  <Button size="sm" className="w-full">
                    <PlusCircle className="size-4" />
                    {t("postListing")}
                  </Button>
                </Link>
              </div>
              <Separator className="my-5" />
              {/* Links */}
              <div className="flex flex-col gap-4 px-4">
                <Link href="/listings/categories" onClick={closeSheet}>
                  <Button variant="outline" size="lg" className="w-full">
                    <Grid2X2 />
                    {tHome("categories")}
                  </Button>
                </Link>
                <Link href="/listings/?featured=true" onClick={closeSheet}>
                  <Button variant="outline" size="lg" className="w-full">
                    <Sparkles />
                    {tHome("featuredDeals")}
                  </Button>
                </Link>
                <Link href="/listings/?sort=recent" onClick={closeSheet}>
                  <Button variant="outline" size="lg" className="w-full">
                    <Clock />
                    {tHome("recentListings")}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <ThemeSwitch />
          <LanguageSwitch />
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">
              <User className="size-4" />
              {t("signIn")}
            </Button>
          </Link>
          <Link href="/listings/new">
            <Button size="sm">
              <PlusCircle className="size-4" />
              <span className="hidden sm:inline">{t("postListing")}</span>
              <span className="sm:hidden">{t("post")}</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="border-border border-t px-4 py-2 sm:hidden">
        <HeaderSearch />
      </div>
    </header>
  );
}

export default SiteHeader;
