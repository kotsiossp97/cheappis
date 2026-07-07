"use server";

import { sesClient } from "@/server/aws/ses";
import { SendEmailCommand } from "@aws-sdk/client-ses";

const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  from: string = "Cheappis <noreply@cheappis.com>",
) => {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: from,
    ReplyToAddresses: ["help@cheappis.com"],
  });

  return await sesClient.send(command);
};

export default sendEmail;
