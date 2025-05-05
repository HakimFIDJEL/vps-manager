// Necessary imports
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Link } from '@inertiajs/react';

// Components
import { AdminLayout } from "@/components/layouts/admin-layout";

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
  } from "@/components/ui/stepper"
import {
	Card,
	CardAction,
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import {
	ArrowLeft,
	ArrowUpRight,
	Check,
	Folder,
	LayoutGrid,
	Plus,
	RefreshCcw,
	TableProperties,
	TriangleAlert,
	X,
} from "lucide-react";

// Types
import { type Project, type Container } from "@/types/models/project";



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

			<Stepper defaultValue={1} totalSteps={steps.length}>
				<Card className="bg-background border-0 shadow-none">
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
					</Card>
				</StepperContent>
			</Stepper>

			{/* Mettre ici les différentes cards, une card par étape */}


			
		</AdminLayout>
	);
}

