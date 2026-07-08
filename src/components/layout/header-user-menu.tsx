"use client";

import { useUserContext } from "@/components/context/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserInitials } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";
import { ChartColumn, Eye, LogOut, Newspaper, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface HeaderUserMenuProps {
  variant?: "default" | "mobile";
}

export default function HeaderUserMenu({
  variant = "default",
}: HeaderUserMenuProps) {
  const t = useTranslations("SiteHeader");
  const tMenu = useTranslations("SiteHeader.userMenu");

  const { signOut } = authClient;
  const { user, isPending, error } = useUserContext();

  if ((!isPending && error) || !user || isPending) {
    return variant === "mobile" ? (
      <>
        <span className="text-muted-foreground text-sm">{t("signIn")}</span>
        <Button variant="outline" size="icon" asChild disabled={isPending}>
          <Link href="/sign-in">
            <User className="size-4" />
          </Link>
        </Button>
      </>
    ) : (
      <Button variant="ghost" size="sm" asChild disabled={isPending}>
        <Link href="/sign-in">
          <User className="size-4" />
          {t("signIn")}
        </Link>
      </Button>
    );
  }

  const handleLogOut = () => {
    signOut();
  };

  return (
    <>
      {variant === "mobile" && (
        <span className="text-muted-foreground text-sm">{t("account")}</span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <Avatar>
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>
              {getUserInitials(user.name, user?.surname)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-fit">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{tMenu("listings")}</DropdownMenuLabel>
            <Link href="/listings/user">
              <DropdownMenuItem>
                <Newspaper />
                {tMenu("myListings")}
              </DropdownMenuItem>
            </Link>
            <Link href="/listings/watchlist">
              <DropdownMenuItem>
                <Eye />
                {tMenu("watchlist")}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>{tMenu("myAccount")}</DropdownMenuLabel>
            <Link href="/account/profile">
              <DropdownMenuItem>
                <User /> {tMenu("profile")}
              </DropdownMenuItem>
            </Link>
            <Link href="/account/statistics">
              <DropdownMenuItem>
                <ChartColumn />
                {tMenu("statistics")}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleLogOut}>
            <LogOut />
            {tMenu("signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
