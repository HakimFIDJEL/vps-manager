"use client"

import * as React from "react"

// Shadcn components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"


// Icons
import {
  Archive,
  Container,
  Database,
  Folder,
  LayoutDashboard,
  LogOut,
  Network,
  Settings2,
  SquareActivity,
  SquareTerminal,
  User,
} from "lucide-react"

import { NavLinks } from "@/components/admin/layout/sidebar/nav-links"
import { NavUser } from "@/components/admin/layout/sidebar/nav-user"
import { Logo } from "@/components/elements/logo"

const data = {
  
  navigation: [
    {
      title: "Dashboard",
      url: "#",
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
      url: "#",
      icon: Container,
      items: [
        {
          title: "Containers",
          url: "#",
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
        }
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
  
  quick_access: [
    {
      title: "Terminal",
      url: "/admin/terminal",
      icon: SquareTerminal,
    },
    {
      title: "Database",
      url: "#",
      icon: Database,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],

  footer: [
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
}

export function LayoutSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
      variant="floating"
      collapsible="icon"
      
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Logo href="/admin" className="leading-tight" font_size="base" logo_size="8" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      
      <SidebarContent>

        <NavLinks title="Navigation" items={data.navigation} />
        <NavLinks title="Quick access" items={data.quick_access} />
        
        <NavLinks items={data.footer} className="mt-auto" />

      </SidebarContent>
      <SidebarFooter>


        <NavUser user={data.user} />

        
      </SidebarFooter>
    </Sidebar>
  )
}
