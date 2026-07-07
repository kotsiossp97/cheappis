import { env } from "@/env";
import { SES } from "@aws-sdk/client-ses";

export const sesClient = new SES({
  region: "eu-central-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});
