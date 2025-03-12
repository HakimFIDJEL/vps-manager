"use strict";

// Shadcn Components
import { BreadcrumbSetter } from "@/components/admin/layout/header/header-breadcrumb";
import { Header } from "@/components/admin/page/header";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";

// Icons
import { RefreshCcw, TerminalSquare, User } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

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
          icon={<User className="h-5 w-5 text-primary" />}/>




      </div>

    </>
  );
}
