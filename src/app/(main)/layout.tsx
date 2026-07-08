import { UserContextProvider } from "@/components/context/user-context";
import SiteHeader from "@/components/layout/site-header";

export default async function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserContextProvider user={null}>
      <SiteHeader />
      <section className="flex flex-1 flex-col">{children}</section>
      {/* {children} */}
    </UserContextProvider>
  );
}
