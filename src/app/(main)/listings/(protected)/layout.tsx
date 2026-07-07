import React from "react";
import { getSession } from "@/server/better-auth/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/sign-in?next=/listings/new");
  }
  return <>{children}</>;
}
