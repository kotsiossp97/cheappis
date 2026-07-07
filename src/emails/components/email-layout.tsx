import React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Section,
  Tailwind,
} from "react-email";
import EmailFooter from "./email-footer";
import { cn } from "@/lib/utils";

interface EmailLayoutProps {
  children?: React.ReactNode;
  bodyClassName?: string;
  className?: string;
}

export default function EmailLayout({
  children,
  bodyClassName,
  className,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className={cn("m-auto bg-gray-200 font-sans", bodyClassName)}>
          <Container className="mx-auto mb-10 p-5">
            <Section className="m-0 mx-auto max-w-xl p-0">
              <Img
                src={`https://cheappis.b-cdn.net/assets/emails/logo_banner.png`}
                width="400"
                height="200"
                alt="Cheappis Logo"
                className="w-full object-contain"
              />
            </Section>

            <Section
              className={cn("rounded-2xl bg-white px-8 py-12", className)}
            >
              {children}
            </Section>

            <EmailFooter />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
