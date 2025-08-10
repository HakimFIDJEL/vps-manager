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
import { AppLayout } from "@/components/layouts/app-layout";

import { AppProject } from "@/components/page/projects/create/app-project";
import { AppVariables } from "@/components/page/projects/create/app-variables";
import { AppDocker } from "@/components/page/projects/create/app-docker";
import { AppMakefile } from "@/components/page/projects/create/app-makefile";
import { AppDone } from "@/components/page/projects/create/app-done";
import { SmoothItem } from "@/components/ui/smooth-resized";

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

// Schemas
import { FolderSchema } from "@/lib/projects/type";

// Icons
import {
	ArrowLeft,
	Check,
	Container,
	File,
	FileLock,
	Folder,
	Layers,
	LoaderCircleIcon,
	Plus,
	SquareTerminal,
} from "lucide-react";

// Contexts
import { CommandProvider } from "@/contexts/command-context";

const breadcrumbs: BreadcrumbItem[] = [
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
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Create a project" />
			{/* Project provider has every providers needed (commands, variables, docker etc..) */}
			<ProjectProvider>
				<SmoothItem delay={0.1}>
					<Card>
						<CardHeader className="gap-0 gap-x-1.5">
							<div className="flex items-center gap-3">
								<div className="bg-card border rounded-md p-2">
									<Layers className="w-5 h-5 text-muted-foreground" />
								</div>
								<div>
									<CardTitle className="flex items-center gap-2 text-xl">
										Create a project
									</CardTitle>
									<CardDescription>
										Finally a new project! It took you a while.. Let's get started.
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

				<Content />
			</ProjectProvider>
		</AppLayout>
	);
}

function Content() {
	const { project, updateProject } = useProject();

	const { data, setData, post, processing, errors, wasSuccessful } = useForm({
		project: project,
	});

	useEffect(() => {
		setData("project", project);
	}, [project, setData]);

	const [validateStep1, setValidateStep1] = useState<() => Promise<boolean>>(
		() => async () => true,
	);
	const [validateStep2, setValidateStep2] = useState<() => Promise<boolean>>(
		() => async () => true,
	);
	const [validateStep3, setValidateStep3] = useState<() => Promise<boolean>>(
		() => async () => true,
	);
	const [validateStep4, setValidateStep4] = useState<() => Promise<boolean>>(
		() => async () => true,
	);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			// console.log("Submitting project:", project);

			ProjectSchema.parse(project);

			toast.loading("Creating the project...", {
				id: "create-project",
			});

			post(route("projects.store"), {
				onError: (errors) => {
					toast.dismiss("create-project");
					const messages = Object.values(errors).flat();
					if (messages.length) {
						toast.error("An error occured", { description: messages.join("\n") });
					} else {
						toast.error("An unknown error occurred");
					}
				},
			});
		} catch (error) {
			toast.dismiss("create-project");
			if (error instanceof z.ZodError) {
				toast.error(
					error.errors[0].message || "Please fill in all the required fields",
				);
			}
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
		if (e.key === "Enter") {
			e.preventDefault();
		}
	}

	return (
		<Stepper defaultValue={1} totalSteps={steps.length}>
			<SmoothItem delay={0.3}>
				<Card className="bg-background  border-0 shadow-none mb-4">
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
											<StepperSeparator className="max-md:mt-3.5 md:mx-4 bg-border" />
										)}
									</StepperItem>
								))}
							</StepperList>
						</div>
					</CardContent>
				</Card>
			</SmoothItem>

			<SmoothItem delay={0.5} layout={false}>
				<form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
					<StepperBody>
						<StepperContent value={1}>
							<Card>
								<CardHeader>
									<div className="flex items-center gap-3">
										<div className="bg-card border rounded-md p-2">
											<File className="w-5 h-5 text-muted-foreground" />
										</div>
										<div>
											<CardTitle className="flex items-center gap-2 text-xl">
												Project details
											</CardTitle>
											<CardDescription>
												Fill in the details below to create a new project.
											</CardDescription>
										</div>
									</div>

									<CardAction>
										<StepperNavigation onNext={validateStep1} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppProject setValidate={setValidateStep1} />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={2}>
							<Card>
								<CardHeader>
									<div className="flex items-center gap-3">
										<div className="bg-card border rounded-md p-2">
											<FileLock className="w-5 h-5 text-muted-foreground" />
										</div>
										<div>
											<CardTitle className="flex items-center gap-2 text-xl">
												Variables
											</CardTitle>
											<CardDescription>
												Either fill in the environnement variables or import your .env file.
											</CardDescription>
										</div>
									</div>

									<CardAction>
										<StepperNavigation onNext={validateStep2} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppVariables setValidate={setValidateStep2} />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={3}>
							<Card className="overflow-visible">
								<CardHeader>
									<div className="flex items-center gap-3">
										<div className="bg-card border rounded-md p-2">
											<Container className="w-5 h-5 text-muted-foreground" />
										</div>
										<div>
											<CardTitle className="flex items-center gap-2 text-xl">
												Docker
											</CardTitle>
											<CardDescription>
												Fill in your docker configuration, importing a docker-compose or
												create it from scratch.
											</CardDescription>
										</div>
									</div>

									<CardAction>
										<StepperNavigation onNext={validateStep3} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppDocker setValidate={setValidateStep3} />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={4}>
							<Card>
								<CardHeader>
									<div className="flex items-center gap-3">
										<div className="bg-card border rounded-md p-2">
											<SquareTerminal className="w-5 h-5 text-muted-foreground" />
										</div>
										<div>
											<CardTitle className="flex items-center gap-2 text-xl">
												Makefile
											</CardTitle>
											<CardDescription>
												Create your Makefile to easily execute your commands.
											</CardDescription>
										</div>
									</div>

									<CardAction>
										<StepperNavigation onNext={validateStep4} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppMakefile setValidate={setValidateStep4} />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={5}>
							<Card>
								<CardHeader>
									<div className="flex items-center gap-3">
										<div className="bg-card border rounded-md p-2">
											<Check className="w-5 h-5 text-muted-foreground" />
										</div>
										<div>
											<CardTitle className="flex items-center gap-2 text-xl">
												Done
											</CardTitle>
											<CardDescription>
												Your project is ready! You can now create it.
											</CardDescription>
										</div>
									</div>

									<CardAction>
										<StepperNavigation
											nextButton={
												<Button
													variant="default"
													size="sm"
													type="submit"
													disabled={processing}
												>
													{processing ? (
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
