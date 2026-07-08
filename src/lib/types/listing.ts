import { type RouterOutputs } from "@/trpc/react";

export type Listing = NonNullable<RouterOutputs["listing"]["getBySlug"]>;
