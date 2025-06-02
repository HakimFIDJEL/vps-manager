// Necessary imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Custom components
import { parseVariablesFromEnv } from "@/lib/variables/parser";
import {
	SmoothAnimate,	
} from "@/components/ui/smooth-resized";

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
} from "@/components/ui/tooltip"

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

export function AppVariables() {
	const { project, updateProject } = useProject();
	
	const [variables, setVariables] = useState<Variable[]>(project.variables);
	const [search, setSearch] = useState<string>("");

	const inputRef = useRef<HTMLInputElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	// Synchroniser l'état local avec le contexte projet si le contexte change
	useEffect(() => {
		if (JSON.stringify(project.variables) !== JSON.stringify(variables)) {
			setVariables(project.variables);
		}
	}, [project.variables]);

	// Synchroniser le contexte projet avec l'état local si le local change
	useEffect(() => {
		if (JSON.stringify(variables) !== JSON.stringify(project.variables)) {
			updateProject("variables", variables);
		}
	}, [variables]);

	return (
		// Wrapper
		<div className="grid">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					{/* Import .env */}
					<ImportEnv variables={variables} setVariables={setVariables} />

					{/* Add variable */}
					<CreateVariable variables={variables} setVariables={setVariables} />
				</div>

				<div className="flex items-center gap-2 relative">
					<Input
						ref={inputRef}
						name="search"
						placeholder="Filter variables..."
						className="z-100 relative"
						addonText={<Search className="h-4 w-4" />}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						readOnly={variables.length === 0}
					/>
				</div>
			</div>

			{/* <Separator className="my-8" /> */}

			<VariablesList
				variables={variables}
				setVariables={setVariables}
				search={search}
			/>
		</div>
	);
}

function VariablesList({
	variables,
	setVariables,
	search,
}: {
	variables: Variable[];
	setVariables: (variables: Variable[]) => void;
	search: string;
}) {

	const [sortKey, setSortKey] = useState<string>("none");
	const [showAll, setShowAll] = useState<boolean>(false);

	function handleDelete(key: string) {
		setVariables(variables.filter((variable) => variable.key !== key));
		toast.success(`Variable ${key} deleted successfully!`);
	}

	function toggleVisibility(variable: Variable) {
		if (variable.visible) {
			setVariables(
				variables.map((v) =>
					v.key === variable.key ? { ...v, visible: false } : v,
				),
			);
		} else {
			setVariables(
				variables.map((v) =>
					v.key === variable.key ? { ...v, visible: true } : v,
				),
			);
		}
	}

	function handleDeleteAll() {
		setVariables([]);
		toast.success(`All variables deleted successfully!`);
		return true;
	}

	function toggleVisibilityAll() {
		setShowAll(!showAll);
		setVariables(variables.map((v) => ({ ...v, visible: !showAll })));
	}

	return (
		<>
			<h3 className="text-sm font-medium mb-2 mt-8">Variables</h3>
			<div className="rounded-md border">
				<Table >
					<TableHeader>
						<TableRow>
							<TableHead>
								<Button
									variant={"ghost"}
									size={"sm"}
									onClick={() => setSortKey(sortKey === "desc" ? "asc" : sortKey === "asc" ? "none" : "desc")}
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
								<span className="mr-2">
									Actions
								</span>
								<div className="h-[70%]">
									<Separator orientation="vertical" />
								</div>
								<div className="flex items-center gap-2">
									<Tooltip>
										<TooltipTrigger asChild>
											<Button variant={"ghost"} size={"icon"} disabled={variables.length === 0} onClick={toggleVisibilityAll}>
												{variables.every((v) => v.visible) ? (
													<EyeOff />
												) : (
													<Eye />
												)}
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											{variables.every((v) => v.visible) ? (
												"Hide all variables"
											) : (
												"Show all variables"
											)}
										</TooltipContent>
									</Tooltip>
									<AlertDialog>
										<Tooltip>
											<AlertDialogTrigger asChild>
												<TooltipTrigger asChild>
													<Button variant={"ghost"} size={"icon"} disabled={variables.length === 0}>
														<div className="flex items-center justify-center">
															<Trash />
														</div>
													</Button>
												</TooltipTrigger>
											</AlertDialogTrigger>
											<TooltipContent>
												Delete all variables
											</TooltipContent>
										</Tooltip>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle className="flex items-center gap-2">
													<OctagonAlert className="w-4 h-4 text-destructive" />
													Delete all variables
												</AlertDialogTitle>
												<AlertDialogDescription>Are you sure you want to delete all variables?</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogBody>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<AlertDialogAction onAction={() => handleDeleteAll()} variant={"destructive"}>
														<Trash />
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogBody>
										</AlertDialogContent>

									</AlertDialog>
									{/* <Button variant={"ghost"} size={"icon"} disabled={variables.length === 0} onClick={handleDeleteAll}>
											<Trash />
										</Button> */}
								</div>

							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{variables
							.filter((variable) =>
								variable.key.toLowerCase().includes(search.toLowerCase()),
							)
							.sort((a, b) => {
								if (sortKey === "desc") return b.key.localeCompare(a.key);
								if (sortKey === "asc") return a.key.localeCompare(b.key);
								return 0;
							})
							.map((variable) => (
								<TableRow key={variable.key}>
									<TableCell>
										<div className="flex items-center gap-2">
											<Lock className="h-4 w-4" />
											{variable.key}
										</div>
									</TableCell>
									<TableCell>
										<span className="font-mono text-muted-foreground relative overflow-hidden rounded-md">
											<div className={`absolute inset-0 bg-muted transition-opacity duration-200 z-1 rounded-xs ${!variable.visible ? 'opacity-100' : 'opacity-0'}`} />
											<span className="relative">{variable.value}</span>
										</span>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2">
											<Button
												variant={"ghost"}
												size="icon"
												onClick={() => toggleVisibility(variable)}
											>
												{variable.visible ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
											</Button>

											<EditVariable
												variable={variable}
												variables={variables}
												setVariables={setVariables}
											/>

											<Button
												variant={"outline"}
												size="icon"
												onClick={() => handleDelete(variable.key)}
											>
												<Trash className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						{variables.filter((variable) =>
							variable.key.toLowerCase().includes(search.toLowerCase()),
						).length === 0 && (
								<TableRow>
									<TableCell colSpan={3} className="text-center py-4 bg-muted/50 text-muted-foreground">
										No variables added yet. Click on "Add Variable" to create one.
									</TableCell>
								</TableRow>
							)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}

function CreateVariable({
	variables,
	setVariables,
}: {
	variables: Variable[];
	setVariables: (variables: Variable[]) => void;
}) {
	const [variable, setVariable] = useState<Variable>({ key: "", value: "" });
	const [loading, setLoading] = useState<boolean>(false);

	const VariableForm = useForm<z.infer<typeof VariableSchema>>({
		resolver: zodResolver(VariableSchema),
		defaultValues: {
			key: variable.key,
			value: variable.value,
		},
	});

	async function onSubmit() {
		const isValid = await VariableForm.trigger();
		if (!isValid) return false;

		setLoading(true);

		const data = VariableForm.getValues();
		const keyExists = variables.some((variable) => variable.key === data.key);
		if (keyExists) {
			VariableForm.setError("key", { message: "Key already exists" });
			setLoading(false);
			return false;
		}

		setVariables([...variables, data]);
		setVariable({ key: "", value: "" });
		toast.success(`Variable ${data.key} created successfully!`);
		VariableForm.reset();
		setLoading(false);
		return true; // Retourne true pour fermer le Dialog
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"default"}>
					<Plus />
					Add variable
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...VariableForm}>
					<form onSubmit={(e) => e.preventDefault()}>
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
												placeholder="eg: MY_KEY"
												autoFocus={true}
												{...field}
												comment="Must be in uppercase and not contain spaces."
											/>
										</FormControl>
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
												placeholder="eg: MY_VALUE"
												{...field}
												comment="Must not contain spaces."
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
								disabled={!VariableForm.formState.isValid || loading}
								type="submit"
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

function EditVariable({
	variable,
	variables,
	setVariables,
}: {
	variable: Variable;
	variables: Variable[];
	setVariables: (variables: Variable[]) => void;
}) {
	const [loading, setLoading] = useState<boolean>(false);

	const VariableForm = useForm<z.infer<typeof VariableSchema>>({
		resolver: zodResolver(VariableSchema),
		defaultValues: {
			key: variable.key,
			value: variable.value,
		},
	});

	useEffect(() => {
		VariableForm.reset({
			key: variable.key,
			value: variable.value,
		});
	}, [variable, VariableForm]);

	async function onSubmit() {
		const isValid = await VariableForm.trigger();
		if (!isValid) return false;

		setLoading(true);

		const data = VariableForm.getValues();
		setVariables(
			variables.map((v) =>
				v.key === variable.key ? { ...v, value: data.value } : v,
			),
		);
		toast.success(`Variable ${data.key} updated successfully!`);
		VariableForm.reset();
		setLoading(false);
		return true;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"ghost"} size={"icon"}>
					<Pen />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<Form {...VariableForm}>
					<form onSubmit={(e) => e.preventDefault()}>
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
												comment="You can't change the key."
												{...field}
											/>
										</FormControl>
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
												placeholder="eg: MY_VALUE"
												showPasswordToggle={true}
												comment="Must not contain spaces."
												{...field}
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
								disabled={!VariableForm.formState.isValid || loading}
								type="submit"
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

function ImportEnv({
	variables,
	setVariables,
}: {
	variables: Variable[];
	setVariables: (variables: Variable[]) => void;
}) {
	const [envPreview, setEnvPreview] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [isDragActive, setIsDragActive] = useState(false);
	const inputFileRef = useRef<HTMLInputElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);

	const VariableEnvForm = useForm<z.infer<typeof VariableEnvSchema>>({
		resolver: zodResolver(VariableEnvSchema),
	});

	const VariableTextForm = useForm<z.infer<typeof VariableTextSchema>>({
		resolver: zodResolver(VariableTextSchema),
	});

	async function onSubmitText() {
		const isValid = await VariableTextForm.trigger();
		if (!isValid) return false;

		setLoading(true);

		const data = VariableTextForm.getValues();

		return handleUpdate(data.textarea);
	}

	async function onSubmitEnv() {
		const isValid = await VariableEnvForm.trigger();
		if (!isValid) return false;

		setLoading(true);

		const data = VariableEnvForm.getValues();

		// On récupère le contenu du fichier
		const file = data.file as File;
		if (!file) {
			VariableEnvForm.setError("file", {
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
		const parsedVariables = parseVariablesFromEnv({
			content: text,
			variables: variables,
		});

		if (parsedVariables.length === 0) {
			VariableEnvForm.setError("file", {
				message: "No valid variables found in the file.",
			});
			setLoading(false);
			return false;
		} else {
			setEnvPreview("");
			VariableEnvForm.reset();
		}

		toast.success(`${parsedVariables.length} variables imported successfully!`);

		setVariables([...parsedVariables, ...variables]);

		setLoading(false);

		closeRef.current?.click();
		return true;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"outline"}>
					<FileUp />
					Import variables
				</Button>
			</AlertDialogTrigger>
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
					<TabsBody>
						<TabsContent value="file">
							<Form {...VariableEnvForm}>
								<form onSubmit={(e) => e.preventDefault()} className="mt-4">
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
															type="button"
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
							<Form {...VariableTextForm}>
								<form onSubmit={(e) => e.preventDefault()} className="mt-4">
									<AlertDialogBody>
										<FormField
											control={VariableTextForm.control}
											name="textarea"
											render={({ field }) => {
												return (
													<FormItem>
														<FormLabel>Content</FormLabel>
														<FormControl>
															{/* <Textarea
																id="textarea"
																placeholder="KEY=VALUE"
																autoFocus={true}
																className="min-h-32 max-h-64"
																comment="Each line must be in the form KEY=VALUE. Lines starting with # are ignored."
																{...field}
															/> */}
															<CodeEditor
																language="env"
																value={(field.value == "" || field.value == null) ? "\n\n\n\n\n\n" : field.value}
																onChange={field.onChange}
																comment="Each line must be in the form KEY=VALUE. Lines starting with # are ignored."
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
											disabled={!VariableTextForm.formState.isValid || loading}
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