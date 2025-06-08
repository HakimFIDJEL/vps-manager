// Necessary imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Custom components
import {
	SmoothAnimate,
	SmoothItem,
	SmoothResize,
} from "@/components/ui/smooth-resized";
import { CodeEditor } from "@/components/ui/code-editor";

// Shadcn UI components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Tabs,
	TabsBody,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
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

// Icons
import {
	Search,
	Trash,
	Pen,
	Plus,
	Copy,
	Loader2,
	FileUp,
	OctagonAlert,
	Play,
} from "lucide-react";

// Types
import { type Command, CommandSchema } from "@/lib/commands/type";
import { parseCommandsFromMakefile } from "@/lib/commands/parser";

// Contexts
import { useProject } from "@/contexts/project-context";

// Schemas
const MakefileSchema = z.object({
	file: z.instanceof(File).optional(),
});

const MakefileTextSchema = z.object({
	textarea: z.string().min(1, "Content is required"),
});

export function AppMakefile() {
	const { project, updateProject } = useProject();

	const [commands, setCommands] = useState<Command[]>(project.commands);
	const [search, setSearch] = useState<string>("");

	const inputRef = useRef<HTMLInputElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	// Synchroniser l'état local avec le contexte projet si le contexte change
	useEffect(() => {
		if (JSON.stringify(project.commands) !== JSON.stringify(commands)) {
			setCommands(project.commands);
		}
	}, [project.commands]);

	// Synchroniser le contexte projet avec l'état local si le local change
	useEffect(() => {
		if (JSON.stringify(commands) !== JSON.stringify(project.commands)) {
			updateProject("commands", commands);
		}
	}, [commands]);

	function handleDeleteAll() {
		setCommands([]);
		toast.success("All commands deleted successfully!");
		return true;
	}

	return (
		<TabsContent value="commands" className="flex flex-col gap-6">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					{/* Import Makefile */}
					<ImportMakefile commands={commands} setCommands={setCommands} />

					{/* Add command */}
					<CreateCommand commands={commands} setCommands={setCommands} />
				</div>

				<SmoothResize className="flex items-center gap-2 relative">
					<AnimatePresence mode={"sync"}>
						<Input
							ref={inputRef}
							name="search"
							placeholder="Filter commands..."
							className="z-1 relative"
							addonText={<Search className="h-4 w-4" />}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							readOnly={commands.length === 0}
						/>

						{commands.length > 0 && (
							<SmoothItem
								key={"delete"}
								initial={{ opacity: 0, scale: 0.95, width: 0 }}
								animate={{ opacity: 1, scale: 1, width: "auto" }}
								exit={{ opacity: 0, scale: 0.95, width: 0 }}
							>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											ref={buttonRef}
											variant={"outline"}
											size={"default"}
											type="button"
										>
											<Trash className="h-4 w-4" />
											Delete commands
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
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onAction={() => handleDeleteAll()}
													variant={"destructive"}
												>
													<Trash />
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogBody>
									</AlertDialogContent>
								</AlertDialog>
							</SmoothItem>
						)}
					</AnimatePresence>
				</SmoothResize>
			</div>

			<CommandList commands={commands} setCommands={setCommands} search={search} />
		</TabsContent>
	);
}

function ImportMakefile({
	commands,
	setCommands,
}: {
	commands: Command[];
	setCommands: (commands: Command[]) => void;
}) {
	const [makefilePreview, setMakefilePreview] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [isDragActive, setIsDragActive] = useState(false);
	const inputFileRef = useRef<HTMLInputElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);

	const MakefileForm = useForm<z.infer<typeof MakefileSchema>>({
		resolver: zodResolver(MakefileSchema),
	});

	const MakefileTextForm = useForm<z.infer<typeof MakefileTextSchema>>({
		resolver: zodResolver(MakefileTextSchema),
	});

	async function onSubmitText() {
		const isValid = await MakefileTextForm.trigger();
		if (!isValid) return false;

		setLoading(true);

		const data = MakefileTextForm.getValues();

		return handleUpdate(data.textarea);
	}

	async function onSubmitMakefile() {
		const isValid = await MakefileForm.trigger();
		if (!isValid) return false;

		setLoading(true);

		const data = MakefileForm.getValues();

		// On récupère le contenu du fichier
		const file = data.file as File;
		if (!file) {
			MakefileForm.setError("file", {
				message: "An error occured importing the file.",
			});
			setLoading(false);
			return false;
		}
		const text = await file.text();

		return handleUpdate(text);
	}

	function handleUpdate(text: string) {
		// On parse le contenu du fichier
		const parsedCommands = parseCommandsFromMakefile({
			content: text,
			commands: commands,
		});

		if (parsedCommands.length === 0) {
			MakefileForm.setError("file", {
				message: "No valid commands found in the file.",
			});
			setLoading(false);
			return false;
		} else {
			setMakefilePreview("");
			MakefileForm.reset();
		}

		toast.success(`${parsedCommands.length} commands imported successfully!`);

		setCommands([...parsedCommands, ...commands]);

		setLoading(false);

		closeRef.current?.click();
		return true;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"outline"} type="button">
					<FileUp />
					Import makefile
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Import makefile</AlertDialogTitle>
					<AlertDialogDescription>
						Either import a Makefile or paste commands in the textarea.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<Tabs defaultValue="file">
					<TabsList className="w-full gap-4">
						<TabsTrigger value="file" className="flex items-center gap-2">
							<FileUp />
							Import file
						</TabsTrigger>
						<TabsTrigger value="text" className="flex items-center gap-2">
							<Copy />
							Paste content
						</TabsTrigger>
					</TabsList>
					<TabsBody>
						<TabsContent value="file">
							<Form {...MakefileForm}>
								<form onSubmit={(e) => e.preventDefault()} className="mt-4">
									<AlertDialogBody>
										<FormField
											control={MakefileForm.control}
											name="file"
											render={({ field }) => {
												// Mandatory for a file input that cant take a value
												const { value, ...rest } = field;

												return (
													<FormItem className="gap-0">
														<SmoothAnimate>
															{!makefilePreview ? (
																<FormLabel
																	htmlFor="file"
																	className={cn(
																		"flex items-center justify-center p-4 border-2 border-dashed rounded-lg bg-muted/50 hover:border-primary transition-colors cursor-pointer group",
																		isDragActive && "border-primary",
																	)}
																	onDragOver={(e) => {
																		e.preventDefault();
																		setIsDragActive(true);
																	}}
																	onDragLeave={(e) => {
																		e.preventDefault();
																		setIsDragActive(false);
																	}}
																	onDrop={async (e) => {
																		e.preventDefault();
																		setIsDragActive(false);
																		const file = e.dataTransfer.files?.[0];
																		if (!file) return;

																		// On utilise directement le formulaire pour la validation
																		field.onChange(file);
																		const isValid = await MakefileForm.trigger("file");

																		if (isValid) {
																			// Lecture du fichier pour l'aperçu
																			const reader = new FileReader();
																			reader.onload = (e) => {
																				setMakefilePreview(e.target?.result as string);
																			};
																			reader.readAsText(file);
																		}
																	}}
																>
																	<div className="text-center">
																		<FileUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
																		<p className="text-sm text-muted-foreground mb-2">
																			Drag and drop your Makefile here or click to select it.
																		</p>
																		<Button
																			variant="outline"
																			size="sm"
																			onClick={() => inputFileRef.current?.click()}
																			type="button"
																		>
																			Browse files
																		</Button>
																	</div>
																</FormLabel>
															) : (
																<div className="grid gap-2">
																	<Label>Preview</Label>
																	<Textarea
																		id="preview"
																		value={makefilePreview}
																		disabled={true}
																		className="h-64 resize-none"
																	/>
																</div>
															)}
														</SmoothAnimate>
														<FormControl>
															<Input
																id="file"
																type="file"
																className="hidden"
																ref={inputFileRef}
																onChange={async (e) => {
																	const file = e.target.files?.[0] ?? null;
																	if (file) {
																		// On met à jour le champ du formulaire
																		field.onChange(file);
																		// On déclenche la validation
																		const isValid = await MakefileForm.trigger("file");

																		if (isValid) {
																			const reader = new FileReader();
																			reader.onload = (e) => {
																				setMakefilePreview(e.target?.result as string);
																			};
																			reader.readAsText(file);
																		}
																	} else {
																		setMakefilePreview("");
																		field.onChange(null);
																	}
																}}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												);
											}}
										/>
									</AlertDialogBody>
									<AlertDialogFooter className="mt-4">
										<div className="flex self-start mr-auto">
											<AnimatePresence mode="sync">
												{makefilePreview && (
													<motion.div
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														transition={{ duration: 0.3 }}
													>
														<Button
															type="button"
															variant={"outline"}
															onClick={() => setMakefilePreview("")}
														>
															<Trash />
															Remove file
														</Button>
													</motion.div>
												)}
											</AnimatePresence>
										</div>
										<AlertDialogCancel ref={closeRef}>Close</AlertDialogCancel>
										<AlertDialogAction
											onAction={onSubmitMakefile}
											disabled={!makefilePreview || loading}
											type="submit"
										>
											{loading ? <Loader2 className="animate-spin" /> : <FileUp />}
											Import file
										</AlertDialogAction>
									</AlertDialogFooter>
								</form>
							</Form>
						</TabsContent>

						<TabsContent value="text">
							<Form {...MakefileTextForm}>
								<form onSubmit={(e) => e.preventDefault()} className="mt-4">
									<AlertDialogBody>
										<FormField
											control={MakefileTextForm.control}
											name="textarea"
											render={({ field }) => {
												return (
													<FormItem>
														<FormLabel>Content</FormLabel>
														<FormControl>
															<CodeEditor
																className="max-h-64 w-full"
																value={
																	field.value == "" || field.value == null
																		? "\n\n\n\n\n\n"
																		: field.value
																}
																onChange={field.onChange}
																comment="Each target must be in the form 'target:'. Comments before a target will be used as its description."
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												);
											}}
										/>
									</AlertDialogBody>

									<AlertDialogFooter className="mt-4">
										<AlertDialogCancel>Close</AlertDialogCancel>
										<AlertDialogAction
											onAction={onSubmitText}
											disabled={!MakefileTextForm.formState.isValid || loading}
											type="submit"
										>
											{loading ? <Loader2 className="animate-spin" /> : <Copy />}
											Import content
										</AlertDialogAction>
									</AlertDialogFooter>
								</form>
							</Form>
						</TabsContent>
					</TabsBody>
				</Tabs>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function CreateCommand({
	commands,
	setCommands,
}: {
	commands: Command[];
	setCommands: (commands: Command[]) => void;
}) {
	const [command, setCommand] = useState<Command>({
		target: "",
		description: "",
		command: "",
	});
	const [loading, setLoading] = useState<boolean>(false);

	const CommandForm = useForm<z.infer<typeof CommandSchema>>({
		resolver: zodResolver(CommandSchema),
		defaultValues: {
			target: command.target,
			description: command.description,
			command: command.command,
		},
	});

	async function onSubmit() {
		const isValid = await CommandForm.trigger();
		if (!isValid) return false;

		setLoading(true);

		const data = CommandForm.getValues();
		const targetExists = commands.some(
			(command) => command.target.toLowerCase() === data.target.toLowerCase(),
		);
		if (targetExists) {
			CommandForm.setError("target", { message: "Command already exists" });
			setLoading(false);
			return false;
		}

		setCommands([...commands, data]);
		setCommand({ target: "", description: "", command: "" });
		toast.success(`Command ${data.target} created successfully!`);
		CommandForm.reset();
		setLoading(false);
		return true; // Retourne true pour fermer le Dialog
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"default"} type="button">
					<Plus />
					Add command
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...CommandForm}>
					<form onSubmit={(e) => e.preventDefault()}>
						<AlertDialogHeader>
							<AlertDialogTitle>Add command</AlertDialogTitle>
							<AlertDialogDescription>
								Add a command to your project. It will be merged with the others into a
								Makefile.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogBody className="grid gap-4 items-start py-4 grid-cols-1">
							<FormField
								control={CommandForm.control}
								name="target"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Target</FormLabel>
										<FormControl>
											<Input
												id="target"
												placeholder="eg: start"
												autoFocus={true}
												{...field}
												comment="Must start with a lowercase letter or underscore, and can only contain lowercase letters, numbers and underscores."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={CommandForm.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input
												id="description"
												placeholder="eg: Starts all containers in detached mode"
												{...field}
												comment="The description of the command."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={CommandForm.control}
								name="command"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Command</FormLabel>
										<FormControl>
											{/* <Input
												id="command"
												placeholder="eg: docker-compose up -d"
												{...field}
											/> */}
											<CodeEditor
												className="max-h-64 w-full"
												value={
													field.value == "" || field.value == null
														? "\n\n\n\n\n\n"
														: field.value
												}
												onChange={field.onChange}
												// {...field}
												comment="The command(s) to run."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</AlertDialogBody>
						<AlertDialogFooter>
							<AlertDialogCancel>Close</AlertDialogCancel>
							<AlertDialogAction
								onAction={onSubmit}
								disabled={!CommandForm.formState.isValid || loading}
								type="submit"
							>
								{loading ? <Loader2 className="animate-spin" /> : <Plus />}
								Add command
							</AlertDialogAction>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function CommandList({
	commands,
	setCommands,
	search,
}: {
	commands: Command[];
	setCommands: (commands: Command[]) => void;
	search: string;
}) {
	const filteredCommands = commands.filter((command) => {
		return command.target.toLowerCase().includes(search.toLowerCase());
	});

	function handleRun(target: string) {
		toast.info('Running command...');
	}

	function handleDelete(target: string) {
		setCommands(commands.filter((command) => command.target !== target));
		toast.success(`Command ${target} deleted successfully!`);
		return true;
	}

	return (
		<>
			<SmoothAnimate>
				<h3 className="text-sm font-medium mb-2 mt-8">Commands</h3>

				{filteredCommands.length === 0 ? (
					<div className="flex items-center justify-center border border-border border-dashed rounded-md p-4 bg-muted/50">
						<p className="text-sm text-muted-foreground">
							No commands added yet. Click on "Add command" to create one.
						</p>
					</div>
				) : (
					<SmoothAnimate className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{filteredCommands.map((command) => (
							<div
								key={command.target}
								className="group relative rounded-md border border-border bg-card p-4 transition-all hover:border-primary/50 "
							>
								<div className="flex items-start justify-between gap-2">
									<div>
										<p className="font-mono">{command.target}</p>
										<p className="text-sm text-muted-foreground mt-1">
											{command.description}
										</p>
									</div>
									<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
										<Button
											variant={"ghost"}
											size="icon"
											onClick={() => handleRun(command.target)}
											type="button"
										>
											<Play className="h-4 w-4 text-muted-foreground" />
										</Button>
										<EditCommand
											command={command}
											commands={commands}
											setCommands={setCommands}
										/>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant="ghost" size="icon" type="button">
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
															${command.target}
														</Badge>
														command ?
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogBody>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															onAction={() => handleDelete(command.target)}
															variant={"destructive"}
														>
															<Trash />
															Delete
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogBody>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							</div>
						))}
					</SmoothAnimate>
				)}
			</SmoothAnimate>
		</>
	);
}

function EditCommand({
	command,
	commands,
	setCommands,
}: {
	command: Command;
	commands: Command[];
	setCommands: (commands: Command[]) => void;
}) {
	const [loading, setLoading] = useState<boolean>(false);

	const CommandForm = useForm<z.infer<typeof CommandSchema>>({
		resolver: zodResolver(CommandSchema),
		defaultValues: {
			target: command.target,
			description: command.description,
			command: command.command,
		},
	});

	useEffect(() => {
		CommandForm.reset({
			target: command.target,
			description: command.description,
			command: command.command,
		});
	}, [command, CommandForm]);

	async function onSubmit() {
		const isValid = await CommandForm.trigger();
		if (!isValid) return false;

		setLoading(true);

		const data = CommandForm.getValues();
		setCommands(
			commands.map((c) =>
				c.target === command.target
					? { ...c, description: data.description, command: data.command }
					: c,
			),
		);
		toast.success(`Command ${data.target} updated successfully!`);
		CommandForm.reset();
		setLoading(false);
		return true;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"ghost"} size={"icon"} type="button">
					<Pen className="h-4 w-4 text-muted-foreground" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...CommandForm}>
					<form onSubmit={(e) => e.preventDefault()}>
						<AlertDialogHeader>
							<AlertDialogTitle>Edit command</AlertDialogTitle>
							<AlertDialogDescription>
								Edit a command of your project. You can only change the description and
								the command.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogBody className="grid gap-4 items-start py-4 grid-cols-1">
							<FormField
								control={CommandForm.control}
								name="target"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Target</FormLabel>
										<FormControl>
											<Input
												id="target"
												placeholder="eg: start"
												readOnly={true}
												comment="You can't change the target."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={CommandForm.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input
												id="description"
												placeholder="eg: Starts all containers in detached mode"
												autoFocus={true}
												{...field}
												comment="The description of the command."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={CommandForm.control}
								name="command"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Command</FormLabel>
										<FormControl>
											<CodeEditor
												value={field.value}
												onChange={field.onChange}
												className="max-h-64 w-full"
												comment="The command(s) to run."
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</AlertDialogBody>
						<AlertDialogFooter>
							<AlertDialogCancel>Close</AlertDialogCancel>
							<AlertDialogAction
								onAction={onSubmit}
								disabled={!CommandForm.formState.isValid || loading}
								type="submit"
							>
								{loading ? <Loader2 className="animate-spin" /> : <Pen />}
								Edit command
							</AlertDialogAction>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
