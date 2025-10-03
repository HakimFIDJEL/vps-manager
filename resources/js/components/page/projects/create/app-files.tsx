// Necessary imports
import { useEffect, Dispatch, SetStateAction, ReactNode } from "react";
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
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTrigger,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Icons
import {
	ArrowRight,
	FileArchive,
	Info,
	FolderGit2,
	Loader2,
	ArrowDownToLine,
	FileUp,
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
	
	return (
		<div className="grid gap-2">
			<div className="flex flex-col">
				<h3 className="text-sm font-medium mb-2">Import files</h3>
				<div className="grid grid-cols-3 gap-4">

					<ModalGithub>
						<button
							className={cn(
								"group w-full flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-primary/5 transition-all duration-200 cursor-pointer",
								"relative overflow-hidden",
							)}
						>
							<div className="p-2 bg-primary/10 rounded-md">
								<FolderGit2 className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 text-left">
								<div className="font-medium">Git</div>
								<div className="text-xs text-muted-foreground">
									Connect your project to a Git repository targeting a chosen branch or tag.
								</div>
							</div>
							<ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
						</button>
					</ModalGithub>

					<ModalImport>
						<button
							className={cn(
								"group w-full flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-primary/5 transition-all duration-200 cursor-pointer",
								"relative overflow-hidden",
							)}
						>
							<div className="p-2 bg-primary/10 rounded-md">
								<FileArchive className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1 text-left">
								<div className="font-medium">ZIP File</div>
								<div className="text-xs text-muted-foreground">
									Easily import your project by uploading it in a compressed ZIP format.
								</div>
							</div>
							<ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
						</button>
					</ModalImport>

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

			<div className="relative flex items-center my-6">
				<div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border" />
				<div className="relative bg-card px-2 mx-auto">
					<span className="text-xs text-muted-foreground">DISCLAIMER</span>
				</div>
			</div>

			<Alert>
				<AlertDescription>
					If a .env, Makefile, or docker-compose.yaml is found in the imported files
					or linked repository, their values will be auto-extracted and applied to
					the “Variables”, “Docker” and “Commands” steps. Otherwise, these files will
					be generated during project creation.
				</AlertDescription>
			</Alert>
		</div>
	);
}

function ModalGithub({ children } : { children: ReactNode }) {
	const { setCurrentValue } = useTabsContext();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						Import files via Git
					</AlertDialogTitle>
					<AlertDialogDescription>
						Connect your project to a Git repository targeting a chosen branch or tag.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>

					<div className="grid grid-cols-2">

						{/* Select repo */}
						<div>

						</div>

						{/* Select type & target */}
						<div>

						</div>

					</div>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							variant={"default"}
							type={"submit"}
						>
							<ArrowDownToLine />
							Pull repository
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function ModalImport({ children } : { children: ReactNode }) {
	const { setCurrentValue } = useTabsContext();

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						Import files via ZIP File
					</AlertDialogTitle>
					<AlertDialogDescription>
						Easily import your project by uploading it in a compressed ZIP format.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>

					<div className="grid grid-cols-2">

						{/* Import file */}
						<div>

						</div>

					</div>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							variant={"default"}
							type={"submit"}
						>
							<FileUp />
							Import ZIP File
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function AppGithub() {
	return <></>;
}
function AppImport() {
	return <></>;
}
