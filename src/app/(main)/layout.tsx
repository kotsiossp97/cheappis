import SiteHeader from "@/components/layout/site-header";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      <section className="flex flex-1 flex-col">{children}</section>
      {/* {children} */}
    </>
  );
}
