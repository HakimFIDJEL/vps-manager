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
		title: "Create",
		href: route("projects.create"),
	},
];

const steps = [
	{
		step: 1,
		title: "Project",
		icon: <File />,
	},
	{
		step: 2,
		title: "Variables",
		icon: <FileLock />,
	},
	{
		step: 3,
		title: "Docker",
		icon: <Container />,
	},
	{
		step: 4,
		title: "Makefile",
		icon: <SquareTerminal />,
	},
	{
		step: 5,
		title: "Done",
		icon: <Check />,
	},
];

export default function Page() {
	return (
		<AdminLayout breadcrumbs={breadcrumbs}>
			<Head title="Create a project" />
			<ProjectProvider>
				<SmoothItem delay={0.1}>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Folder className="w-5 h-5 text-muted-foreground" />
								Create a project
							</CardTitle>
							<CardDescription>
								Finally a new project! It took you a while.. Let's get started.
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
	const [isLoading, setIsLoading] = useState(false);

	const { data, setData, post, processing, errors } = useForm({
		project: project,	
	})

	useEffect(() => {
		setData('project', project);
	}, [project, setData]);

	function handleValidateStep1() {
		try {
			// Validate only step 1 fields
			ProjectSchema.pick({ name: true, folderPath: true }).parse(project);
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error("Please fill in all required fields");
			}
			return false;
		}
	}

	function handleValidateStep2() {
		try {
			// Validate only variables
			ProjectSchema.pick({ variables: true }).parse(project);
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error("Please configure at least one variable");
			}
			return false;
		}
	}

	function handleValidateStep3() {
		try {
			ProjectSchema.pick({ docker: true }).parse(project);

			// Check if the content is saved
			if (!project.docker.isSaved) {
				toast.error("Please save your Docker Compose");
				return false;
			}

			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error("Please configure your Docker Compose");
			}
			return false;
		}
	}

	function handleValidateStep4() {
		try {
			// Validate only commands
			ProjectSchema.pick({ commands: true }).parse(project);
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error("Please add at least one command");
			}
			return false;
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Validation de ton projet
			ProjectSchema.parse(project);

			toast.info("Creation of the project...");

			post(route("projects.store"));
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error("Please check all project fields");
			}

			setIsLoading(false);
		}
	}

	return (
		<Stepper defaultValue={1} totalSteps={steps.length}>
			<SmoothItem delay={0.3}>
				<Card className="bg-muted/50 dark:bg-background  border-0 shadow-none mb-4">
					<CardContent className="px-4 py-2">
						<div className="space-y-8 text-center">
							<StepperList>
								{steps.map(({ step, title, icon }) => (
									<StepperItem
										key={step}
										step={step}
										className="not-last:flex-1 max-md:items-start"
									>
										<StepperTrigger className="rounded max-md:flex-col">
											<StepperIndicator />
											<div className="text-center md:text-left">
												<StepperTitle>{title}</StepperTitle>
											</div>
										</StepperTrigger>
										{step < steps.length && (
											<StepperSeparator className="max-md:mt-3.5 md:mx-4" />
										)}
									</StepperItem>
								))}
							</StepperList>
						</div>
					</CardContent>
				</Card>
			</SmoothItem>

			<SmoothItem delay={0.5} layout={false}>
				<form onSubmit={handleSubmit}>
					
					<StepperBody>
						<StepperContent value={1}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<File className="w-5 h-5 text-muted-foreground" />
										Project details
									</CardTitle>
									<CardDescription>
										Fill in the details below to create a new project.
									</CardDescription>
									<CardAction>
										<StepperNavigation onNext={handleValidateStep1} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppProject />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={2}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<FileLock className="w-5 h-5 text-muted-foreground" />
										Variables
									</CardTitle>
									<CardDescription>
										Either fill in the environnement variables or import your .env file.
									</CardDescription>
									<CardAction>
										<StepperNavigation onNext={handleValidateStep2} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppVariables />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={3}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Container className="w-5 h-5 text-muted-foreground" />
										Docker
									</CardTitle>
									<CardDescription>
										Fill in your docker configuration, importing a docker-compose or
										create it from scratch.
									</CardDescription>
									<CardAction>
										<StepperNavigation onNext={handleValidateStep3} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppDocker />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={4}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<SquareTerminal className="w-5 h-5 text-muted-foreground" />
										Makefile
									</CardTitle>
									<CardDescription>
										Create your Makefile to easily execute your commands.
									</CardDescription>
									<CardAction>
										<StepperNavigation onNext={handleValidateStep4} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppMakefile />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={5}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Check className="w-5 h-5 text-muted-foreground" />
										Done
									</CardTitle>
									<CardDescription>
										Your project is ready! You can now create it.
									</CardDescription>
									<CardAction>
										<StepperNavigation
											nextButton={
												<Button
													variant="default"
													size="sm"
													type="submit"
													disabled={isLoading}
												>
													{isLoading ? (
														<LoaderCircleIcon className="animate-spin" />
													) : (
														<Plus />
													)}
													Create project
												</Button>
											}
										/>
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppDone />
								</CardContent>
							</Card>
						</StepperContent>
					</StepperBody>
				</form>
			</SmoothItem>
		</Stepper>
	);
}
