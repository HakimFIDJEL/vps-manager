"use strict";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { BreadcrumbSetter } from "@/components/admin/layout/header/header-breadcrumb";
import { Header } from "@/components/admin/page/header";
import { Monitoring } from "@/components/admin/page/dashboard/monitoring";

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
      <Tabs defaultValue="monitoring" className="h-full w-full md:w-auto gap-4 flex flex-col">
        <Header
          title="Dashboard"
          subtitle="Welcome to the dashboard"
        >
          <div className="h-full flex  overflow-x-auto pb-2 md:pb-0 md:overflow-x-hidden w-full md:w-auto">
            <TabsList className="h-full flex gap-2 w-full">
              <TabsTrigger value="monitoring" className="h-full md:px-4 px-2">
                Monitoring
              </TabsTrigger>
              <TabsTrigger value="projects" className="h-full md:px-4 px-2">
                Projects
              </TabsTrigger>
              <TabsTrigger value="containers" className="h-full md:px-4 px-2">
                Containers
              </TabsTrigger>
              <TabsTrigger value="storage" className="h-full md:px-4 px-2">
                Storage
              </TabsTrigger>
            </TabsList>
          </div>
        </Header>

        <div>
          <TabsContent value="monitoring">
            <Monitoring />
          </TabsContent>
          <TabsContent value="projects">Projects</TabsContent>
          <TabsContent value="containers">Containers</TabsContent>
          <TabsContent value="storage">Storage</TabsContent>
        </div>
      </Tabs>
    </>
  );
}
