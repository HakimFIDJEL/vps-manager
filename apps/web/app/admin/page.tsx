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
      
    </>
  );
}
