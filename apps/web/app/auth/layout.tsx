
import { Theme } from "@/components/elements/theme"




export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Theme classname="fixed top-4 right-4"/>
      {children}
    </>
  );
}
