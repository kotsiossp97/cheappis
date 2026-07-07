import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { passkey } from "@better-auth/passkey";
import { magicLink } from "better-auth/plugins/magic-link";
import { render } from "react-email";
import { createElement } from "react";

import { env } from "@/env";
import EmailVerificationEmail from "@/emails/email-verification";
import elEmailMessages from "@/emails/translations/el.json";
import enEmailMessages from "@/emails/translations/en.json";
import ruEmailMessages from "@/emails/translations/ru.json";
import sendEmail from "@/server/aws/actions/send-email";
import { db } from "@/server/db";

const emailVerificationSubjects = {
  en: enEmailMessages["email-verification"].subject,
  el: elEmailMessages["email-verification"].subject,
  ru: ruEmailMessages["email-verification"].subject,
} as const;

const socialProviders = {
  ...(env.BETTER_AUTH_GITHUB_CLIENT_ID && env.BETTER_AUTH_GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
  ...(env.BETTER_AUTH_GOOGLE_CLIENT_ID && env.BETTER_AUTH_GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.BETTER_AUTH_GOOGLE_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
  ...(env.BETTER_AUTH_FACEBOOK_CLIENT_ID &&
  env.BETTER_AUTH_FACEBOOK_CLIENT_SECRET
    ? {
        facebook: {
          clientId: env.BETTER_AUTH_FACEBOOK_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_FACEBOOK_CLIENT_SECRET,
        },
      }
    : {}),
  ...(env.BETTER_AUTH_APPLE_CLIENT_ID && env.BETTER_AUTH_APPLE_CLIENT_SECRET
    ? {
        apple: {
          clientId: env.BETTER_AUTH_APPLE_CLIENT_ID,
          clientSecret: env.BETTER_AUTH_APPLE_CLIENT_SECRET,
          ...(env.BETTER_AUTH_APPLE_APP_BUNDLE_IDENTIFIER
            ? {
                appBundleIdentifier:
                  env.BETTER_AUTH_APPLE_APP_BUNDLE_IDENTIFIER,
              }
            : {}),
        },
      }
    : {}),
};

export const auth = betterAuth({
  ...(env.BETTER_AUTH_URL ? { baseURL: env.BETTER_AUTH_URL } : {}),
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
  trustedOrigins: ["https://appleid.apple.com"],
  plugins: [
    passkey({
      rpID: env.BETTER_AUTH_PASSKEY_RP_ID ?? "localhost",
      rpName: env.BETTER_AUTH_PASSKEY_RP_NAME ?? "Cheappis",
      origin:
        env.BETTER_AUTH_PASSKEY_ORIGIN ??
        env.BETTER_AUTH_URL ??
        "http://localhost:3000",
    }),
    magicLink({
      expiresIn: env.BETTER_AUTH_MAGIC_LINK_EXPIRES_IN_SECONDS ?? 900,
      storeToken: "hashed",
      rateLimit: {
        window: 60,
        max: 5,
      },
      sendMagicLink: async ({ email, token, url, metadata }) => {
        const locale: keyof typeof emailVerificationSubjects =
          metadata?.locale === "el" || metadata?.locale === "ru"
            ? metadata.locale
            : "en";

        const emailHtml = await render(
          createElement(EmailVerificationEmail, {
            verificationCode: token,
            verificationUrl: url,
            locale,
          }),
        );

        await sendEmail(email, emailVerificationSubjects[locale], emailHtml);
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
