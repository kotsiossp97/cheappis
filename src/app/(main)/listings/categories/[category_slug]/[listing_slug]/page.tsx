import { SiteFooter } from "@/components/layout/site-footer";
import ListingBreadcrumb from "@/components/listings/breadcrumb";
import ListingDetails from "@/components/listings/listing-details";
import SimilarListings from "@/components/listings/similar-listings";
import ImageCarousel from "@/components/reusable/image-carousel";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ category_slug: string; listing_slug: string }>;
}) {
  const { category_slug, listing_slug } = await params;

  const listing = await api.listing.getBySlug({
    categorySlug: category_slug,
    listingSlug: listing_slug,
  });

  if (!listing) {
    notFound();
  }

  const similarListings = await api.listing.getSimilar({
    categorySlug: category_slug,
    excludeSlug: listing.slug,
    limit: 6,
  });

  return (
    <main className="flex flex-1 flex-col">
      <div className="flex-1 px-4 py-6">
        <div className="container mx-auto">
          <ListingBreadcrumb category_slug={category_slug} listing={listing} />

          <div className="mt-3 grid grid-cols-1 gap-4 md:mt-6 lg:gap-7 xl:grid-cols-7">
            <div className="col-span-1 xl:col-span-4">
              {/* Image Carousel */}
              <ImageCarousel
                // className="mt-6"
                minimizedClassName=""
                images={listing.images}
                listingTitle={listing.title}
              />
            </div>

            <div className="col-span-1 xl:col-span-3">
              <ListingDetails listing={listing} />
            </div>
          </div>

          <Separator className="my-6 md:my-8" />

          <SimilarListings listings={similarListings} />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
