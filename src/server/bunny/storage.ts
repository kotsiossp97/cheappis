import { env } from "@/env";
import * as BunnyStorageSDK from "@bunny.net/storage-sdk";
import { type ReadableStream } from "stream/web";

const bunnyConstants = {
  cdnUrl: "https://cheappis.b-cdn.net",
  storageZoneName: "cheappis-images",
  accessKey: env.BUNNY_STORAGE_ACCESS_KEY,
};

const storageZone = BunnyStorageSDK.zone.connect_with_accesskey(
  BunnyStorageSDK.regions.StorageRegion.Falkenstein,
  bunnyConstants.storageZoneName,
  bunnyConstants.accessKey,
);

const BunnyCdn = {
  storageZone,
  listingsDraftFolder: "/listings/draft",
  uploadImage: async (
    listingId: string,
    imageName: string,
    fileStream: ReadableStream<Uint8Array>,
    options?: BunnyStorageSDK.UploadOptions,
  ) => {
    const path = `${BunnyCdn.listingsDraftFolder}/${listingId}/${imageName}`;
    const success = await BunnyStorageSDK.file.upload(
      storageZone,
      path,
      fileStream,
      options,
    );

    return { success, url: `${bunnyConstants.cdnUrl}${path}` };
  },
};

export default BunnyCdn;
