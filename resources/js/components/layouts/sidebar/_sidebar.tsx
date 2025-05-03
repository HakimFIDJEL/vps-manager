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
      url: route('dashboard'),
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Projects",
      url: route('projects.index'),
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
      url: route('not-implemented'),
      icon: Container,
      items: [
        {
          title: "Containers",
          url: route('not-implemented'),
        },
        {
          title: "Volumes",
          url: route('not-implemented'),
        },
        {
          title: "Networks",
          url: route('not-implemented'),
        },
        {
          title: "Images",
          url: route('not-implemented'),
        },
      ],
    },
    {
      title: "Network & Security",
      url: route('not-implemented'),
      icon: Network,
      items: [
        {
          title: "Activity",
          url: route('not-implemented'),
        },
        {
          title: "SSH Keys",
          url: route('not-implemented'),
        },
        {
          title: "Traefik",
          url: route('not-implemented'),
        },
        {
          title: "Firewall",
          url: route('not-implemented'),
        },
      ],
    },
    {
      title: "Storage",
      url: route('not-implemented'),
      icon: Archive,
      items: [
        {
          title: "Disk Usage",
          url: route('not-implemented'),
        },
        {
          title: "Backups",
          url: route('not-implemented'),
        },
      ],
    },
    {
      title: "Monitoring",
      url: route('not-implemented'),
      icon: SquareActivity,
      items: [
        {
          title: "Processes",
          url: route('not-implemented'),
        },
        {
          title: "Resources",
          url: route('not-implemented'),
        },
        {
          title: "Containers",
          url: route('not-implemented'),
        },
        {
          title: "Logs",
          url: route('not-implemented'),
        },
      ],
    },
  ],

  footer: [
    {
      title: "Terminal",
      url: route('not-implemented'),
      icon: SquareTerminal,
    },
    {
      title: "Account",
      url: route('not-implemented'),
      icon: User,
    },
    {
      title: "Log out",
      url: route('not-implemented'),
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
