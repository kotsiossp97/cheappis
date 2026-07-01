import { SiteFooter } from "@/components/layout/site-footer";
import ListingCard from "@/components/home/listing-card";
import ListingBreadcrumb from "@/components/listings/breadcrumb";
import { api } from "@/trpc/server";

export default async function CategoryListingsPage({
  params,
}: {
  params: Promise<{ category_slug: string }>;
}) {
  const { category_slug } = await params;
  const listings = await api.listing.getByCategory({
    categorySlug: category_slug,
    limit: 48,
  });

  return (
    <main className="flex flex-1 flex-col">
      <div className="flex-1 px-4 py-6">
        <div className="container mx-auto">
          <ListingBreadcrumb category_slug={category_slug} />

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {listings.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center text-sm">
                No listings found for this category.
              </p>
            )}
            {listings.map((listing) => (
              <ListingCard key={listing.slug} listing={listing} />
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
