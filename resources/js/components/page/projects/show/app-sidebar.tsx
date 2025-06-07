// Necessary imports
import { Link } from "@inertiajs/react";

// Shadcn UI components
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import {
    ArrowLeft,
    Check,
    ChevronsUpDown,
    Container,
    FileLock,
    Folder,
    LayoutGrid,
    Settings2,
    SquareTerminal,
} from "lucide-react";

export function AppSidebar({ ...props }) {
    return (
        <ProjectSidebar {...props} />
    );
}

function ProjectSidebar({ ...props }) {
	return (
		<Sidebar
			collapsible="none"
			variant="floating"
			className="rounded-md border h-[calc(100vh-5rem)]"
			{...props}
		>
			<SidebarHeader>
				<ProjectSidebarHeader />
			</SidebarHeader>
			<Separator />
			<SidebarContent>
				<ProjectSidebarContent />
			</SidebarContent>
			<Separator />
			<SidebarFooter>
				<ProjectSidebarFooter />
			</SidebarFooter>
		</Sidebar>
	);
}

function ProjectSidebarHeader({ ...props }: {}) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="default"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
						>
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-6 items-center justify-center rounded-md">
								<Folder className="size-3 text-white" />
							</div>
							<div className="flex flex-col gap-0.5 leading-none">
								<span className="font-medium">The name of the project</span>
							</div>
							<ChevronsUpDown className="size-3 ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width)"
						align="start"
					>
						<DropdownMenuItem
						// key={version}
						// onSelect={() => setSelectedVersion(version)}
						>
							My first project
							{/* v{version}{" "} */}
							{/* {version === selectedVersion && <Check className="ml-auto" />} */}
						</DropdownMenuItem>
						<DropdownMenuItem
						// key={version}
						// onSelect={() => setSelectedVersion(version)}
						>
							My second project
							{/* v{version}{" "} */}
							{/* {version === selectedVersion && <Check className="ml-auto" />} */}
						</DropdownMenuItem>
						<DropdownMenuItem
							// key={version}
							// onSelect={() => setSelectedVersion(version)}
							disabled={true}
						>
							The name of the project
							<Check className="ml-auto" />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

function ProjectSidebarContent({ ...props }: {}) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Actions</SidebarGroupLabel>
			<TabsList className="!bg-transparent h-auto border-none w-full">
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<TabsTrigger value="overview" className="justify-start">
									<LayoutGrid />
									Overview
								</TabsTrigger>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<TabsTrigger value="commands" className="justify-start">
									<SquareTerminal />
									Commands
								</TabsTrigger>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<TabsTrigger value="containers" className="justify-start">
									<Container />
									Containers
								</TabsTrigger>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<TabsTrigger value="variables" className="justify-start">
									<FileLock />
									Variables
								</TabsTrigger>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton asChild>
								<TabsTrigger value="settings" className="justify-start">
									<Settings2 />
									Settings
								</TabsTrigger>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</TabsList>
		</SidebarGroup>
	);
}

function ProjectSidebarFooter({ ...props }: {}) {
	return (
		<SidebarMenu className="mt-auto">
			<SidebarMenuItem className="p-2">
				{/* <SidebarMenuButton asChild> */}
					<Link href={route("projects.index")}>
						<Button variant={"outline"}  className="w-full" size={"sm"}>
							<ArrowLeft />
							Go back to projects
						</Button>
					</Link>
				{/* </SidebarMenuButton> */}
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
