// Necessary imports
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Link } from '@inertiajs/react';

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
  } from "@/components/ui/stepper"
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

// Icons
import {
	ArrowLeft,
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
	},
	{
	  step: 2,
	  title: "Variables",
	},
	{
	  step: 3,
	  title: "Docker",
	},
	{
	  step: 4,
	  title: "Makefile",
	},
	{
	  step: 5,
	  title: "Done",
	},
  ]

export default function Page() {
	

	return (
		<AdminLayout breadcrumbs={breadcrumbs}>
			<Head title="Create a project" />

			<Card>
				<CardHeader>
					<CardTitle>Create a new project</CardTitle>
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

			<Stepper defaultValue={3} totalSteps={steps.length}>
				<Card className="bg-muted/50 dark:bg-background  border-0 shadow-none mb-4">
					<CardContent>
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
											<StepperSeparator className="max-md:mt-3.5 md:mx-4" />
										)}
									</StepperItem>
								))}
							</StepperList>
						</div>
					</CardContent>
				</Card>

				<StepperBody>
					<StepperContent value={1}>
						<Card>
							<CardHeader>
								<CardTitle>Project details</CardTitle>
								<CardDescription>
									Fill in the details below to create a new project.
								</CardDescription>
								<CardAction>
									<StepperNavigation />
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
								<CardTitle>Variables</CardTitle>
								<CardDescription>
									Either fill in the environnement variables or import your .env file.
								</CardDescription>
								<CardAction>
									<StepperNavigation />
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
								<CardTitle>Docker</CardTitle>
								<CardDescription>
									Fill in your docker configuration, importing a docker-compose or create it from scratch.
								</CardDescription>
								<CardAction>
									<StepperNavigation />
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
								<CardTitle>Makefile</CardTitle>
								<CardDescription>
									To easily execute your commands, fill in the Makefile configuration.
								</CardDescription>
								<CardAction>
									<StepperNavigation />
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
								<CardTitle>Done</CardTitle>
								<CardDescription>
									Your project is ready! You can now start using it.
								</CardDescription>
								<CardAction>
									<StepperNavigation />
								</CardAction>
							</CardHeader>
							<Separator />
							<CardContent>
								<AppDone />
							</CardContent>
						</Card>
					</StepperContent>
				</StepperBody>

			</Stepper>

			{/* Mettre ici les différentes cards, une card par étape */}


			
		</AdminLayout>
	);
}

