export interface Listing {
  slug: string;
  title: string;
  description?: string;
  price?: number | null;
  priceNegotiable?: boolean;
  isFree?: boolean;
  location: string;
  createdAt: string;
  categorySlug: string;
  images: string[];
  featured?: boolean;
}
