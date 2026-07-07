import { auth } from "@/server/better-auth";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

const EMAIL_LOGIN_EXPIRATION_SECONDS = 15 * 60;

const sanitizeCallbackPath = (callbackPath?: string) => {
  if (!callbackPath) {
    return "/";
  }

  return callbackPath.startsWith("/") ? callbackPath : "/";
};

const completeProfileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  surname: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(30),
  password: z
    .string()
    .min(10)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^a-zA-Z0-9]/),
});

export const authRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        image: true,
      },
    });

    return user;
  }),
  signInMethod: publicProcedure
    .input(
      z.object({
        email: z.email().transform((value) => value.trim().toLowerCase()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
        select: {
          id: true,
          onboardingCompleted: true,
          name: true,
          surname: true,
          phone: true,
          accounts: {
            where: {
              providerId: "credential",
            },
            select: {
              password: true,
            },
            take: 1,
          },
        },
      });

      const credentialPassword = user?.accounts[0]?.password;
      const isOnboarded = Boolean(
        user?.onboardingCompleted && user?.name && user?.surname && user?.phone,
      );

      if (isOnboarded && credentialPassword) {
        return {
          method: "password" as const,
        };
      }

      return {
        method: "magic-link" as const,
      };
    }),

  emailVerificationInit: publicProcedure
    .input(
      z.object({
        email: z.email().transform((value) => value.trim().toLowerCase()),
        locale: z.enum(["en", "el", "ru"]).optional().default("en"),
        callbackPath: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { email, locale } = input;
        const callbackPath = sanitizeCallbackPath(input.callbackPath);
        const completionPath =
          callbackPath === "/"
            ? "/complete-profile"
            : `/complete-profile?next=${encodeURIComponent(callbackPath)}`;
        const expiresAt = new Date(
          Date.now() + EMAIL_LOGIN_EXPIRATION_SECONDS * 1000,
        );

        // Opportunistic cleanup keeps the verification table small without cron.
        await ctx.db.verification.deleteMany({
          where: {
            expiresAt: {
              lt: new Date(),
            },
          },
        });

        const response = await auth.api.signInMagicLink({
          body: {
            email,
            callbackURL: callbackPath,
            newUserCallbackURL: completionPath,
            errorCallbackURL: "/sign-in",
            metadata: {
              locale,
            },
          },
          headers: ctx.headers,
        });

        if (!response?.status) {
          return {
            success: false,
            code: 500,
            message: "Failed to initialize email verification",
          };
        }

        return {
          success: true,
          code: 200,
          message: "Verification email sent",
          expiresInSeconds: EMAIL_LOGIN_EXPIRATION_SECONDS,
          expiresAt: expiresAt.toISOString(),
        };
      } catch (error) {
        return {
          success: false,
          code: 500,
          message: "Failed to send verification email",
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }),

  completeProfile: protectedProcedure
    .input(completeProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const existingCredential = await ctx.db.account.findFirst({
        where: {
          userId: ctx.session.user.id,
          providerId: "credential",
        },
        select: {
          password: true,
        },
      });

      if (!existingCredential?.password) {
        await auth.api.setPassword({
          body: {
            newPassword: input.password,
          },
          headers: ctx.headers,
        });
      }

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          surname: input.surname,
          phone: input.phone,
          onboardingCompleted: true,
        },
      });

      return {
        success: true,
      };
    }),
});
