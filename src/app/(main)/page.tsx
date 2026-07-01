import { CategoryGrid } from "@/components/home/category-grid";
import { Hero } from "@/components/home/hero";
import ListingCard from "@/components/home/listing-card";
import { SiteFooter } from "@/components/layout/site-footer";
import { DUMMY_DATA } from "@/lib/dummy_data";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { HydrateClient } from "@/trpc/server";

export default function Home() {
  const t = useTranslations("HomePage");
  const featured = DUMMY_DATA.listings.filter((listing) => listing.featured);
  const recent = DUMMY_DATA.listings
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
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
                {t("featuredDeals")}
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
              {featured.map((ad, i) => (
                <ListingCard key={`featured-${i}`} listing={ad} />
              ))}
            </div>
          </section>

          <section aria-labelledby="recent-heading" className="mt-12">
            <div className="mb-4 flex items-center justify-between gap-1">
              <h2
                id="recent-heading"
                className="text-xl font-semibold tracking-tight"
              >
                {t("recentListings")}
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
              {recent.slice(0, 8).map((ad) => (
                <ListingCard key={ad.slug} listing={ad} />
              ))}
            </div>
          </section>
        </div>

        <SiteFooter />
      </main>
    </HydrateClient>
  );
}
