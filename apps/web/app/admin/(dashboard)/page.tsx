"use strict";

// Necessary Imports
import type { Metadata } from 'next'

// Custom Components
import { BreadcrumbSetter } from "@/components/admin/layout/header/header-breadcrumb";
import { Header } from "@/components/admin/page/header";
import { Dashboard } from "@/components/admin/page/dashboard/main";

// Icons
import { LayoutDashboard, RefreshCcw } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Dashboard",
}

export default function Page() {
  return (
    <>
      <BreadcrumbSetter
        items={[
          { title: "Dashboard", url: "/admin" },
          // { title: "Dashboard", url: "/admin/dashboard" },
        ]}
      />


      <div className="flex flex-col gap-4">
        <Header 
          title="Dashboard" 
          subtitle="See how the service is doing"
          icon={<LayoutDashboard className="h-5 w-5 text-primary" />}
        >
          <Link href="/admin">
            <Button size="default">
              Refresh Data
              <RefreshCcw className="h-5 w-5" />
            </Button>
          </Link>
        </Header>
        <Dashboard />
      </div>

    </>
  );
}
