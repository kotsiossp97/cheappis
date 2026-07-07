import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { CompleteProfileForm } from "@/components/forms/complete-profile-form";
import { getSession } from "@/server/better-auth/server";
import { db } from "@/server/db";

export default async function CompleteProfilePage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/sign-in?next=/complete-profile");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      onboardingCompleted: true,
      name: true,
      surname: true,
      phone: true,
    },
  });

  if (user?.onboardingCompleted && user.name && user.surname && user.phone) {
    redirect("/");
  }

  const t = await getTranslations("CompleteProfilePage");

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{t("subtitle")}</p>
      <CompleteProfileForm />
    </div>
  );
}
