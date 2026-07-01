import { HeaderSearch } from "@/components/layout/header-search";
import { Badge } from "@/components/ui/badge";
import { DUMMY_DATA } from "@/lib/dummy_data";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  const t = useTranslations("HomePage");

  const popularSearches = DUMMY_DATA.popularSearches;

  return (
    <section className="border-border bg-secondary/40 relative border-b">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:py-20">
        <Badge
          variant="secondary"
          className="border-border bg-card text-muted-foreground mb-4 border px-4 py-3 text-sm capitalize"
        >
          {t("heroBadge")}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-balance text-shadow-[0_0_5px_color-mix(in_oklab,var(--primary)_30%,transparent),0_0_5px] sm:text-5xl">
          {t.rich("heroTitle", {
            tech: (chunk) => <span className="text-primary">{chunk}</span>,
            country: (chunk) => <span className="text-primary">{chunk}</span>,
          })}
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl leading-relaxed text-pretty">
          {t("heroSubtitle")}
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <HeaderSearch placeholderKey="search2" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-muted-foreground">{t("popularSearches")}</span>
          {popularSearches.map((term) => (
            <Link
              key={term}
              href={`/listings?q=${encodeURIComponent(term)}`}
              className="border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary rounded-full border px-3 py-1 font-medium capitalize transition-colors"
            >
              {term}
            </Link>
          ))}
        </div>

        <div className="absolute top-0 right-0 -z-10">
          <Image
            src="/assets/hero_bg.png"
            alt="Hero background"
            width={800}
            height={400}
            loading="eager"
            className="h-full w-full object-contain opacity-70"
          />
        </div>
      </div>
    </section>
  );
}
