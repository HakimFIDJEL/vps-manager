// pages/projects/show.tsx

// Necessary imports
import { Head } from "@inertiajs/react";
import * as React from "react";
import { Link } from "@inertiajs/react";

// Components
import { AppLayout } from "@/layouts/app";
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
	Layers,
	LayoutGrid,
	Settings2,
	SquareTerminal,
} from "lucide-react";

// Contexts
import { useProject, ProjectProvider } from "@/contexts/project-context";
import { useDocker } from "@/contexts/docker-context";

// Libs
import { type BreadcrumbItem } from "@/types";
import { Project, ProjectExample } from "@/lib/projects/type";
import { DockerContainer } from "@/lib/docker/type";

// Functions
import { parseDockerCompose } from "@/lib/docker/parser";

export default function Page({
	project,
	containers,
}: {
	project: Project;
	containers: DockerContainer[];
}) {
	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: "VPS Manager",
			link: false,
		},
		{
			title: "Projects",
			href: route("projects.index"),
			link: true,
		},
		{
			title: project.path,
			href: route("projects.show", { inode: project.inode }),
			link: true,
		},
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={project.path} />
			<ProjectProvider>
				{/* Content */}

				<Content project={project} containersFetched={containers} />
			</ProjectProvider>
		</AppLayout>
	);
}

function Content({
	project,
	containersFetched,
}: {
	project: Project;
	containersFetched: DockerContainer[];
}) {
	const { setProject, updateProject } = useProject();
	const { handleDocker, setContainers } = useDocker();
	const timerRef = React.useRef<number | null>(null);
	const [timerPercentage, setTimerPercentage] = React.useState(100);

	const tabs = [
		{ value: "overview", label: "Overview", icon: <LayoutGrid /> },
		{ value: "commands", label: "Commands", icon: <SquareTerminal /> },
		{ value: "containers", label: "Containers", icon: <Container /> },
		{ value: "variables", label: "Variables", icon: <FileLock /> },
		{ value: "settings", label: "Settings", icon: <Settings2 /> },
	];

	React.useEffect(() => {
		// Updating project
		setProject(project);

		// Dynamic calculation of containers, volumes, and networks
		if (project.docker.isSaved) {
			if (project.docker.isStrict) {
				const save_parsed = parseDockerCompose(
					project.docker.content,
					project.docker.isStrict,
					project.variables.length,
				);

				if (save_parsed.isValid && save_parsed.updatedContent) {
					updateProject("docker", {
						content: save_parsed.updatedContent,
						isSaved: true,
						isStrict: project.docker.isStrict,
						parsed: {
							services: save_parsed.services,
							volumes: save_parsed.volumes,
							networks: save_parsed.networks,
						},
					});
				}
			}
		}

		// Updating containers
		setContainers(containersFetched);
	}, []);

	React.useEffect(() => {
		let remaining = 60;
		let timer = 60;
		setTimerPercentage(100);

		timerRef.current = window.setInterval(() => {
			handleDocker({ type: "docker-containers-list" });
			remaining = timer;
			setTimerPercentage(100);
		}, timer * 1000);

		const progressInterval = window.setInterval(() => {
			remaining--;
			setTimerPercentage((remaining / 60) * 100);
		}, 1000);

		return () => {
			if (timerRef.current) window.clearInterval(timerRef.current);
			window.clearInterval(progressInterval);
		};
	}, [handleDocker]);


	return (
		<Tabs
			className="flex flex-row items-start justify-between gap-4"
			defaultValue={"overview"}
		>
			{/* Header + TabsContent */}
			<div className="flex flex-col w-full gap-4">
				<SmoothItem delay={0.1} layout={false}>
					<Card>
						<CardHeader className="gap-0 gap-x-1.5">
							<div className="flex items-center gap-3">
								<div className="bg-card border rounded-md p-2">
									<Layers className="w-5 h-5 text-muted-foreground" />
								</div>
								<div>
									<CardTitle className="flex items-center gap-2 text-xl">
										{project.path}
									</CardTitle>
									<CardDescription>
										Here you can view details, manage settings, and perform actions
										related to this project.
									</CardDescription>
								</div>
							</div>

							<CardAction className="self-center">
								<Link href={route("projects.index")}>
									<Button variant={"outline"} className="group">
										<ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.75 transition-transform duration-300" />
										Go back to projects
									</Button>
								</Link>
							</CardAction>
						</CardHeader>
					</Card>
				</SmoothItem>

				<SmoothItem delay={0.3} layout={false} className="!flex-grow-0 w-full">
					<TabsNavigation tabs={tabs} />
				</SmoothItem>

				<SmoothItem delay={0.5} layout={false} className="!flex-grow-0 w-full">
					<TabsBody className="mt-4">
						<AppOverview />
						<AppMakefile />
						<AppVariables />
						<AppDocker timerPercentage={timerPercentage} />
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
