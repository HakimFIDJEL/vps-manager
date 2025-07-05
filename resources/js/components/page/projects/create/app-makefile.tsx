// Necessary imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

// Types
import { type Command, CommandSchema } from "@/lib/commands/type";

// Contexts
import { useProject } from "@/contexts/project-context";
import { parseCommandsFromMakefile } from "@/lib/commands/parser";
import { MakefileSchema, MakefileTextSchema } from "@/lib/commands/type";
import { CommandAction, useCommand } from "@/contexts/command-context";

export function AppMakefile() {
	// States
	const [search, setSearch] = useState<string>("");

	// Refs
	const inputRef = useRef<HTMLInputElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	// Custom Hooks
	const { project } = useProject();
	const { handleCommandAction, loading } = useCommand();

	return (
		// Wrapper
		<div className="grid">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					{/* Import Makefile */}
					<ImportMakefile handleCommandAction={handleCommandAction} loading={loading}>
						<Button variant={"outline"} type={"button"} disabled={loading}>
							<FileUp />
							Import makefile
						</Button>
					</ImportMakefile>

					{/* Add command */}
					<CreateCommand handleCommandAction={handleCommandAction} loading={loading}>
						<Button variant={"default"} type={"button"} disabled={loading}>
							<Plus />
							Add command
						</Button>
					</CreateCommand>
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
							readOnly={project.commands.length === 0 || loading}
						/>

						{project.commands.length > 0 && (
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
											type={"button"}
											disabled={loading}
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
												<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onAction={async () => {
														await handleCommandAction({ type: "delete-all" });
														return true;
													}}
													disabled={loading}
													variant={"destructive"}
												>
													{loading ? <Loader2 className="animate-spin" /> : <Trash />}
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

			<CommandList search={search} handleCommandAction={handleCommandAction} loading={loading}/>
		</div>
	);
}

export function ImportMakefile({
	handleCommandAction,
	children,
	loading=false,
}: {
	handleCommandAction: (action: CommandAction) => void;
	children: React.ReactNode;
	loading?: boolean;
}) {
	// States
	const [makefilePreview, setMakefilePreview] = useState<string>("");
	const [isDragActive, setIsDragActive] = useState(false);

	// Refs
	const inputFileRef = useRef<HTMLInputElement>(null);

	// Custom Hooks
	const { project } = useProject();

	// Variables
	const MakefileForm = useForm<z.infer<typeof MakefileSchema>>({
		resolver: zodResolver(MakefileSchema),
	});

	const MakefileTextForm = useForm<z.infer<typeof MakefileTextSchema>>({
		resolver: zodResolver(MakefileTextSchema),
	});

	// Custom methods
	async function onSubmitText() {
		const isValid = await MakefileTextForm.trigger();
		if (!isValid) return false;

		const data = MakefileTextForm.getValues();

		return handleUpdate(data.textarea);
	}

	async function onSubmitMakefile() {
		const isValid = await MakefileForm.trigger();
		if (!isValid) return false;

		const data = MakefileForm.getValues();

		// On récupère le contenu du fichier
		const file = data.file as File;
		if (!file) {
			MakefileForm.setError("file", {
				message: "An error occured importing the file.",
			});
			return false;
		}
		const text = await file.text();

		return handleUpdate(text);
	}

	async function handleUpdate(text: string) {
		// On parse le contenu du fichier
		const parsedCommands = parseCommandsFromMakefile({
			content: text,
			commands: project.commands,
		});

		if (parsedCommands.length === 0) {
			MakefileForm.setError("file", {
				message: "No valid commands found in the file.",
			});
			return false;
		} else {
			setMakefilePreview("");
			MakefileForm.reset();
		}

		await handleCommandAction({ type: "create-multiple", commands: parsedCommands });

		return true;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
					<TabsBody className="pt-4">
						<TabsContent value="file">
							<Form {...MakefileForm}>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
								>
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
																			type={"button"}
																			variant={"outline"}
																			size="sm"
																			onClick={() => inputFileRef.current?.click()}
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
																		className="min-h-32 max-h-64 resize-none"
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
															type={"button"}
															variant={"outline"}
															onClick={() => setMakefilePreview("")}
															disabled={loading}
														>
															<Trash />
															Remove file
														</Button>
													</motion.div>
												)}
											</AnimatePresence>
										</div>
										<AlertDialogCancel disabled={loading}>Close</AlertDialogCancel>
										<AlertDialogAction
											onAction={onSubmitMakefile}
											disabled={!makefilePreview || loading}
											type={"submit"}
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
								<form
									onSubmit={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
								>
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
										<AlertDialogCancel disabled={loading}>Close</AlertDialogCancel>
										<AlertDialogAction
											onAction={onSubmitText}
											disabled={!MakefileTextForm.formState.isValid || loading}
											type={"submit"}
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

export function CreateCommand({
	handleCommandAction,
	children,
	loading=false,
}: {
	handleCommandAction: (action: CommandAction) => void;
	children: React.ReactNode;
	loading?: boolean;
}) {

	// Custom hooks
	const { project } = useProject();

	// Variables
	const CommandForm = useForm<z.infer<typeof CommandSchema>>({
		resolver: zodResolver(CommandSchema),
		defaultValues: {
			target: "",
			description: "",
			command: "",
		},
	});

	// Custom methods
	async function onSubmit() {
		const isValid = await CommandForm.trigger();
		if (!isValid) return false;


		const data = CommandForm.getValues();

		const targetExists = project.commands.some(
			(command) => command.target.toLowerCase() === data.target.toLowerCase(),
		);
		if (targetExists) {
			CommandForm.setError("target", { message: "Command already exists" });
			return false;
		}

		await handleCommandAction({ type: "create", command: data });

		CommandForm.reset();
		return true; // Retourne true pour fermer le Dialog
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...CommandForm}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
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
												readOnly={loading}
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
												readOnly={loading}
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
							<AlertDialogCancel disabled={loading}>Close</AlertDialogCancel>
							<AlertDialogAction
								onAction={onSubmit}
								disabled={!CommandForm.formState.isValid || loading}
								type={"submit"}
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

export function EditCommand({
	command,
	handleCommandAction,
	loading=false,
}: {
	command: Command;
	handleCommandAction: (action: CommandAction) => void;
	loading?: boolean;
}) {

	// Variables
	const CommandForm = useForm<z.infer<typeof CommandSchema>>({
		resolver: zodResolver(CommandSchema),
		defaultValues: {
			target: command.target,
			description: command.description,
			command: command.command,
		},
	});

	// Hooks
	useEffect(() => {
		CommandForm.reset({
			target: command.target,
			description: command.description,
			command: command.command,
		});
	}, [command, CommandForm]);

	// Custom methods
	async function onSubmit() {
		const isValid = await CommandForm.trigger();
		if (!isValid) return false;

		const data = CommandForm.getValues();

		await handleCommandAction({ type: "update", command: data });

		CommandForm.reset();
		return true;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"ghost"} size={"icon"} type={"button"}>
					<Pen className="h-4 w-4 text-muted-foreground" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...CommandForm}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
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
												readOnly={loading}
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
							<AlertDialogCancel disabled={loading}>Close</AlertDialogCancel>
							<AlertDialogAction
								onAction={onSubmit}
								disabled={!CommandForm.formState.isValid || loading}
								type={"submit"}
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

function CommandList({
	search,
	handleCommandAction,
	loading=false,
}: {
	search: string;
	handleCommandAction: (action: CommandAction) => void;
	loading?: boolean;
}) {
	// Custom hooks
	const { project } = useProject();

	// Custom methods
	async function handleDelete(target: string) {
		const command = project.commands.find((c) => c.target === target);
		if (!command) return false;

		await handleCommandAction({ type: "delete", command: command });
		return true;
	}

	// Variables
	const filteredCommands = project.commands.filter((command) => {
		return command.target.toLowerCase().includes(search.toLowerCase());
	});

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
					<SmoothAnimate className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
										<EditCommand
											command={command}
											handleCommandAction={handleCommandAction}
											loading={loading}
										/>
										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button variant={"ghost"} size={"icon"} type={"button"} disabled={loading}>
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
															onAction={async () => handleDelete(command.target)}
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
						))}
					</SmoothAnimate>
				)}
			</SmoothAnimate>
		</>
	);
}
