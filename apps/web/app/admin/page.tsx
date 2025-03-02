"use strict";

import { BreadcrumbSetter } from "@/components/admin/layout/header/header-breadcrumb";

export default function Page() {
  return (
    <>
      <BreadcrumbSetter
        items={[
          { title: "Dashboard", url: "/admin" },
          // { title: "Dashboard", url: "/admin/dashboard" },
        ]}
      />

      {/* Contenu de la page */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-background" />
          <div className="aspect-video rounded-xl bg-background" />
          <div className="aspect-video rounded-xl bg-background" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-background md:min-h-min" />
      </div>
    </>
  );
}
