import { SiteFooter } from "@/components/layout/site-footer";
import ListingBreadcrumb from "@/components/listings/breadcrumb";

export default function ListingsPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="flex-1 px-4 py-6">
        <div className="container mx-auto">
          <ListingBreadcrumb />
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
