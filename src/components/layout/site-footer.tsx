import CheappisLogo from "@/components/reusable/logo";
import { DUMMY_DATA } from "@/lib/dummy_data";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function SiteFooter() {
  const categories = DUMMY_DATA.categories;
  const t = useTranslations("SiteFooter");
  const tCat = useTranslations("Categories");
  const tPages = useTranslations("Pages");

  return (
    <footer className="border-border bg-card mt-16 border-t">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2">
            <CheappisLogo />
          </Link>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("categories")}</h3>
          <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/listings/categories/${c.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {tCat(c.slug) || c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("company")}</h3>
          <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
            <li>
              <span className="hover:text-foreground transition-colors">
                {tPages("about")}
              </span>
            </li>
            <li>
              <span className="hover:text-foreground transition-colors">
                {tPages("privacyPolicy")}
              </span>
            </li>
            <li>
              <span className="hover:text-foreground transition-colors">
                {tPages("termsOfService")}
              </span>
            </li>
            <li>
              <span className="hover:text-foreground transition-colors">
                {tPages("contact")}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("getStarted")}</h3>
          <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
            <li>
              <Link
                href="/listings/new"
                className="hover:text-foreground transition-colors"
              >
                {tPages("postListing")}
              </Link>
            </li>
            <li>
              <span className="hover:text-foreground transition-colors">
                {tPages("howItWorks")}
              </span>
            </li>
            <li>
              <Link
                href="/listings"
                className="hover:text-foreground transition-colors"
              >
                {tPages("allListings")}
              </Link>
            </li>
            <li>
              <Link
                href="/sign-in"
                className="hover:text-foreground transition-colors"
              >
                {tPages("signIn")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-border border-t">
        <p className="text-muted-foreground mx-auto max-w-7xl px-4 py-6 text-xs">
          © {new Date().getFullYear()} Cheappis. {t("rightsReserved")}
        </p>
      </div>
    </footer>
  );
}
