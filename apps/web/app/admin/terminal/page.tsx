"use strict";

// Shadcn Components
import { BreadcrumbSetter } from "@/components/admin/layout/header/header-breadcrumb";
import { Header } from "@/components/admin/page/header";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";

// Icons
import { RefreshCcw, TerminalSquare } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { TerminalComponent } from "@/components/admin/page/terminal/main";

export default function Page() {
  return (
    <>
      <BreadcrumbSetter
        items={[
          { title: "Dashboard", url: "/admin" },
          { title: "Terminal", url: "/admin/terminal" },
        ]}
      />


      <div className="flex flex-col gap-4">
        <Header 
          title="Terminal" 
          subtitle="Run commands on the server"
          icon={<TerminalSquare className="h-5 w-5 text-primary" />}
        >
          <Link href="/admin">
            <Button size="default">
              Reset Terminal
              <RefreshCcw className="h-5 w-5" />
            </Button>
          </Link>
        </Header>

        <TerminalComponent />



      </div>

    </>
  );
}
