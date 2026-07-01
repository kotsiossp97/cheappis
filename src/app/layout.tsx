import type { Metadata } from "next";
import {
  Inter,
  Roboto_Flex,
  JetBrains_Mono,
  Cascadia_Code,
} from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "../components/providers/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/react";

const inter = Inter({
  subsets: [
    "latin",
    "latin-ext",
    "greek",
    "greek-ext",
    "cyrillic",
    "cyrillic-ext",
  ],
  variable: "--font-sans",
});

const robotoFlex = Roboto_Flex({
  subsets: ["latin", "latin-ext", "greek", "cyrillic", "cyrillic-ext"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext", "greek", "cyrillic", "cyrillic-ext"],
  variable: "--font-geist-mono",
});

const cascadiaCode = Cascadia_Code({
  subsets: ["latin", "latin-ext"],
  variable: "--font-cascadia",
});

export const metadata: Metadata = {
  title: "Cheaππης",
  description:
    "Cheappis is a free marketplace for buying and selling used tech products in Cyprus.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        robotoFlex.variable,
        jetbrainsMono.variable,
        cascadiaCode.variable,
        "font-sans",
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <TRPCReactProvider>
          <NextIntlClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider delayDuration={600}>{children}</TooltipProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
