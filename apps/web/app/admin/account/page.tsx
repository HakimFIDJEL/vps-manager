"use strict";

// Necessary imports
import type { Metadata } from 'next'

// Shadcn Components
import { BreadcrumbSetter } from "@/components/admin/layout/header/header-breadcrumb";
import { Header } from "@/components/admin/page/header";

// Icons
import { User } from "lucide-react";

// Custom Components
import { Account } from "@/components/admin/page/account/main";

export const metadata: Metadata = {
  title: "Account",
}

export default function Page() {
  return (
    <>
      <BreadcrumbSetter
        items={[
          { title: "Dashboard", url: "/admin" },
          { title: "Account", url: "/admin/account" },
        ]}
      />


      <div className="flex flex-col gap-4">
        <Header 
          title="Account" 
          subtitle="Manage your account informations"
          icon={<User className="h-5 w-5 text-primary" />}
        />
        
        
        <Account />



      </div>

    </>
  );
}
