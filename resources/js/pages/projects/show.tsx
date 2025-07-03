// Necessary imports
import { Head } from "@inertiajs/react";
import * as React from "react";
import { Link } from "@inertiajs/react";

// Components
import { AdminLayout } from "@/components/layouts/admin-layout";
import { AppSidebar } from "@/components/page/projects/show/app-sidebar";
import { AppOverview } from "@/components/page/projects/show/app-overview";
import { AppMakefile } from "@/components/page/projects/show/app-makefile";
import { AppVariables } from "@/components/page/projects/show/app-variables";
import { AppDocker } from "@/components/page/projects/show/app-docker";
import { AppSettings } from "@/components/page/projects/show/app-settings";
import { SmoothItem } from "@/components/ui/smooth-resized";

// Shadcn UI components
import { Separator } from "@/components/ui/separator";
import {
	Card,
	CardTitle,
	CardDescription,
	CardHeader,
	CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Tabs,
	TabsBody,
	TabsList,
	TabsNavigation,
	TabsTrigger,
} from "@/components/ui/tabs";

// Icons
import {
	ArrowLeft,
	Container,
	FileLock,
	Folder,
	LayoutGrid,
	Settings2,
	SquareTerminal,
} from "lucide-react";

// Contexts
import { useProject, ProjectProvider } from "@/contexts/project-context";

// Libs
import { type BreadcrumbItem } from "@/types";
import { ProjectExample } from "@/lib/projects/type";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Dashboard",
		href: route("dashboard"),
	},
	{
		title: "Projects",
		href: route("projects.index"),
	},
	{
		title: "The name of the project",
		href: route("projects.show", { inode: 1048577 }),
	},
];

export default function Page() {
	return (
		<AdminLayout breadcrumbs={breadcrumbs}>
			<Head title="The name of the project" />
			<ProjectProvider>
				{/* Content */}

				<Content />
			</ProjectProvider>
		</AdminLayout>
	);
}

function Content() {
	const { project, setProject, updateProject } = useProject();

	const tabs = [
		{ value: "overview", label: "Overview", icon: <LayoutGrid /> },
		{ value: "commands", label: "Commands", icon: <SquareTerminal /> },
		{ value: "containers", label: "Containers", icon: <Container /> },
		{ value: "variables", label: "Variables", icon: <FileLock /> },
		{ value: "settings", label: "Settings", icon: <Settings2 /> },
	];

	React.useEffect(() => {
		setProject(ProjectExample);
	}, []);

	return (
		<Tabs
			className="flex flex-row items-start justify-between gap-4"
			defaultValue={"variables"}
		>
			{/* Header + TabsContent */}
			<div className="flex flex-col w-full gap-4">
				<SmoothItem delay={0.1} layout={false}>
					{/* <Card className="bg-transparent border-0 shadow-none rounded-none">
						
						<CardHeader className="px-2 py-4">
							
							<CardTitle className="text-2xl"></CardTitle>
							<CardDescription>
								
							</CardDescription>
							<CardAction>
								<Link href={route("projects.index")}>
									<Button variant={"outline"} className="w-full">
										<ArrowLeft />
										Go back to projects
									</Button>
								</Link>
							</CardAction>
						</CardHeader>
					</Card> */}

					<Card>
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="bg-card border rounded-md p-2">
									<Folder className="w-5 h-5 text-muted-foreground" />
								</div>
								<div>
									<CardTitle className="flex items-center gap-2 text-xl">
										{project.name}
									</CardTitle>
									<CardDescription>
										Here you can view details, manage settings, and perform actions
										related to this project.
									</CardDescription>
								</div>
							</div>

							<CardAction>
								<Link href={route("projects.index")}>
									<Button variant={"outline"}>
										<ArrowLeft />
										Go back to projects
									</Button>
								</Link>
							</CardAction>
						</CardHeader>
					</Card>
				</SmoothItem>

				<SmoothItem delay={0.3} layout={false} className="!flex-grow-0 w-full">
					<TabsNavigation tabs={tabs} className="mb-12" />

					<TabsBody className="mt-4">
						<AppOverview />
						<AppMakefile />
						<AppVariables />
						<AppDocker />
						<AppSettings />
					</TabsBody>
				</SmoothItem>
			</div>

			{/* Sidebar */}
			{/* <SmoothItem
				delay={0.1}
				layout={false}
				className="self-start sticky top-[4.5rem] right-[0.5rem]"
			>
				<AppSidebar className="h-[calc(100vh-5rem)]" />
			</SmoothItem> */}
		</Tabs>
	);
}
