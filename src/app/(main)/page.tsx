import { CategoryGrid } from "@/components/home/category-grid";
import { Hero } from "@/components/home/hero";
import ListingCard from "@/components/home/listing-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { api } from "@/trpc/server";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  const t = await getTranslations("HomePage");
  const [featured, recent] = await Promise.all([
    api.listing.getFeatured({ limit: 8 }),
    api.listing.getRecent({ limit: 8 }),
  ]);

  return (
    <HydrateClient>
      <main>
        <Hero />

        <div className="mx-auto max-w-7xl px-4 py-12">
          <section aria-labelledby="categories-heading">
            <div className="mb-4 flex items-center justify-between gap-1">
              <h2
                id="categories-heading"
                className="text-xl font-semibold tracking-tight"
              >
                {t("categories")}
              </h2>
              <Link
                href="/categories"
                className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
              >
                {t("viewAll")}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <CategoryGrid />
          </section>

          <section aria-labelledby="featured-heading" className="mt-12">
            <div className="mb-4 flex items-center justify-between gap-1">
              <h2
                id="featured-heading"
                className="text-xl font-semibold tracking-tight"
              >
                {t("featuredDeals", { count: 2 })}
              </h2>
              <Link
                href="/listings/?featured=true"
                className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
              >
                {t("viewAll")}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center text-sm">
                  {t("featuredDeals", { count: 0 })}
                </p>
              )}
              {featured.map((listing) => (
                <ListingCard key={listing.slug} listing={listing} />
              ))}
            </div>
          </section>

          <section aria-labelledby="recent-heading" className="mt-12">
            <div className="mb-4 flex items-center justify-between gap-1">
              <h2
                id="recent-heading"
                className="text-xl font-semibold tracking-tight"
              >
                {t("recentListings", { count: 2 })}
              </h2>
              <Link
                href="/listings/?sort=recent"
                className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
              >
                {t("viewAll")}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {recent.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center text-sm">
                  {t("recentListings", { count: 0 })}
                </p>
              )}
              {recent.map((listing) => (
                <ListingCard key={listing.slug} listing={listing} />
              ))}
            </div>
          </section>
        </div>

        <SiteFooter />
      </main>
    </HydrateClient>
  );
}
