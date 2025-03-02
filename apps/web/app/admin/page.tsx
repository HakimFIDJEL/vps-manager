"use strict";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { BreadcrumbSetter } from "@/components/admin/layout/header/header-breadcrumb";
import { Header } from "@/components/admin/page/header";
import { Overview } from "@/components/admin/page/dashboard/overview";

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
      <Tabs defaultValue="overview" className="h-full w-full md:w-auto gap-4 flex flex-col">
        <Header
          title="Dashboard"
          subtitle="Welcome to the dashboard"
        >
          <div className="h-full flex">
            <TabsList className="h-full flex gap-2">
              <TabsTrigger value="overview" className="h-full md:px-4">
                Overview
              </TabsTrigger>
              <TabsTrigger value="projects" className="h-full md:px-4">
                Projects
              </TabsTrigger>
              <TabsTrigger value="containers" className="h-full md:px-4">
                Containers
              </TabsTrigger>
              <TabsTrigger value="storage" className="h-full md:px-4">
                Storage
              </TabsTrigger>
            </TabsList>
          </div>
        </Header>

        <div>
          <TabsContent value="overview">
            <Overview />
          </TabsContent>
          <TabsContent value="projects">Projects</TabsContent>
          <TabsContent value="containers">Containers</TabsContent>
          <TabsContent value="storage">Storage</TabsContent>
        </div>
      </Tabs>
    </>
  );
}
