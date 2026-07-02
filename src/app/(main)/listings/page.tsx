import { SiteFooter } from "@/components/layout/site-footer";
import ListingBreadcrumb from "@/components/listings/breadcrumb";
import ListingCard from "@/components/home/listing-card";
import { api } from "@/trpc/server";

const asString = (value: string | string[] | undefined) =>
  typeof value === "string" ? value : undefined;

const asNumber = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return undefined;
  }

  return numberValue;
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Math.max(1, asNumber(asString(params.page)) ?? 1);
  const pageSize = 24;
  const q = asString(params.q);
  const categorySlug = asString(params.category);
  const sort = asString(params.sort);
  const featured = asString(params.featured);

  const [categories, listingsResult] = await Promise.all([
    api.category.list(),
    api.listing.list({
      q,
      categorySlug,
      minPrice: asNumber(asString(params.minPrice)),
      maxPrice: asNumber(asString(params.maxPrice)),
      featured:
        featured === "true" ? true : featured === "false" ? false : undefined,
      sort:
        sort === "priceAsc" || sort === "priceDesc" || sort === "recent"
          ? sort
          : "recent",
      page,
      pageSize,
    }),
  ]);

  return (
    <main className="flex flex-1 flex-col">
      <div className="flex-1 px-4 py-6">
        <div className="container mx-auto">
          <ListingBreadcrumb />

          <form className="mt-5 grid grid-cols-1 gap-3 rounded-xl border p-4 md:grid-cols-2 lg:grid-cols-5">
            <input
              className="rounded-md border px-3 py-2 text-sm"
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search listings"
            />
            <select
              className="rounded-md border px-3 py-2 text-sm"
              name="category"
              defaultValue={categorySlug ?? ""}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border px-3 py-2 text-sm"
              name="sort"
              defaultValue={sort ?? "recent"}
            >
              <option value="recent">Most recent</option>
              <option value="priceAsc">Price: low to high</option>
              <option value="priceDesc">Price: high to low</option>
            </select>
            <input
              className="rounded-md border px-3 py-2 text-sm"
              type="number"
              name="minPrice"
              defaultValue={asString(params.minPrice)}
              min={0}
              placeholder="Min price"
            />
            <input
              className="rounded-md border px-3 py-2 text-sm"
              type="number"
              name="maxPrice"
              defaultValue={asString(params.maxPrice)}
              min={0}
              placeholder="Max price"
            />
            <div className="flex items-center gap-3 md:col-span-2 lg:col-span-5">
              <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
                Apply Filters
              </button>
              <a href="/listings" className="text-sm underline">
                Reset
              </a>
            </div>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {listingsResult.items.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center text-sm">
                No listings found.
              </p>
            )}
            {listingsResult.items.map((listing) => (
              <ListingCard key={listing.slug} listing={listing} />
            ))}
          </div>

          {listingsResult.pageCount > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: listingsResult.pageCount }).map(
                (_, index) => {
                  const nextPage = index + 1;
                  const qp = new URLSearchParams();
                  if (q) qp.set("q", q);
                  if (categorySlug) qp.set("category", categorySlug);
                  if (sort) qp.set("sort", sort);
                  if (asString(params.minPrice))
                    qp.set("minPrice", asString(params.minPrice)!);
                  if (asString(params.maxPrice))
                    qp.set("maxPrice", asString(params.maxPrice)!);
                  qp.set("page", String(nextPage));
                  return (
                    <a
                      key={nextPage}
                      href={`/listings?${qp.toString()}`}
                      className={`rounded-md border px-3 py-1 text-sm ${
                        nextPage === listingsResult.page
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      {nextPage}
                    </a>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
