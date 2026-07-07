"use client";

import { SkeletonAvatar } from "@/components/reusable/skeleton-avatar";
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
import { api } from "@/trpc/react";
import { ChartColumn, Eye, LogOut, Newspaper, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function HeaderUserMenu() {
  const t = useTranslations("SiteHeader");
  const { useSession, signOut } = authClient;
  const { data: session, isPending } = useSession();
  const { data: user, isLoading } = api.auth.me.useQuery();

  if (isPending) {
    return <SkeletonAvatar />;
  }

  if (!session)
    return (
      <Link href="/sign-in">
        <Button variant="ghost" size="sm">
          <User className="size-4" />
          {t("signIn")}
        </Button>
      </Link>
    );

  if (isLoading) {
    return <SkeletonAvatar />;
  }

  if (!user) {
    return (
      <Link href="/sign-in">
        <Button variant="ghost" size="sm">
          <User className="size-4" />
          {t("signIn")}
        </Button>
      </Link>
    );
  }

  const handleLogOut = () => {
    signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Avatar>
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>
            {getUserInitials(user.name, user?.surname)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Listings</DropdownMenuLabel>
          <DropdownMenuItem>
            <Newspaper />
            My Listings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Eye />
            Watchlist
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <User /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ChartColumn />
            Statistics
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogOut}>
          <LogOut />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
