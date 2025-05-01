"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  Archive,
  Container,
  Folder,
  LayoutDashboard,
  LogOut,
  Network,
  Settings2,
  SquareActivity,
  SquareTerminal,
  User,
  type LucideIcon,
} from "lucide-react"

// import { NavDocuments } from "@/components/nav-documents"
// import { NavMain } from "@/components/nav-main"
import { NavLinks } from "@/components/layouts/sidebar/nav-links"
import { NavUser } from "@/components/layouts/sidebar/nav-user"



import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navigation: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Projects",
      url: "#",
      icon: Folder,
      items: [
        {
          title: "Project 1",
          url: "#",
        },
        {
          title: "Project 2",
          url: "#",
        },
        {
          title: "Project 3",
          url: "#",
        },
      ],
    },
    {
      title: "Docker",
      url: route('errors', {any: 'docker'}),
      icon: Container,
      items: [
        {
          title: "Containers",
          url: "/admin/docker/containers",
        },
        {
          title: "Volumes",
          url: "#",
        },
        {
          title: "Networks",
          url: "#",
        },
        {
          title: "Images",
          url: "#",
        },
      ],
    },
    {
      title: "Network & Security",
      url: "#",
      icon: Network,
      items: [
        {
          title: "Activity",
          url: "#",
        },
        {
          title: "SSH Keys",
          url: "#",
        },
        {
          title: "Traefik",
          url: "#",
        },
        {
          title: "Firewall",
          url: "#",
        },
      ],
    },
    {
      title: "Storage",
      url: "#",
      icon: Archive,
      items: [
        {
          title: "Disk Usage",
          url: "#",
        },
        {
          title: "Backups",
          url: "#",
        },
      ],
    },
    {
      title: "Monitoring",
      url: "#",
      icon: SquareActivity,
      items: [
        {
          title: "Processes",
          url: "#",
        },
        {
          title: "Resources",
          url: "#",
        },
        {
          title: "Containers",
          url: "#",
        },
        {
          title: "Logs",
          url: "#",
        },
      ],
    },
  ],

  footer: [
    {
      title: "Terminal",
      url: "/admin/terminal",
      icon: SquareTerminal,
    },
    {
      title: "Account",
      url: "/admin/account",
      icon: User,
    },
    {
      title: "Log out",
      url: "/auth/login",
      icon: LogOut,
    },
  ],

  user: {
    name: "Hakim Fidjel",
    email: "m@example.com",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [openMenu, setOpenMenu] = React.useState<string | null>(null)

  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavLinks title="Navigation" items={data.navigation} openMenu={openMenu} setOpenMenu={setOpenMenu}/>
        <NavLinks title="Quick access"  items={data.footer} openMenu={openMenu} setOpenMenu={setOpenMenu}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
