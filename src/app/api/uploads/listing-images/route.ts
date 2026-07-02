import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { type ReadableStream as NodeReadableStream } from "node:stream/web";

import { NextResponse } from "next/server";
import sharp from "sharp";

import {
  FREE_PLAN_MAX_IMAGES,
  MAX_IMAGE_FILE_SIZE_BYTES,
  SUPPORTED_IMAGE_MIME_TYPES,
} from "@/lib/listing-image-constraints";
import BunnyCdn from "@/server/bunny/storage";
import { db } from "@/server/db";
import { auth } from "@/server/better-auth";

const jsonError = (status: number, errorKey: string) =>
  NextResponse.json({ errorKey }, { status });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const listingIdEntry = formData.get("listingId");
    const listingId =
      typeof listingIdEntry === "string" ? listingIdEntry.trim() : "";

    if (!listingId) {
      return jsonError(400, "errors.uploadFailed");
    }

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return jsonError(401, "errors.uploadFailed");
    }

    const listing = await db.listing.findUnique({
      where: { id: listingId },
      select: { userId: true, status: true },
    });

    if (
      !listing ||
      listing.userId !== session.user.id ||
      listing.status !== "DRAFT"
    ) {
      return jsonError(403, "errors.uploadFailed");
    }

    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
      return jsonError(400, "errors.noImagesSelected");
    }

    if (files.length > FREE_PLAN_MAX_IMAGES) {
      return jsonError(400, "errors.tooManyImages");
    }

    const urls: string[] = [];

    for (const file of files) {
      if (
        !SUPPORTED_IMAGE_MIME_TYPES.includes(
          file.type as (typeof SUPPORTED_IMAGE_MIME_TYPES)[number],
        )
      ) {
        return jsonError(400, "errors.unsupportedFileType");
      }

      if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
        return jsonError(400, "errors.fileTooLarge");
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const optimizedBuffer = await sharp(fileBuffer)
        .rotate()
        .resize(1920, 1920, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      const filename = `${Date.now()}-${randomUUID()}.webp`;
      const fileStream = Readable.toWeb(
        Readable.from(optimizedBuffer),
      ) as NodeReadableStream<Uint8Array>;

      const result = await BunnyCdn.uploadImage(
        listingId,
        filename,
        fileStream,
        {
          contentType: "image/webp",
        },
      );

      if (!result.success) {
        return jsonError(500, "errors.uploadFailed");
      }

      urls.push(result.url);
    }

    return NextResponse.json({ urls });
  } catch {
    return jsonError(500, "errors.uploadFailed");
  }
}
