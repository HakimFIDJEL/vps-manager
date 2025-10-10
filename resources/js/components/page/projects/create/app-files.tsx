// Necessary imports
import { useEffect, Dispatch, SetStateAction, useState, useRef } from "react";
import { cn, ucfirst, initials } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Custom components
import { SmoothAnimate } from "@/components/ui/smooth-resized";

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
import { Combobox } from "@/components/ui/combobox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Utils
import {
	connectProvider,
	fetchRepositories,
	fetchTargets,
} from "@/lib/files/utils";

// Icons
import {
	ArrowRight,
	FileArchive,
	Info,
	FolderGit2,
	Loader2,
	FileUp,
	ChevronDown,
	X,
	Check,
	Link,
	Computer,
	BookCopy,
	GitBranch,
	Tag,
	GitFork,
	RefreshCcw,
} from "lucide-react";

// Contexts
import { useProject } from "@/contexts/project-context";
import { useFile } from "@/contexts/files-context";

// Schemas
import { type FileAction, Files, FileSchema } from "@/lib/files/type";

// Constants
import { git_types, git_providers } from "@/lib/files/type";

// Types
import { type ComboboxOption } from "@/components/ui/combobox";
import { FileExplorer } from "@/components/ui/file-explorer";

export function AppFiles({
	setValidate,
}: {
	setValidate: Dispatch<SetStateAction<() => Promise<boolean>>>;
}) {
	// Custom hooks
	const { project } = useProject();
	const { handleFile, loading } = useFile();

	const validator = async () => {
		// Validation

		return true;
	};

	useEffect(() => {
		setValidate(() => validator);
	}, [setValidate, project.docker]);

	return (
		<Tabs defaultValue={project.files.type}>
			<TabsList className="hidden">
				<TabsTrigger value="none">None</TabsTrigger>
				<TabsTrigger value="git">Git</TabsTrigger>
				<TabsTrigger value="import">Import</TabsTrigger>
			</TabsList>
			<TabsBody>
				<TabsContent value="none">
					<AppNone handleFile={handleFile} loading={loading} />
				</TabsContent>
				<TabsContent value="git">
					<AppGit handleFile={handleFile} loading={loading} />
				</TabsContent>
				<TabsContent value="import">
					<AppImport handleFile={handleFile} loading={loading} />
				</TabsContent>
			</TabsBody>
		</Tabs>
	);
}

export function AppNone({
	handleFile,
	loading = false,
}: {
	handleFile: (action: FileAction) => Promise<boolean>;
	loading?: boolean;
}) {
	return (
		<div className="grid gap-2">
			<div className="flex flex-col">
				<h3 className="text-sm font-medium mb-2">Import files</h3>
				<div className="grid grid-cols-3 gap-4">
					<ModalGit handleFile={handleFile} loading={loading}>
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
									Connect your project to a Git repository targeting a chosen branch or
									tag.
								</div>
							</div>
							<ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
						</button>
					</ModalGit>

					<ModalImport handleFile={handleFile} loading={loading}>
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

function ModalGit({
	children,
	handleFile,
	loading = false,
}: {
	children: React.ReactNode;
	handleFile: (action: FileAction) => Promise<boolean>;
	loading?: boolean;
}) {
	// Contexts
	const { setCurrentValue } = useTabsContext();
	const { project } = useProject();

	// Variables
	const [repositories, setRepositories] = useState<ComboboxOption[]>([]);
	const [targets, setTargets] = useState<ComboboxOption[]>([]);
	const [username, setUsername] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [avatar, setAvatar] = useState<string>("");

	// Temp variables
	const [fetchingRepositories, setFetchingRepositories] =
		useState<boolean>(false);
	const [fetchingTargets, setFetchingTargets] = useState<boolean>(false);
	const [providerStatus, setProviderStatus] = useState<
		"none" | "error" | "success" | "loading"
	>("none");

	// Form
	const GitForm = useForm<z.infer<typeof FileSchema>>({
		resolver: zodResolver(FileSchema),
		defaultValues: {
			type: "git",
			git: project.files.git,
		},
	});

	// Watchers
	const gitProvider = GitForm.watch("git.provider");
	const gitRepo = GitForm.watch("git.repository");
	const gitType = GitForm.watch("git.type");

	// Custom methods
	async function _fetchRepositories() {
		setFetchingRepositories(true);
		const repositories = await fetchRepositories({ provider: gitProvider });
		setRepositories(repositories);
		setFetchingRepositories(false);
	}

	async function _fetchTargets() {
		setFetchingTargets(true);
		const targets = await fetchTargets({ type: gitType });
		setTargets(targets);
		setFetchingTargets(false);
	}

	async function _connectProvider() {
		// Connect to provider
		setProviderStatus("loading");
		const data = await connectProvider({ provider: gitProvider });
		setProviderStatus(data.providerStatus ? "success" : "error");

		if (data.providerStatus) {
			_fetchRepositories();

			const fetched_username = data.username;
			const fetched_name = data.name;
			const fetched_avatar = data.avatar;

			// Update the variables
			setUsername(fetched_username);
			setName(fetched_name ?? "");
			setAvatar(fetched_avatar ?? "");

			// Update the form
			GitForm.setValue("git.username", fetched_username);
			GitForm.setValue("git.name", fetched_name);
			GitForm.setValue("git.avatar", fetched_avatar);
		}
	}

	async function onSubmit() {
		const isValid = await GitForm.trigger();
		if (!isValid) return false;

		const data = GitForm.getValues();

		await handleFile({ type: "file-git-link", files: data });

		setCurrentValue("git");
		return true;
	}

	// Custom Hooks
	// Reset form on mount
	useEffect(() => {
		// Reset form fields
		GitForm.resetField("git.provider");
		GitForm.resetField("git.repository", { defaultValue: undefined });
		GitForm.resetField("git.type");
		GitForm.resetField("git.target", { defaultValue: undefined });

		// Empty variables
		setRepositories([]);
		setTargets([]);
	}, []);

	// Connect to provider on provider change
	useEffect(() => {
		setProviderStatus("none");
		// Reset user information
		setUsername("");
		setName("");
		setAvatar("");

		// Reset form fields
		GitForm.resetField("git.repository", { defaultValue: undefined });
		GitForm.resetField("git.type");
		GitForm.resetField("git.target", { defaultValue: undefined });

		// Empty variables
		setRepositories([]);
		setTargets([]);

		// Basic verification
		if (!gitProvider) {
			console.info("Requirements not met to connect to provider");
			return;
		} else {
			_connectProvider();
		}
	}, [gitProvider]);

	// Fetch targets on type change
	useEffect(() => {
		// Reset form fields
		GitForm.resetField("git.target", { defaultValue: undefined });

		// Empty variables
		setTargets([]);

		// Basic verification
		if (!gitProvider || !gitRepo || !gitType || providerStatus !== "success") {
			console.info("Requirements not met to fetch targets");
			return;
		} else {
			_fetchTargets();
		}
	}, [gitProvider, gitRepo, gitType, providerStatus]);

	// Test : Console.log form values on change
	// useEffect(() => {
	// 	console.log("Form values:", GitForm.getValues());
	// }, [GitForm.watch()]);

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent className="!max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						Import files via Git
					</AlertDialogTitle>
					<AlertDialogDescription>
						Connect your project to a Git repository targeting a chosen branch or tag.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<Form {...GitForm}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<AlertDialogBody className="mb-4">
							<div className="grid items-center gap-3">
								{/* Alert for provider status */}
								{providerStatus === "loading" && gitProvider && (
									<Alert variant={"default"}>
										<AlertTitle className="flex items-center gap-2">
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											Connecting to provider...
										</AlertTitle>
									</Alert>
								)}

								{providerStatus === "error" && gitProvider && (
									<Alert variant={"destructive"}>
										<AlertTitle className="flex items-center gap-2">
											<X className="h-4 w-4" />
											Error connecting to provider {ucfirst(gitProvider)}
										</AlertTitle>
										<AlertDescription>
											There was an error connecting to the selected Git provider. Please
											ensure you have the necessary permissions and try again. Follow the
											README guide for more information.
										</AlertDescription>
									</Alert>
								)}

								{providerStatus === "success" && gitProvider && (
									<Alert variant={"default"}>
										<AlertTitle className="flex justify-between items-center gap-2">
											<div className="flex items-center gap-2">
												<Check className="h-4 w-4" />
												Successfully connected to {ucfirst(gitProvider)} as{" "}
												{name ? name : username}!
												{name && (
													<span className="text-sm text-muted-foreground">
														(@{username})
													</span>
												)}
											</div>
											<Avatar className="size-6">
												<AvatarImage src={avatar} />
												<AvatarFallback>
													{name ? initials(name) : initials(username)}
												</AvatarFallback>
											</Avatar>
										</AlertTitle>
									</Alert>
								)}

								{/* Provider & Repository */}
								<div className="grid grid-cols-2 gap-4 col-span-1">
									{/* Provider */}
									<div className="col-span-1">
										<FormField
											control={GitForm.control}
											name="git.provider"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Provider</FormLabel>
													<FormControl>
														<Combobox
															options={git_providers}
															className="w-full"
															placeholder="Select a provider"
															allowDeselect
															searchable={false}
															icon={
																<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															}
															onValueChange={field.onChange}
															disabled={loading}
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Select a Git provider to import an existing project from a Git
														Repository.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Repository */}
									<div className="col-span-1">
										<FormField
											control={GitForm.control}
											name="git.repository"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Repository</FormLabel>
													<FormControl>
														<Combobox
															options={repositories}
															className="w-full"
															placeholder="Select a repository"
															icon={
																<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															}
															onValueChange={field.onChange}
															disabled={
																loading || !gitProvider || providerStatus !== "success"
															}
															loading={fetchingRepositories}
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Select the repository you want to link to this project.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								{/* Type & Target */}
								<div className="grid grid-cols-2 gap-4 col-span-1">
									{/* Type */}
									<div className="col-span-1">
										<FormField
											control={GitForm.control}
											name="git.type"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Type</FormLabel>
													<FormControl>
														<Combobox
															options={git_types}
															searchable={false}
															className="w-full"
															placeholder="Select a type"
															onValueChange={field.onChange}
															disabled={
																loading ||
																!gitProvider ||
																!gitRepo ||
																providerStatus !== "success"
															}
															icon={
																<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															}
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Select whether you want to pull from a branch or a tag.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Target */}
									<div className="col-span-1">
										<FormField
											control={GitForm.control}
											name="git.target"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Target</FormLabel>
													<FormControl>
														<Combobox
															options={targets}
															className="w-full"
															placeholder="Select a target"
															onValueChange={field.onChange}
															disabled={
																loading ||
																!gitProvider ||
																!gitRepo ||
																providerStatus !== "success" ||
																!gitType
															}
															loading={fetchingTargets}
															icon={
																<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
															}
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Select the branch or tag you want to pull from the repository.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</div>
						</AlertDialogBody>

						<AlertDialogFooter>
							<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								variant={"default"}
								type={"submit"}
								onAction={onSubmit}
								disabled={loading || providerStatus !== "success"}
							>
								{loading ? <Loader2 className="animate-spin" /> : <Link />}
								Link repository
							</AlertDialogAction>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function ModalImport({
	children,
	handleFile,
	loading = false,
}: {
	children: React.ReactNode;
	handleFile: (action: FileAction) => Promise<boolean>;
	loading?: boolean;
}) {
	// States
	const [isDragActive, setIsDragActive] = useState(false);

	// Contexts
	const { setCurrentValue } = useTabsContext();

	// Refs
	const inputFileRef = useRef<HTMLInputElement>(null);

	// Form
	const FileForm = useForm<z.infer<typeof FileSchema>>({
		resolver: zodResolver(FileSchema),
		defaultValues: {
			type: "import",
			import: { file: undefined },
		},
	});

	const file = FileForm.watch("import.file");

	async function onSubmit() {
		const isValid = await FileForm.trigger();
		if (!isValid) return false;

		await handleFile({ type: "file-import-upload", file: file });

		setCurrentValue("import");
		return true;
	}

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
				<Form {...FileForm}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<AlertDialogBody>
							<SmoothAnimate>
								{file ? (
									<Item variant={"outline"}>
										<ItemMedia variant="icon">
											<Check />
										</ItemMedia>
										<ItemContent>
											<ItemTitle>File ready to import</ItemTitle>
											<ItemDescription>
												{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
											</ItemDescription>
										</ItemContent>
										<ItemActions>
											<Button
												variant={"outline"}
												type={"button"}
												onClick={() => {
													FileForm.resetField("import.file");
												}}
												disabled={loading}
												className="group"
											>
												{loading ? (
													<Loader2 className="animate-spin" />
												) : (
													<RefreshCcw className="group-hover:-rotate-180 transition-transform duration-300" />
												)}
												Reset
											</Button>
										</ItemActions>
									</Item>
								) : (
									<FormField
										control={FileForm.control}
										name="import.file"
										render={({ field }) => {
											// Mandatory for a file input that cant take a value
											const { value, ...rest } = field;

											return (
												<FormItem className="gap-0">
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

															field.onChange(file);
															const isValid = await FileForm.trigger("import.file");

															if (!isValid) return false;
														}}
													>
														<div className="text-center">
															<FileUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
															<p className="text-sm text-muted-foreground mb-2">
																Drag and drop your zipped project here or click to select it.
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
													<FormControl>
														<Input
															id="file"
															type="file"
															accept=".zip"
															className="hidden"
															ref={inputFileRef}
															onChange={async (e) => {
																const file = e.target.files?.[0] ?? null;
																if (file) {
																	// On met à jour le champ du formulaire
																	field.onChange(file);
																	// On déclenche la validation
																	const isValid = await FileForm.trigger("import.file");

																	if (!isValid) return false;
																} else {
																	field.onChange(null);
																}
															}}
														/>
													</FormControl>
													<FormDescription className="mt-2">
														Only .zip files are accepted, max size 100MB.
													</FormDescription>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								)}
							</SmoothAnimate>
						</AlertDialogBody>

						<AlertDialogFooter className="mt-4">
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								variant={"default"}
								type={"submit"}
								onAction={onSubmit}
								disabled={loading}
							>
								{loading ? <Loader2 className="animate-spin" /> : <FileUp />}
								Import ZIP File
							</AlertDialogAction>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function AppGit({
	handleFile,
	loading = false,
}: {
	handleFile: (action: FileAction) => Promise<boolean>;
	loading?: boolean;
}) {
	// Contexts
	const { setCurrentValue } = useTabsContext();
	const { project } = useProject();

	// Custom methods
	async function handleReset() {
		await handleFile({ type: "file-reset-type" });
		setCurrentValue("none");
		return true;
	}

	return (
		<div className="flex flex-col gap-2">
			<h3 className="text-sm font-medium">Import method</h3>
			<Item variant={"outline"} className="col-span-2">
				<ItemMedia variant="icon">
					<FolderGit2 />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Git</ItemTitle>
					<ItemDescription>
						Import your project files from a Git repository.
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button
						variant={"outline"}
						type={"button"}
						onClick={handleReset}
						disabled={loading}
						className="group"
					>
						{loading ? (
							<Loader2 className="animate-spin" />
						) : (
							<RefreshCcw className="group-hover:-rotate-180 transition-transform duration-300" />
						)}
						Reset
					</Button>
				</ItemActions>
			</Item>

			<h3 className="text-sm font-medium mt-2">Details</h3>
			<div className="grid grid-cols-2 gap-2">
				<Item variant="outline" className="col-span-1">
					<ItemMedia variant="icon">
						<Computer />
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="flex items-center gap-2">
							{ucfirst(project.files.git?.provider ?? "Unknown")}
							<span className="text-sm text-muted-foreground font-light">
								(Git provider)
							</span>
						</ItemTitle>
						<ItemDescription>
							Authenticated Git provider used to fetch repositories and metadata.
						</ItemDescription>
					</ItemContent>
				</Item>
				<Item variant="outline" className="col-span-1">
					<ItemMedia variant="icon">
						<BookCopy />
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="flex items-center gap-2">
							{project.files.git?.repository}
							<span className="text-sm text-muted-foreground font-light">
								(Git repository)
							</span>
						</ItemTitle>
						<ItemDescription>
							Repository that serves as the file source for this project.
						</ItemDescription>
					</ItemContent>
				</Item>
				<Item variant="outline" className="col-span-1">
					<ItemMedia variant="icon">
						{project.files.git?.type === "branch" ? <GitBranch /> : <Tag />}
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="flex items-center gap-2">
							{ucfirst(project.files.git?.type ?? "Unknown")}
							<span className="text-sm text-muted-foreground font-light">
								(Git type)
							</span>
						</ItemTitle>
						<ItemDescription>
							Tracking mode: branch for continuous updates, tag for a fixed snapshot.
						</ItemDescription>
					</ItemContent>
				</Item>
				<Item variant="outline" className="col-span-1">
					<ItemMedia variant="icon">
						<GitFork />
					</ItemMedia>
					<ItemContent>
						<ItemTitle className="flex items-center gap-2">
							{project.files.git?.target}
							<span className="text-sm text-muted-foreground font-light">
								(Git target)
							</span>
						</ItemTitle>
						<ItemDescription>
							Selected ref (branch or tag) pulled on import and deploy.
						</ItemDescription>
					</ItemContent>
				</Item>
			</div>
		</div>
	);
}

function AppImport({
	handleFile,
	loading = false,
}: {
	handleFile: (action: FileAction) => Promise<boolean>;
	loading?: boolean;
}) {

	// Contexts
	const { setCurrentValue } = useTabsContext();
	const { project } = useProject();

	const file_structure = project.files.import?.file_structure;

	if (!file_structure) {
		toast.error('An error occured', {
			description: "No file structure found. Please re-import your ZIP file.",
		})
		setCurrentValue("none");
		return;
	}

	return (
		<FileExplorer
			file_structure={file_structure}
			project_path={project.path}
			disabled={loading}
		/>
	);
}
