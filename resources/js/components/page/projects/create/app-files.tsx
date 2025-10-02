// Necessary imports
import { useEffect, Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

// Libs

// Custom components

// Shadcn UI components
import {
	Tabs,
	TabsBody,
	TabsContent,
	TabsList,
	TabsTrigger,
	useTabsContext,
} from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Icons
import {
	ArrowRight,
	Github,
	FileArchive,
	type LucideIcon,
	TriangleAlert,
	Info,
} from "lucide-react";

// Contexts
import { useProject } from "@/contexts/project-context";

export function AppFiles({
	setValidate,
}: {
	setValidate: Dispatch<SetStateAction<() => Promise<boolean>>>;
}) {
	// Custom hooks
	const { project } = useProject();

	const validator = async () => {
		// Validation

		return true;
	};

	useEffect(() => {
		setValidate(() => validator);
	}, [setValidate, project.docker]);

	return (
		// <Tabs defaultValue={project.docker.content ? "docker" : "empty"}>
		<Tabs defaultValue="none">
			<TabsList className="hidden">
				<TabsTrigger value="none">None</TabsTrigger>
				<TabsTrigger value="github">Github</TabsTrigger>
				<TabsTrigger value="import">Import</TabsTrigger>
			</TabsList>
			<TabsBody>
				<TabsContent value="none">
					<AppNone />
				</TabsContent>
				<TabsContent value="github">
					<AppGithub />
				</TabsContent>
				<TabsContent value="import">
					<AppImport />
				</TabsContent>
			</TabsBody>
		</Tabs>
	);
}

export function AppNone() {
	const { setCurrentValue } = useTabsContext();

	return (
		<div className="grid gap-4">
			<Alert>
				<TriangleAlert />
				<AlertTitle>Disclaimer in case of override</AlertTitle>
				<AlertDescription>
					If a .env, Makefile, or docker-compose.yaml is found in the imported files
					or linked repository, their values will be auto-extracted and applied to
					the “Variables” and “Commands” steps. Otherwise, these files will be
					generated during project creation.
				</AlertDescription>
			</Alert>
			
			<div className="flex flex-col">
				<h3 className="text-sm font-medium mb-2">Import files</h3>
				<div className="grid grid-cols-3 gap-4">
					<TypeLink
						title="Github"
						subtitle="Connect your project to a GitHub repository targeting a chosen branch or tag."
						icon={Github}
						onClick={() => setCurrentValue("github")}
					/>

					<TypeLink
						title="ZIP file"
						subtitle="Easily import your project by uploading it in a compressed ZIP format."
						icon={FileArchive}
						onClick={() => setCurrentValue("import")}
					/>

					<div
						className={cn(
							"group w-full flex items-start gap-4 p-4 rounded-lg border bg-card",
							"relative overflow-hidden",
						)}
					>
						<div className="p-2 bg-muted-foreground/10 rounded-md">
							<Info className="h-5 w-5 text-muted-foreground" />
						</div>
						<div className="flex-1 text-left">
							<div className="font-medium">Skip available</div>
							<div className="text-xs text-muted-foreground">
								Continue to the next step if your Docker configuration depends only on
								external images.
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
function AppGithub() {
	return <></>;
}
function AppImport() {
	return <></>;
}

function TypeLink({
	title,
	subtitle,
	icon: Icon,
	onClick,
	className,
}: {
	title: string;
	subtitle: string;
	icon?: LucideIcon;
	onClick: () => void;
	className?: string;
}) {
	return (
		<button
			onClick={onClick}
			type={"button"}
			className={cn(
				"group w-full flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-primary/5 transition-all duration-200 cursor-pointer",
				"relative overflow-hidden",
				className,
			)}
		>
			{Icon && (
				<div className="p-2 bg-primary/10 rounded-md">
					<Icon className="h-5 w-5 text-primary" />
				</div>
			)}
			<div className="flex-1 text-left">
				<div className="font-medium">{title}</div>
				<div className="text-xs text-muted-foreground">{subtitle}</div>
			</div>
			<ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
		</button>
	);
}
