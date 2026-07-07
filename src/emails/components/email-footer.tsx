import React from "react";
import { Container, Img, Link, Section, Text } from "react-email";
import { cn } from "@/lib/utils";

type EmailFooterProps = React.HTMLAttributes<HTMLDivElement>;

export default function EmailFooter({ className, ...props }: EmailFooterProps) {
  return (
    <Container
      className={cn("mt-8 text-center text-gray-400", className)}
      {...props}
    >
      <Text className="text-sm">
        <strong>Do not reply to this email.</strong> Replying to this email will
        not be monitored or answered. If you receive this email by mistake,
        please ignore and delete it. If you have any questions, please contact
        our support team.
      </Text>
      <Section>
        <Text className="font-bold text-gray-600">Find us on Social Media</Text>
        <Container className="mt-2">
          <Link
            href="https://www.facebook.com/cheappis"
            target="_blank"
            className="inline-flex items-center rounded-xl bg-gray-300 p-1 text-gray-400"
          >
            <Img
              src={"https://cheappis.b-cdn.net/assets/emails/facebook.png"}
              alt="Facebook"
              width={32}
              height={32}
            />
          </Link>
          <Link
            href="https://www.instagram.com/cheappis"
            target="_blank"
            className="ml-1 inline-flex items-center rounded-xl bg-gray-300 p-1 text-gray-400"
          >
            <Img
              src={"https://cheappis.b-cdn.net/assets/emails/instagram.png"}
              alt="Instagram"
              width={32}
              height={32}
            />
          </Link>
          <Link
            href="https://www.tiktok.com/@cheappis"
            target="_blank"
            className="ml-1 inline-flex items-center rounded-xl bg-gray-300 p-1 text-gray-400"
          >
            <Img
              src={"https://cheappis.b-cdn.net/assets/emails/tiktok.png"}
              alt="TikTok"
              width={32}
              height={32}
            />
          </Link>
        </Container>
      </Section>
      <Text className="text-muted-foreground mt-8 text-center text-xs">
        Copyright &copy; {new Date().getFullYear()} Cheappis. All rights
        reserved.
      </Text>
    </Container>
  );
}
