import { Button, Section, Text } from "react-email";
import EmailLayout from "./components/email-layout";
import { createTranslator, type Locale } from "next-intl";

interface EmailVerificationEmailProps {
  verificationCode: string;
  verificationUrl: string;
  locale: Locale;
}

const EmailVerificationEmail = async ({
  verificationCode: _verificationCode,
  verificationUrl,
  locale,
}: EmailVerificationEmailProps) => {
  const t = createTranslator({
    messages: await import(`./translations/${locale}.json`),
    namespace: "email-verification",
    locale,
  });

  return (
    <EmailLayout>
      <Text className="text-center text-lg font-bold">{t("hello")}!! 👋👋</Text>
      <Text className="text-start text-sm leading-relaxed">
        {t("main-body")}
      </Text>
      <Section className="my-8 text-center">
        <Button
          className="rounded-md bg-[#432dd7] px-12 py-3 text-center text-white no-underline text-lg"
          href={verificationUrl}
        >
          {t("verify-button")}
        </Button>
      </Section>
      <Text className="text-center">{t("mistake-msg")}</Text>
      <Text className="text-start text-sm leading-loose">
        {t.rich("thank-you", {
          team: (chunk) => (
            <>
              <br />
              {chunk}
            </>
          ),
        })}
      </Text>
    </EmailLayout>
  );
};

export default EmailVerificationEmail;

EmailVerificationEmail.PreviewProps = {
  verificationCode: "preview-code",
  verificationUrl: "https://example.com/api/auth/magic-link/verify?token=preview",
  locale: "el",
};
