import { Theme } from "@/components/elements/theme";

import { AdminPovider } from "@/components/providers/admin";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="[--header-height:calc(theme(spacing.14))] bg-muted">
        <AdminPovider className="bg-muted">{children}</AdminPovider>
      </div>
    </>
  );
}
