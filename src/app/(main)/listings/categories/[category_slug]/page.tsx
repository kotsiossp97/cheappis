import { SiteFooter } from "@/components/layout/site-footer";
import ListingBreadcrumb from "@/components/listings/breadcrumb";

export default async function CategoryListingsPage({
  params,
}: {
  params: Promise<{ category_slug: string }>;
}) {
  const { category_slug } = await params;

  return (
    <main className="flex flex-1 flex-col">
      <div className="flex-1 px-4 py-6">
        <div className="container mx-auto">
          <ListingBreadcrumb category_slug={category_slug} />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
