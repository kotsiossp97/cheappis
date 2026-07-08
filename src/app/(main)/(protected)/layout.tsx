"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/server/better-auth/client";
import AppLoadingSpinner from "@/components/layout/app-loading-spinner";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && (!data || !data.user)) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, data, pathname, router]);

  if (isPending) {
    // return null; // or a loading spinner/skeleton
    return <AppLoadingSpinner />;
  }

  if (!data || !data.user) {
    return <AppLoadingSpinner />;
  }

  return <>{children}</>;
}
