import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { FREE_PLAN_MAX_IMAGES } from "@/lib/listing-image-constraints";

const listingSortValues = ["recent", "priceAsc", "priceDesc"] as const;

const listInputSchema = z.object({
  q: z.string().trim().max(120).optional(),
  categorySlug: z.string().trim().min(1).optional(),
  featured: z.boolean().optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  sort: z.enum(listingSortValues).default("recent"),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(48).default(24),
});

const createListingSchema = z.object({
  title: z.string().trim().min(5).max(120),
  description: z.string().trim().max(5000).optional(),
  categorySlug: z.string().trim().min(1),
  location: z.string().trim().min(2).max(120),
  price: z.number().int().min(0).nullable().optional(),
  isFree: z.boolean().default(false),
  priceNegotiable: z.boolean().default(false),
  imageUrls: z.array(z.string().url()).min(1).max(FREE_PLAN_MAX_IMAGES),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const toListingDto = (listing: {
  slug: string;
  title: string;
  description: string | null;
  price: number | null;
  isFree: boolean;
  priceNegotiable: boolean;
  location: string;
  featured: boolean;
  createdAt: Date;
  category: { slug: string };
  images: Array<{ url: string }>;
}) => ({
  slug: listing.slug,
  title: listing.title,
  description: listing.description ?? undefined,
  price: listing.price,
  isFree: listing.isFree,
  priceNegotiable: listing.priceNegotiable,
  location: listing.location,
  createdAt: listing.createdAt.toISOString(),
  categorySlug: listing.category.slug,
  images: listing.images.map((image) => image.url),
  featured: listing.featured,
});

const listingSelect = {
  slug: true,
  title: true,
  description: true,
  price: true,
  isFree: true,
  priceNegotiable: true,
  location: true,
  featured: true,
  createdAt: true,
  category: {
    select: {
      slug: true,
    },
  },
  images: {
    orderBy: {
      position: "asc" as const,
    },
    select: {
      url: true,
    },
  },
};

const buildUniqueSlug = async (
  db: {
    listing: {
      findFirst: (args: { where: { slug: string }; select: { slug: true } }) => Promise<{ slug: string } | null>;
    };
  },
  title: string,
) => {
  const baseSlug = slugify(title) || "listing";
  let candidate = baseSlug;
  let index = 1;

  while (await db.listing.findFirst({ where: { slug: candidate }, select: { slug: true } })) {
    candidate = `${baseSlug}-${index}`;
    index += 1;
  }

  return candidate;
};

export const listingRouter = createTRPCRouter({
  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(24).default(8) }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 8;
      const rows = await ctx.db.listing.findMany({
        where: {
          status: "ACTIVE",
          featured: true,
        },
        orderBy: [{ createdAt: "desc" }],
        take: limit,
        select: listingSelect,
      });

      return rows.map(toListingDto);
    }),

  getRecent: publicProcedure
    .input(z.object({ limit: z.number().int().min(1).max(24).default(8) }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 8;
      const rows = await ctx.db.listing.findMany({
        where: {
          status: "ACTIVE",
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: limit,
        select: listingSelect,
      });

      return rows.map(toListingDto);
    }),

  list: publicProcedure.input(listInputSchema).query(async ({ ctx, input }) => {
    const whereClause = {
      status: "ACTIVE" as const,
      ...(input.featured !== undefined ? { featured: input.featured } : {}),
      ...(input.categorySlug
        ? {
            category: {
              slug: input.categorySlug,
            },
          }
        : {}),
      ...(input.q
        ? {
            OR: [
              { title: { contains: input.q, mode: "insensitive" as const } },
              {
                description: {
                  contains: input.q,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
      ...(input.minPrice !== undefined || input.maxPrice !== undefined
        ? {
            price: {
              ...(input.minPrice !== undefined ? { gte: input.minPrice } : {}),
              ...(input.maxPrice !== undefined ? { lte: input.maxPrice } : {}),
            },
          }
        : {}),
    };

    const orderBy =
      input.sort === "priceAsc"
        ? [{ price: "asc" as const }, { createdAt: "desc" as const }]
        : input.sort === "priceDesc"
          ? [{ price: "desc" as const }, { createdAt: "desc" as const }]
          : [{ featured: "desc" as const }, { createdAt: "desc" as const }];

    const skip = (input.page - 1) * input.pageSize;

    const [items, total] = await Promise.all([
      ctx.db.listing.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: input.pageSize,
        select: listingSelect,
      }),
      ctx.db.listing.count({ where: whereClause }),
    ]);

    return {
      items: items.map(toListingDto),
      page: input.page,
      pageSize: input.pageSize,
      total,
      pageCount: Math.max(1, Math.ceil(total / input.pageSize)),
    };
  }),

  getBySlug: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().trim().min(1),
        listingSlug: z.string().trim().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const listing = await ctx.db.listing.findFirst({
        where: {
          slug: input.listingSlug,
          status: "ACTIVE",
          category: {
            slug: input.categorySlug,
          },
        },
        select: listingSelect,
      });

      if (!listing) {
        return null;
      }

      return toListingDto(listing);
    }),

  getByCategory: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().trim().min(1),
        limit: z.number().int().min(1).max(60).default(24),
      }),
    )
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.listing.findMany({
        where: {
          status: "ACTIVE",
          category: {
            slug: input.categorySlug,
          },
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: input.limit,
        select: listingSelect,
      });

      return rows.map(toListingDto);
    }),

  getSimilar: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().trim().min(1),
        excludeSlug: z.string().trim().min(1),
        limit: z.number().int().min(1).max(12).default(6),
      }),
    )
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.listing.findMany({
        where: {
          status: "ACTIVE",
          slug: {
            not: input.excludeSlug,
          },
          category: {
            slug: input.categorySlug,
          },
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: input.limit,
        select: listingSelect,
      });

      return rows.map(toListingDto);
    }),

  create: protectedProcedure
    .input(createListingSchema)
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.categorySlug },
        select: { id: true },
      });

      if (!category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid category selected.",
        });
      }

      if (input.isFree && input.price && input.price > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Free listings cannot have a price.",
        });
      }

      if (input.imageUrls.length > FREE_PLAN_MAX_IMAGES) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Free users can upload up to ${FREE_PLAN_MAX_IMAGES} images.`,
        });
      }

      const slug = await buildUniqueSlug(ctx.db, input.title);

      const listing = await ctx.db.listing.create({
        data: {
          slug,
          title: input.title,
          description: input.description,
          categoryId: category.id,
          location: input.location,
          price: input.isFree ? null : (input.price ?? null),
          isFree: input.isFree,
          priceNegotiable: input.priceNegotiable,
          status: "ACTIVE",
          userId: ctx.session.user.id,
          images: {
            create: input.imageUrls.map((url, index) => ({
              url,
              position: index,
            })),
          },
        },
        select: listingSelect,
      });

      return toListingDto(listing);
    }),
});
