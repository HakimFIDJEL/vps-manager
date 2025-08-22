// Necessary imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

// Custom components
import { parseVariablesFromEnv } from "@/lib/variables/parser";
import { SmoothAnimate } from "@/components/ui/smooth-resized";

// Shadcn UI components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Icons
import {
	Search,
	Lock,
	Trash,
	Eye,
	EyeOff,
	Pen,
	Plus,
	Copy,
	Loader2,
	Upload,
	FileUp,
	ArrowDownNarrowWide,
	ArrowUpNarrowWide,
	ArrowUpDown,
	OctagonAlert,
} from "lucide-react";

// Types
import {
	type Variable,
	VariableSchema,
	VariableTextSchema,
	VariableEnvSchema,
} from "@/lib/variables/type";

// Contexts
import { useProject } from "@/contexts/project-context";
import { CodeEditor } from "@/components/ui/code-editor";
import { useVariable } from "@/contexts/variable-context";

// Types
import { type VariableAction } from "@/lib/variables/type";
import { ProjectSchema } from "@/lib/projects/type";

export function AppVariables({
	setValidate,
}: {
	setValidate: Dispatch<SetStateAction<() => Promise<boolean>>>;
}) {
	// States
	const [search, setSearch] = useState<string>("");

	// Custom Hooks
	const { project } = useProject();
	const { handleVariable, loading } = useVariable();

	// Refs
	const inputRef = useRef<HTMLInputElement>(null);

	const validator = async () => {
		// Check if the schema is valid
		const result = ProjectSchema.shape.variables.safeParse(project.variables);

		if (!result.success) {
			toast.error("An error occured", { description: result.error.errors[0].message });
			return false;
		}

		return true;
	};

	useEffect(() => {
		setValidate(() => validator);
	}, [setValidate, project.variables]);

	return (
		// Wrapper
		<div className="grid">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					{/* Import .env */}
					<ImportEnv handleVariable={handleVariable} loading={loading}>
						<Button variant={"outline"} type={"button"} disabled={loading}>
							<FileUp />
							Import variables
						</Button>
					</ImportEnv>

					{/* Add variable */}
					<CreateVariable
						handleVariable={handleVariable}
						loading={loading}
					>
						<Button variant={"default"} type={"button"} disabled={loading}>
							<Plus />
							Add variable
						</Button>
					</CreateVariable>
				</div>

				<div className="flex items-center gap-2 relative">
					<Input
						ref={inputRef}
						name="search"
						placeholder="Filter variables..."
						className="z-1 relative"
						addonText={<Search className="h-4 w-4" />}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						readOnly={project.variables.length === 0 || loading}
					/>
				</div>
			</div>

			<>
				<h3 className="text-sm font-medium mb-2 mt-8">Variables</h3>
				<VariablesList
					search={search}
					handleVariable={handleVariable}
				/>
			</>
		</div>
	);
}

export function VariablesList({
	search,
	handleVariable,
	loading = false,
}: {
	search: string;
	handleVariable: (action: VariableAction) => Promise<boolean>;
	loading?: boolean;
}) {
	// States
	const [sortKey, setSortKey] = useState<string>("none");

	// Custom hooks
	const { project } = useProject();

	// Variables
	const filteredVariables = project.variables
		.filter((variable) =>
			variable.key.toLowerCase().includes(search.toLowerCase()),
		)
		.sort((a, b) => {
			if (sortKey === "desc") return b.key.localeCompare(a.key);
			if (sortKey === "asc") return a.key.localeCompare(b.key);
			return 0;
		});

	return (
		<Table>
			<TableHeader className="bg-card">
				<TableRow>
					<TableHead>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() =>
								setSortKey(
									sortKey === "desc" ? "asc" : sortKey === "asc" ? "none" : "desc",
								)
							}
						>
							{sortKey === "desc" && (
								<ArrowDownNarrowWide className="w-4 h-4 text-muted-foreground" />
							)}
							{sortKey === "asc" && (
								<ArrowUpNarrowWide className="w-4 h-4 text-muted-foreground" />
							)}
							{sortKey === "none" && (
								<ArrowUpDown className="w-4 h-4 text-muted-foreground" />
							)}
							Key
						</Button>
					</TableHead>
					<TableHead>Value</TableHead>
					<TableHead className="flex items-center gap-4 justify-end">
						<span className="mr-2">Actions</span>
						<div className="h-[70%]">
							<Separator orientation="vertical" />
						</div>
						<div className="flex items-center gap-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										type={"button"}
										variant={"ghost"}
										size={"icon"}
										disabled={project.variables.length === 0}
										onClick={() =>
											handleVariable({
												type: "variable-toggle-visibility-all",
											})
										}
									>
										{project.variables.every((v) => v.visible) ? <EyeOff /> : <Eye />}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									{project.variables.every((v) => v.visible)
										? "Hide all variables"
										: "Show all variables"}
								</TooltipContent>
							</Tooltip>
							<AlertDialog>
								<Tooltip>
									<AlertDialogTrigger asChild>
										<TooltipTrigger asChild>
											<Button
												type={"button"}
												variant={"ghost"}
												size={"icon"}
												disabled={project.variables.length === 0 || loading}
											>
												<div className="flex items-center justify-center">
													<Trash />
												</div>
											</Button>
										</TooltipTrigger>
									</AlertDialogTrigger>
									<TooltipContent>Delete all variables</TooltipContent>
								</Tooltip>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle className="flex items-center gap-2">
											<OctagonAlert className="w-4 h-4 text-destructive" />
											Delete all variables
										</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete all variables?
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogBody>
										<AlertDialogFooter>
											<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
											<AlertDialogAction
												onAction={async () => {
													return await handleVariable({ type: "variable-delete-all" });
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
						</div>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className="bg-transparent">
				{filteredVariables.map((variable) => (
					<TableRow key={variable.key} className="group">
						<TableCell>
							<div className="flex items-center gap-2">
								<Lock className="h-3 w-3 text-muted-foreground" />
								{variable.key}
							</div>
						</TableCell>
						<TableCell>
							<span className="font-mono text-muted-foreground relative overflow-hidden rounded-md">
								<div
									className={`absolute inset-0 bg-muted transition-opacity duration-200 z-1 rounded-xs ${
										!variable.visible ? "opacity-100" : "opacity-0"
									}`}
								/>
								<span className="relative">{variable.value}</span>
							</span>
						</TableCell>
						<TableCell className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
							<div className="flex items-center justify-end gap-2">
								<Button
									type={"button"}
									variant={"ghost"}
									size="icon"
									onClick={() =>
										handleVariable({
											type: "variable-toggle-visibility",
											variable,
										})
									}
								>
									{variable.visible ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</Button>

								<EditVariable
									variable={variable}
									handleVariable={handleVariable}
									loading={loading}
								/>

								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											type={"button"}
											variant={"ghost"}
											size={"icon"}
											disabled={loading}
										>
											<Trash className="h-4 w-4" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle className="flex items-center gap-2">
												<OctagonAlert className="w-4 h-4 text-destructive" />
												Delete variable
											</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to delete
												<Badge variant={"outline"} className="font-mono mx-2">
													{variable.key}
												</Badge>
												?
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogBody>
											<AlertDialogFooter>
												<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onAction={async () => {
														return await handleVariable({ type: "variable-delete", variable });

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
						</TableCell>
					</TableRow>
				))}
				{filteredVariables.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={3}
							className="text-center py-4 bg-muted/50 text-muted-foreground"
						>
							No variables added yet. Click on "Add Variable" to create one.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

export function CreateVariable({
	children,
	handleVariable,
	loading = false,
}: {
	children: React.ReactNode;
	handleVariable: (action: VariableAction) => Promise<boolean>;
	loading?: boolean;
}) {
	// Variables
	const VariableForm = useForm<z.infer<typeof VariableSchema>>({
		resolver: zodResolver(VariableSchema),
		defaultValues: {
			key: "",
			value: "",
		},
	});

	async function onSubmit() {
		const isValid = await VariableForm.trigger();
		if (!isValid) return false;

		await handleVariable({
			type: "variable-create",
			variable: VariableForm.getValues(),
		});

		VariableForm.reset();
		return true;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...VariableForm}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<AlertDialogHeader>
							<AlertDialogTitle>Add variable</AlertDialogTitle>
							<AlertDialogDescription>
								Add an environnement variable to your project. They must be written in
								uppercase and separated by an underscore.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogBody className="grid gap-4 items-start py-4 grid-cols-2">
							<FormField
								control={VariableForm.control}
								name="key"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Key</FormLabel>
										<FormControl>
											<Input
												id="key"
												readOnly={loading}
												placeholder="eg: MY_KEY"
												autoFocus={true}
												{...field}
											/>
										</FormControl>
										<FormDescription>
											You can use letters, numbers and underscores. Must not contain
											spaces.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={VariableForm.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Value</FormLabel>
										<FormControl>
											<Input
												id="value"
												readOnly={loading}
												placeholder="eg: My value"
												{...field}
											/>
										</FormControl>
										<FormDescription>This is the value of the variable.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</AlertDialogBody>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={loading}>Close</AlertDialogCancel>
							<AlertDialogAction
								onAction={onSubmit}
								disabled={!VariableForm.formState.isValid || loading}
								type={"submit"}
							>
								{loading ? <Loader2 className="animate-spin" /> : <Plus />}
								Add variable
							</AlertDialogAction>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function EditVariable({
	variable,
	handleVariable,
	loading = false,
}: {
	variable: Variable;
	handleVariable: (action: VariableAction) => Promise<boolean>;
	loading?: boolean;
}) {
	// Variables
	const VariableForm = useForm<z.infer<typeof VariableSchema>>({
		resolver: zodResolver(VariableSchema),
		defaultValues: {
			key: variable.key,
			value: variable.value,
		},
	});

	// Hooks
	useEffect(() => {
		VariableForm.reset({
			key: variable.key,
			value: variable.value,
		});
	}, [variable, VariableForm]);

	async function onSubmit() {
		const isValid = await VariableForm.trigger();
		if (!isValid) return false;

		await handleVariable({
			type: "variable-update",
			variable: { ...variable, value: VariableForm.getValues().value },
		});

		VariableForm.reset();
		return true;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"ghost"} size={"icon"} type={"button"}>
					<Pen />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...VariableForm}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<AlertDialogHeader>
							<AlertDialogTitle>Edit variable</AlertDialogTitle>
							<AlertDialogDescription>
								Edit an environnement variable of your project. You can only change the
								value.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogBody className="grid gap-4 items-start py-4 grid-cols-2">
							<FormField
								control={VariableForm.control}
								name="key"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Key</FormLabel>
										<FormControl>
											<Input
												id="key"
												placeholder="eg: MY_KEY"
												readOnly={true}
												{...field}
											/>
										</FormControl>
										<FormDescription>You can't change the key.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={VariableForm.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Value</FormLabel>
										<FormControl>
											<Input
												id="value"
												type="password"
												autoFocus={true}
												placeholder="eg: My_value"
												showPasswordToggle={true}
												readOnly={loading}
												{...field}
											/>
										</FormControl>
										<FormDescription>This is the value of the variable.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</AlertDialogBody>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={loading}>Close</AlertDialogCancel>
							<AlertDialogAction
								onAction={onSubmit}
								disabled={!VariableForm.formState.isValid || loading}
								type={"submit"}
							>
								{loading ? <Loader2 className="animate-spin" /> : <Pen />}
								Edit variable
							</AlertDialogAction>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function ImportEnv({
	children,
	handleVariable,
	loading = false,
}: {
	children: React.ReactNode;
	handleVariable: (action: VariableAction) => Promise<boolean>;
	loading?: boolean;
}) {
	// States
	const [envPreview, setEnvPreview] = useState<string>("");
	const [isDragActive, setIsDragActive] = useState(false);

	// Refs
	const inputFileRef = useRef<HTMLInputElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);

	// Custom hooks
	const { project } = useProject();

	// Variables
	const VariableEnvForm = useForm<z.infer<typeof VariableEnvSchema>>({
		resolver: zodResolver(VariableEnvSchema),
	});

	const VariableTextForm = useForm<z.infer<typeof VariableTextSchema>>({
		resolver: zodResolver(VariableTextSchema),
	});

	// Custom methods
	async function onSubmitText() {
		const isValid = await VariableTextForm.trigger();
		if (!isValid) return false;

		const data = VariableTextForm.getValues();

		return handleUpdate(data.textarea);
	}

	async function onSubmitEnv() {
		const isValid = await VariableEnvForm.trigger();
		if (!isValid) return false;

		const data = VariableEnvForm.getValues();

		// On récupère le contenu du fichier
		const file = data.file as File;
		if (!file) {
			VariableEnvForm.setError("file", {
				message: "An error occured importing the file.",
			});
			return false;
		}
		const text = await file.text();

		return handleUpdate(text);
	}

	async function handleUpdate(text: string) {
		// On parse le contenu du fichier
		const parsedVariables = parseVariablesFromEnv({
			content: text,
			variables: project.variables,
		});

		if (parsedVariables.length === 0) {
			VariableEnvForm.setError("file", {
				message: "No valid variables found in the file.",
			});
			return false;
		} else {
			await handleVariable({
				type: "variable-create-multiple",
				variables: parsedVariables,
			});

			setEnvPreview("");
			VariableEnvForm.reset();
		}

		return true;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Import variables</AlertDialogTitle>
					<AlertDialogDescription>
						Either import a .env file or paste variables in the textarea.
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
							<Form {...VariableEnvForm}>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
								>
									<AlertDialogBody>
										<FormField
											control={VariableEnvForm.control}
											name="file"
											render={({ field }) => {
												// Mandatory for a file input that cant take a value
												const { value, ...rest } = field;

												return (
													<FormItem className="gap-0">
														<SmoothAnimate>
															{!envPreview ? (
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
																		const isValid = await VariableEnvForm.trigger("file");

																		if (isValid) {
																			// Lecture du fichier pour l'aperçu
																			const reader = new FileReader();
																			reader.onload = (e) => {
																				setEnvPreview(e.target?.result as string);
																			};
																			reader.readAsText(file);
																		}
																	}}
																>
																	<div className="text-center">
																		<FileUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
																		<p className="text-sm text-muted-foreground mb-2">
																			Drag and drop your .env file here or click to select it.
																		</p>
																		<Button
																			type={"button"}
																			variant="outline"
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
																		value={envPreview}
																		disabled={true}
																		className="min-h-32 max-h-64"
																	/>
																</div>
															)}
														</SmoothAnimate>
														<FormControl>
															<Input
																id="file"
																type="file"
																accept=".env"
																className="hidden"
																ref={inputFileRef}
																onChange={async (e) => {
																	const file = e.target.files?.[0] ?? null;
																	if (file) {
																		// On met à jour le champ du formulaire
																		field.onChange(file);
																		// On déclenche la validation
																		const isValid = await VariableEnvForm.trigger("file");

																		if (isValid) {
																			const reader = new FileReader();
																			reader.onload = (e) => {
																				setEnvPreview(e.target?.result as string);
																			};
																			reader.readAsText(file);
																		}
																	} else {
																		setEnvPreview("");
																		field.onChange(null);
																	}
																}}
															/>
														</FormControl>
														<FormDescription className="mt-2">
															Drop a .env file here or click to select it. The file must be in
															the following format: <code>KEY=VALUE</code>. Lines starting with
															{"#"} are ignored.
														</FormDescription>
														<FormMessage />
													</FormItem>
												);
											}}
										/>
									</AlertDialogBody>
									<AlertDialogFooter className="mt-4">
										<div className="flex self-start mr-auto">
											<AnimatePresence mode="sync">
												{envPreview && (
													<motion.div
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														transition={{ duration: 0.3 }}
													>
														<Button
															type={"button"}
															variant={"outline"}
															onClick={() => setEnvPreview("")}
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
											onAction={onSubmitEnv}
											disabled={!envPreview || loading}
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
							<Form {...VariableTextForm}>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
								>
									<AlertDialogBody>
										<FormField
											control={VariableTextForm.control}
											name="textarea"
											render={({ field }) => {
												return (
													<FormItem>
														<FormLabel>Content</FormLabel>
														<FormControl>
															<CodeEditor
																language="env"
																value={
																	field.value == "" || field.value == null
																		? "\n\n\n\n\n\n"
																		: field.value
																}
																onChange={field.onChange}
															/>
														</FormControl>
														<FormDescription>
															You can paste the content of a .env file here. Each line must be
															in the form <code>KEY=VALUE</code>. Lines starting with{" "}
															<code>#</code> are ignored.
														</FormDescription>
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
											disabled={!VariableTextForm.formState.isValid || loading}
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
