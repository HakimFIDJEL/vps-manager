// pages/projects/create.tsx

// Necessary imports
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Layout
import { AppLayout } from "@/layouts/app";

// Custom components
import { AppProject } from "@/components/page/projects/create/app-project";
import { AppVariables } from "@/components/page/projects/create/app-variables";
import { AppDocker } from "@/components/page/projects/create/app-docker";
import { AppFiles } from "@/components/page/projects/create/app-files";
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
import { ProjectSchema } from "@/lib/projects/type";

// Types
import { type BreadcrumbItem } from "@/types";

// Custom hooks & providers
import { useProject, ProjectProvider } from "@/contexts/project-context";

// Icons
import {
	ArrowLeft,
	Check,
	Container,
	File,
	FileArchive,
	FileLock,
	Layers,
	LoaderCircleIcon,
	Plus,
	SquareTerminal,
} from "lucide-react";

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
		title: "Create",
		href: route("projects.create"),
		link: true,
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
		title: "Files",
	},
	{
		step: 3,
		title: "Variables",
	},
	{
		step: 4,
		title: "Docker",
	},
	{
		step: 5,
		title: "Commands",
	},
	{
		step: 6,
		title: "Done",
	},
];

export default function Page() {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Create a project" />
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
	const { project } = useProject();

	const { data, setData, post, processing } = useForm({
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
	const [validateStep5, setValidateStep5] = useState<() => Promise<boolean>>(
		() => async () => true,
	);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
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
				toast.error("An error occured", {
					description:
						error.errors[0].message || "Please fill in all the required fields",
				});
			}
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
		if (e.key === "Enter") {
			e.preventDefault();
		}
	}

	return (
		<Stepper defaultValue={2} totalSteps={steps.length}>
			<SmoothItem delay={0.3}>
				<Card className="bg-background  border-0 shadow-none mb-4">
					<CardContent className="px-4 py-2">
						<div className="space-y-8 text-center">
							<StepperList>
								{steps.map(({ step, title }) => (
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
											<FileArchive className="w-5 h-5 text-muted-foreground" />
										</div>
										<div>
											<CardTitle className="flex items-center gap-2 text-xl">
												Files
											</CardTitle>
											<CardDescription>
												Fetch from Git, upload a zipped project, or simply skip this step
												if your Docker environment requires only external images.{" "}
											</CardDescription>
										</div>
									</div>

									<CardAction>
										<StepperNavigation onNext={validateStep2} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppFiles setValidate={setValidateStep2} />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={3}>
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
										<StepperNavigation onNext={validateStep3} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppVariables setValidate={setValidateStep3} />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={4}>
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
										<StepperNavigation onNext={validateStep4} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppDocker setValidate={setValidateStep4} />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={5}>
							<Card>
								<CardHeader>
									<div className="flex items-center gap-3">
										<div className="bg-card border rounded-md p-2">
											<SquareTerminal className="w-5 h-5 text-muted-foreground" />
										</div>
										<div>
											<CardTitle className="flex items-center gap-2 text-xl">
												Commands
											</CardTitle>
											<CardDescription>
												Create your Makefile to easily execute your commands.
											</CardDescription>
										</div>
									</div>

									<CardAction>
										<StepperNavigation onNext={validateStep5} />
									</CardAction>
								</CardHeader>
								<Separator />
								<CardContent>
									<AppMakefile setValidate={setValidateStep5} />
								</CardContent>
							</Card>
						</StepperContent>
						<StepperContent value={6}>
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
