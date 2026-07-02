import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { DEFAULT_CATEGORIES } from "@/lib/default-categories";

const ensureDefaultCategories = async (db: {
  category: {
    count: () => Promise<number>;
    createMany: (args: {
      data: Array<{ name: string; slug: string; icon?: string }>;
    }) => Promise<unknown>;
  };
}) => {
  const count = await db.category.count();

  if (count === 0) {
    await db.category.createMany({
      data: DEFAULT_CATEGORIES.map((category) => ({
        name: category.name,
        slug: category.slug,
        icon: category.icon,
      })),
    });
  }
};

export const categoryRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    await ensureDefaultCategories(ctx.db);

    return ctx.db.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    });
  }),
});
