// Necessary imports
import { useRef, useState } from "react";

// Custom components
import { SmoothAnimate } from "@/components/ui/smooth-resized";

// Shadcn UI components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogBody,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

// Icons
import {
	Search,
	Trash,
	OctagonAlert,
	Play,
	Plus,
	FileUp,
	Download,
	Loader2,
} from "lucide-react";

// Contexts
import { useProject } from "@/contexts/project-context";
import { useCommand } from "@/contexts/command-context";
import type { CommandAction } from "@/lib/commands/type";

import {
	CreateCommand,
	EditCommand,
	ImportMakefile,
} from "../create/app-makefile";
import { Command } from "@/lib/commands/type";

export function AppMakefile() {
	// States
	const [search, setSearch] = useState<string>("");

	// Refs
	const inputRef = useRef<HTMLInputElement>(null);

	// Custom Hooks
	const { project } = useProject();
	const { handleCommand, loading } = useCommand();

	return (
		<TabsContent value="commands" className="space-y-12">
			{/* Wrapper */}
			{/* <Alert>
				<AlertTitle>Success! Your changes have been saved</AlertTitle>
				<AlertDescription>
				This is an alert with icon, title and description.
				</AlertDescription>
			</Alert> */}

			<>
				<h3 className="text-sm font-medium mb-2">Actions</h3>
				<div className="flex flex-col gap-2 w-full">
					<SmoothAnimate className="flex items-center gap-2 relative">
						{project.commands.length > 0 && (
							<Input
								ref={inputRef}
								name="search"
								placeholder="Filter commands..."
								className="z-1 relative"
								addonText={<Search className="h-4 w-4" />}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								readOnly={project.commands.length === 0 || loading}
							/>
						)}
					</SmoothAnimate>
					<SmoothAnimate
						className={`grid gap-2 ${project.commands.length > 0 ? "grid-cols-4" : "grid-cols-3"}`}
					>
						{/* Add command */}
						<CreateCommand handleCommand={handleCommand} loading={loading}>
							<Button
								type={"button"}
								variant={"outline"}
								disabled={loading}
								className="h-auto w-full flex items-start gap-4 p-4 rounded-lg border hover:!border-primary/50 transition-all duration-200 cursor-pointer relative overflow-hidden"
							>
								<div className="p-2 bg-primary/10 rounded-md">
									<Plus className="h-5 w-5 text-primary" />
								</div>
								<div className="flex-1 text-left">
									<div className="font-medium text-foreground">Add command</div>
									<div className="text-xs text-muted-foreground">
										Create a new command
									</div>
								</div>
							</Button>
						</CreateCommand>

						{/* Import Makefile */}
						<ImportMakefile handleCommand={handleCommand} loading={loading}>
							<Button
								type={"button"}
								variant={"outline"}
								disabled={loading}
								className="h-auto w-full flex items-start gap-4 p-4 rounded-lg border hover:!border-primary/50 transition-all duration-200 cursor-pointer relative overflow-hidden"
							>
								<div className="p-2 bg-primary/10 rounded-md">
									<FileUp className="h-5 w-5 text-primary" />
								</div>
								<div className="flex-1 text-left">
									<div className="font-medium text-foreground">Import makefile</div>
									<div className="text-xs text-muted-foreground">
										Load or paste existing file
									</div>
								</div>
							</Button>
						</ImportMakefile>

						<ExportMakeFile loading={loading} />

						{project.commands.length > 0 && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										type={"button"}
										variant={"outline"}
										disabled={loading}
										className="h-auto w-full flex items-start gap-4 p-4 rounded-lg border hover:!border-destructive/50  transition-all duration-200 cursor-pointer relative overflow-hidden"
									>
										<div className="p-2 bg-destructive/10 rounded-md">
											<Trash className="h-5 w-5 text-destructive" />
										</div>
										<div className="flex-1 text-left">
											<div className="font-medium text-foreground">Delete commands</div>
											<div className="text-xs text-muted-foreground">
												Remove all commands
											</div>
										</div>
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle className="flex items-center gap-2">
											<OctagonAlert className="w-4 h-4 text-destructive" />
											Delete all commands
										</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete all commands?
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogBody>
										<AlertDialogFooter>
											<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
											<AlertDialogAction
												disabled={loading}
												onAction={async () => {
													return await handleCommand({ type: "command-delete-all" });
												}}
												variant={"destructive"}
											>
												{loading ? <Loader2 className="animate-spin" /> : <Trash />}
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogBody>
								</AlertDialogContent>
							</AlertDialog>
						)}
					</SmoothAnimate>
				</div>
			</>

			<CommandList
				search={search}
				handleCommand={handleCommand}
				loading={loading}
			/>
		</TabsContent>
	);
}

export function CommandList({
	search = "",
	handleCommand,
	loading = false,
	carrousel = false,
}: {
	search?: string;
	handleCommand: (action: CommandAction) => Promise<boolean>;
	loading?: boolean;
	carrousel?: boolean;
}) {
	// Custom hooks
	const { project } = useProject();

	// Custom methods
	async function handleDelete(target: string) {
		const command = project.commands.find((c) => c.target === target);
		if (!command) return false;

		return await handleCommand({ type: "command-delete", command: command });
	}

	async function handleRun(target: string) {
		const command = project.commands.find((c) => c.target === target);
		if (!command) return false;

		return await handleCommand({ type: "command-run", command: command });
	}

	// Variables
	const filteredCommands = project.commands.filter((command) => {
		return command.target.toLowerCase().includes(search.toLowerCase());
	});

	return (
		<SmoothAnimate>
			<h3 className="text-sm font-medium mb-2 mt-8">Commands</h3>

			{filteredCommands.length === 0 ? (
				<div className="flex items-center justify-center border border-border border-dashed rounded-md px-4 py-4 bg-muted/50">
					<p className="text-sm text-muted-foreground">
						No commands added yet. Click on "Add command" to create one.
					</p>
				</div>
			) : carrousel ? (
				<Carousel className="space-y-2">
					<CarouselContent>
						{filteredCommands.map((command, index) => (
							<CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
								<CommandCard
									key={command.target}
									command={command}
									loading={loading}
									handleRun={handleRun}
									handleDelete={handleDelete}
									handleCommand={handleCommand}
								/>
							</CarouselItem>
						))}
					</CarouselContent>
					{filteredCommands.length > 3 && (
						<div className="relative flex items-center justify-between gap-2">
							<CarouselPrevious className="relative left-0 top-0 rounded-md translate-y-0 w-1/2" />
							<CarouselNext className="relative right-0 top-0 rounded-md translate-y-0  w-1/2" />
						</div>
					)}
				</Carousel>
			) : (
				<SmoothAnimate className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
					{filteredCommands.map((command) => (
						<CommandCard
							key={command.target}
							command={command}
							loading={loading}
							handleRun={handleRun}
							handleDelete={handleDelete}
							handleCommand={handleCommand}
						/>
					))}
				</SmoothAnimate>
			)}
		</SmoothAnimate>
	);
}

function CommandCard({
	command,
	loading,
	handleRun,
	handleDelete,
	handleCommand,
	...props
}: {
	command: Command;
	loading?: boolean;
	handleRun: (target: string) => Promise<boolean>;
	handleDelete: (target: string) => Promise<boolean>;
	handleCommand: (action: CommandAction) => Promise<boolean>;
}) {
	return (
		<div
			key={command.target}
			className="group relative rounded-md border border-border bg-card p-4 transition-all hover:border-primary/50 flex items-center w-full"
		>
			<div className="flex items-center justify-between gap-2 w-full relative">
				<div className="flex-grow-0">
					<p className="font-mono">{command.target}</p>
					<p className="text-sm text-muted-foreground mt-1">{command.description}</p>
				</div>
				<div className="absolute top-0 bottom-0 right-0 flex items-center bg-gradient-to-l from-card via-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity pl-[150px]">
					<div className=" flex items-center gap-1  ">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant={"ghost"}
									size={"icon"}
									type={"button"}
									disabled={loading}
								>
									<Play className="h-4 w-4 text-muted-foreground" />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle className="flex items-center gap-2">
										<OctagonAlert className="w-4 h-4 text-primary" />
										Run command
									</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to run
										<Badge variant={"outline"} className="font-mono mx-2">
											{command.target}
										</Badge>
										command ?
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogBody>
									<AlertDialogFooter>
										<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onAction={async () => {
												return await handleRun(command.target);
											}}
											variant={"default"}
											type={"button"}
											disabled={loading}
										>
											{loading ? <Loader2 className="animate-spin" /> : <Play />}
											Run
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogBody>
							</AlertDialogContent>
						</AlertDialog>
						<EditCommand
							command={command}
							handleCommand={handleCommand}
							loading={loading}
						/>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant={"ghost"}
									size={"icon"}
									type={"button"}
									disabled={loading}
								>
									<Trash className="h-4 w-4 text-muted-foreground" />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle className="flex items-center gap-2">
										<OctagonAlert className="w-4 h-4 text-destructive" />
										Delete command
									</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to delete
										<Badge variant={"outline"} className="font-mono mx-2">
											{command.target}
										</Badge>
										command ?
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogBody>
									<AlertDialogFooter>
										<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onAction={async () => {
												return await handleDelete(command.target);
											}}
											variant={"destructive"}
											type={"button"}
											disabled={loading}
										>
											{loading ? <Loader2 className="animate-spin" /> : <Trash />}
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogBody>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</div>
		</div>
	);
}

function ExportMakeFile({ loading = false }: { loading?: boolean }) {
	// Custom Hooks
	const { project } = useProject();

	function handleExport() {
		// Créer le contenu du Makefile
		const makefileContent = project.commands
			.map((command) => {
				// Ajouter la description en commentaire
				const description = command.description ? `# ${command.description}\n` : "";

				// Formater la commande
				const formattedCommand = command.command
					.split("\n")
					.map((line) => `\t${line}`)
					.join("\n");

				return `${description}${command.target}:\n${formattedCommand}`;
			})
			.join("\n\n");

		// Créer un blob avec le contenu
		const blob = new Blob([makefileContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		// Créer un lien de téléchargement
		const link = document.createElement("a");
		link.href = url;
		link.download = "Makefile";
		document.body.appendChild(link);
		link.click();

		// Nettoyer
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	return (
		<Button
			type={"button"}
			variant={"outline"}
			onClick={handleExport}
			disabled={loading}
			className="h-auto w-full flex items-start gap-4 p-4 rounded-lg border hover:!border-primary/50 transition-all duration-200 cursor-pointer relative overflow-hidden"
		>
			<div className="p-2 bg-primary/10 rounded-md">
				<Download className="h-5 w-5 text-primary" />
			</div>
			<div className="flex-1 text-left">
				<div className="font-medium text-foreground">Export makefile</div>
				<div className="text-xs text-muted-foreground">Download current file</div>
			</div>
		</Button>
	);
}
