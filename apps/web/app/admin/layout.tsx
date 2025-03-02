import { AdminProvider } from "@/components/providers/admin";


export default function AdminLayout({
  children,
}: {
  children: React.ReactElement;
}) {

  return (
    <div className="[--header-height:calc(theme(spacing.14))] bg-muted">
      <AdminProvider className="bg-muted">
        {children}
      </AdminProvider>
    </div>
  );
}
