// Necessary imports
import { type BreadcrumbItem } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { useProject } from "@/contexts/project-context";
import { ProjectProvider } from "@/contexts/project-context";
import { ProjectSchema } from "@/lib/projects/type";
import { toast } from "sonner";
import { z } from "zod";
import { useEffect, useState } from "react";

// Components
import { AdminLayout } from "@/components/layouts/admin-layout";

import { AppProject } from "@/components/page/projects/create/app-project";
import { AppVariables } from "@/components/page/projects/create/app-variables";
import { AppDocker } from "@/components/page/projects/create/app-docker";
import { AppMakefile } from "@/components/page/projects/create/app-makefile";
import { AppDone } from "@/components/page/projects/create/app-done";

// Shadcn UI components
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
	StepperContent,
	StepperList,
	StepperNavigation,
	StepperBody,
} from "@/components/ui/stepper";
import {
	Card,
	CardAction,
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SmoothItem } from "@/components/ui/smooth-resized";

// Icons
import {
	ArrowLeft,
	Check,
	Container,
	File,
	FileLock,
	Folder,
	LoaderCircleIcon,
	Plus,
	SquareTerminal,
} from "lucide-react";

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
		href: route("projects.show"),
	},
];


export default function Page() {
	return (
		<AdminLayout breadcrumbs={breadcrumbs}>
			<Head title="The name of the project" />
			<ProjectProvider>
				<SmoothItem delay={0.1}>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Folder className="w-5 h-5 text-muted-foreground" />
								The name of the project
							</CardTitle>
							<CardDescription>
								{/* Description */}
							</CardDescription>
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

				<Content />
			</ProjectProvider>
		</AdminLayout>
	);
}

function Content() {
	const { project, updateProject } = useProject();




	return (
		<>
		</>
	);
}
