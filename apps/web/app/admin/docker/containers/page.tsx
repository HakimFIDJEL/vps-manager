"use strict";

// Shadcn Components
import { BreadcrumbSetter } from "@/components/admin/layout/header/header-breadcrumb";
import { Header } from "@/components/admin/page/header";

// Icons
import { Container } from "lucide-react";

import { Containers } from "@/components/admin/page/docker/containers/main";

export default function Page() {
  return (
    <>
      <BreadcrumbSetter
        items={[
          { title: "Dashboard", url: "/admin" },
          { title: "Docker", url: "#" },
          { title: "Containers", url: "/admin/docker/containers" },
        ]}
      />


      <div className="flex flex-col gap-4">
        {/* <Header 
          title="Containers" 
          subtitle="Manage your containers"
          icon={<Container className="h-5 w-5 text-primary" />}
        /> */}
        
        
        <Containers />



      </div>

    </>
  );
}
