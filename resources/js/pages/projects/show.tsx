// Necessary imports
import { Head } from "@inertiajs/react";
import { useEffect } from "react";

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
} from "@/components/ui/card";
import { Tabs, TabsBody } from "@/components/ui/tabs";

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
			<ProjectProvider projectCreated={true}>
				{/* Content */}

				<Content />
			</ProjectProvider>
		</AdminLayout>
	);
}

function Content() {
	const { project, setProject, updateProject } = useProject();

	useEffect(() => {
		setProject(ProjectExample);
	}, []);


	return (
		<Tabs className="flex flex-row items-start justify-between gap-4" defaultValue={"variables"}>
			{/* Header + TabsContent */}
			<div className="flex flex-col gap-4 w-full">
				<SmoothItem delay={0.3} layout={false}>
					<Card className="bg-transparent border-0 shadow-none rounded-none">
						<CardHeader className="px-2 py-4">
							<CardTitle className="text-2xl">{project.name}</CardTitle>
							<CardDescription>
								Here you can view details, manage settings, and perform actions related
								to this project.
							</CardDescription>
						</CardHeader>
					</Card>

					<Separator />
				</SmoothItem>

				<SmoothItem delay={0.5} layout={false} className="!flex-grow-0">
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
			<SmoothItem delay={0.1} layout={false} className="self-start sticky top-[4.5rem]">
				<AppSidebar className="h-[calc(100vh-5rem)]" />
			</SmoothItem>
		</Tabs>
	);
}
