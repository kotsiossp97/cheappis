import Link from "next/link";

import { DUMMY_DATA } from "@/lib/dummy_data";
import IconImageRender from "@/components/helpers/icon-image-render";
import { useTranslations } from "next-intl";

export function CategoryGrid() {
  const categories = DUMMY_DATA.categories;
  const t = useTranslations("Categories");
  return (
    <nav aria-label="Browse by category">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/listings/categories/${category.slug}`}
              className="border-border bg-card hover:border-primary/40 hover:bg-secondary focus-visible:ring-ring flex h-full flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="bg-secondary text-primary flex size-11 items-center justify-center rounded-full">
                <IconImageRender source={category.icon} className="size-5" />
              </span>
              <span className="text-foreground text-xs leading-tight font-medium">
                {t(category.slug) || category.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
