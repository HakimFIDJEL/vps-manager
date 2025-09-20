"use client";

import * as React from "react";
import {
	ArrowUpCircleIcon,
	Archive,
	Container,
	Folder,
	LayoutDashboard,
	LogOut,
	Network,
	SquareActivity,
	SquareTerminal,
	User,
	GalleryVerticalEnd,
} from "lucide-react";
import { Link } from "@inertiajs/react";

import { NavLinks } from "@/components/layouts/app/sidebar/nav-links";
import { NavUser } from "@/components/layouts/app/sidebar/nav-user";

import { Separator } from "@/components/ui/separator";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const data = {
		navigation: [
			{
				title: "Dashboard",
				url: route("dashboard"),
				icon: LayoutDashboard,
				active: route().current("dashboard"),
			},
			{
				title: "Projects",
				url: route("projects.index"),
				icon: Folder,
				active: (route().current("projects.*") && !route().current("projects.show")),
				items: [
					{
						title: "Project 1",
						url: "#",
						active: route().current("projects.show"),
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
				url: route("not-implemented"),
				icon: Container,
				items: [
					{
						title: "Containers",
						url: route("not-implemented"),
					},
					{
						title: "Volumes",
						url: route("not-implemented"),
					},
					{
						title: "Networks",
						url: route("not-implemented"),
					},
					{
						title: "Images",
						url: route("not-implemented"),
					},
				],
			},
			{
				title: "Network & Security",
				url: route("not-implemented"),
				icon: Network,
				items: [
					{
						title: "Activity",
						url: route("not-implemented"),
					},
					{
						title: "SSH Keys",
						url: route("not-implemented"),
					},
					{
						title: "Traefik",
						url: route("not-implemented"),
					},
					{
						title: "Firewall",
						url: route("not-implemented"),
					},
				],
			},
			{
				title: "Storage",
				url: route("not-implemented"),
				icon: Archive,
				items: [
					{
						title: "Disk Usage",
						url: route("not-implemented"),
					},
					{
						title: "Backups",
						url: route("not-implemented"),
					},
				],
			},
			{
				title: "Monitoring",
				url: route("not-implemented"),
				icon: SquareActivity,
				items: [
					{
						title: "Processes",
						url: route("not-implemented"),
					},
					{
						title: "Resources",
						url: route("not-implemented"),
					},
					{
						title: "Containers",
						url: route("not-implemented"),
					},
					{
						title: "Logs",
						url: route("not-implemented"),
					},
				],
			},
		],

		footer: [
			{
				title: "Terminal",
				url: route("not-implemented"),
				icon: SquareTerminal,
			},
			{
				title: "Account",
				url: route("not-implemented"),
				icon: User,
			},
			{
				title: "Log out",
				url: route("not-implemented"),
				icon: LogOut,
			},
		],

		user: {
			name: "Hakim Fidjel",
			email: "m@example.com",
		},
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!py-1.5 !px-0 group-data-[collapsible=icon]:!p-0 "
						>
							<Link href={route("dashboard")}>
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
									<span className="text-xl text-white italic font-bold">H</span>
								</div>
								<span className="text-base font-semibold">VPS Manager </span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<Separator />
			<SidebarContent>
				<NavLinks title="Navigation" items={data.navigation} />
				{/* <NavLinks
					title="Quick access"
					items={data.footer}
				/> */}
			</SidebarContent>
			<Separator />
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
