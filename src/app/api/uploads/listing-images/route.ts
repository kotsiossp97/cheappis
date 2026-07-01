import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";
import sharp from "sharp";

import {
  FREE_PLAN_MAX_IMAGES,
  MAX_IMAGE_FILE_SIZE_BYTES,
  SUPPORTED_IMAGE_MIME_TYPES,
} from "@/lib/listing-image-constraints";

export const runtime = "nodejs";

const uploadDirectory = path.join(
  process.cwd(),
  "public",
  "uploads",
  "listings",
);

const jsonError = (status: number, errorKey: string) =>
  NextResponse.json({ errorKey }, { status });

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const baseOrigin = requestUrl.origin;

    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
      return jsonError(400, "errors.noImagesSelected");
    }

    if (files.length > FREE_PLAN_MAX_IMAGES) {
      return jsonError(400, "errors.tooManyImages");
    }

    await mkdir(uploadDirectory, { recursive: true });

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
      const destinationPath = path.join(uploadDirectory, filename);
      const publicPath = `/uploads/listings/${filename}`;

      await writeFile(destinationPath, optimizedBuffer);
      urls.push(new URL(publicPath, baseOrigin).toString());
    }

    return NextResponse.json({ urls });
  } catch {
    return jsonError(500, "errors.uploadFailed");
  }
}
