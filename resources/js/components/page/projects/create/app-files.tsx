// Necessary imports
import {
	useEffect,
	Dispatch,
	SetStateAction,
	ReactNode,
	useState,
} from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

// Icons
import {
	ArrowRight,
	FileArchive,
	Info,
	FolderGit2,
	Loader2,
	ArrowDownToLine,
	FileUp,
	ChevronDown,
	Github,
	Gitlab,
	X,
	Check,
	GitBranch,
	Tag,
} from "lucide-react";

// Contexts
import { useProject } from "@/contexts/project-context";

// Schemas
import { FileSchema } from "@/lib/files/type";

// Mocks
import {
	mock_repositories_github,
	mock_repositories_gitlab,
	mock_targets_branch,
	mock_targets_tag,
} from "@/lib/files/type";

// Constants
import { git_types, git_providers } from "@/lib/files/type";

// Types
import { type ComboboxOption } from "@/components/ui/combobox";
import { SmoothItem } from "@/components/ui/smooth-resized";

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
				<TabsTrigger value="git">Git</TabsTrigger>
				<TabsTrigger value="import">Import</TabsTrigger>
			</TabsList>
			<TabsBody>
				<TabsContent value="none">
					<AppNone />
				</TabsContent>
				<TabsContent value="git">
					<AppGit />
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
					<ModalGit>
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

function ModalGit({ children }: { children: ReactNode }) {
	// Contexts
	const { setCurrentValue } = useTabsContext();

	// Variables
	const [repositories, setRepositories] = useState<ComboboxOption[]>([]);
	const [targets, setTargets] = useState<ComboboxOption[]>([]);

	// Temp variables
	const [fetchingRepositories, setFetchingRepositories] =
		useState<boolean>(false);
	const [fetchingTargets, setFetchingTargets] = useState<boolean>(false);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [providerStatus, setProviderStatus] = useState<
		"none" | "error" | "success" | "loading"
	>("none");

	// Form
	const GitForm = useForm<z.infer<typeof FileSchema>>({
		resolver: zodResolver(FileSchema),
		defaultValues: {
			type: "git",
		},
	});

	// Watchers
	const gitProvider = GitForm.watch("git_provider");
	const gitRepo = GitForm.watch("git_repository");
	const gitType = GitForm.watch("git_type");

	// Custom methods
	async function fetchRepositories() {
		// Fetching repositories
		setFetchingRepositories(true);
		await new Promise((r) => setTimeout(r, 4000));
		setFetchingRepositories(false);

		// Assigning mock repositories
		if (gitProvider === "github") {
			setRepositories(mock_repositories_github);
		} else if (gitProvider === "gitlab") {
			setRepositories(mock_repositories_gitlab);
		} else {
			setRepositories([]);
		}
	}

	async function fetchTargets(gitType: string) {
		// Fetch targets
		setFetchingTargets(true);
		await new Promise((r) => setTimeout(r, 4000));
		setFetchingTargets(false);

		// Assign mock targets
		setTargets(gitType === "branch" ? mock_targets_branch : mock_targets_tag);
	}

	async function connectProvider() {
		// Connect to provider
		setProviderStatus("loading");
		await new Promise((r) => setTimeout(r, 3000));
		// const success = gitProvider === "github" ? true : false;
		const success = true;
		setProviderStatus(success ? "success" : "error");

		if (success) {
			fetchRepositories();
		}
	}

	async function onSubmit() {
		const isValid = await GitForm.trigger();
		if (!isValid) return false;

		setSubmitting(true);

		const data = GitForm.getValues();

		await new Promise((resolve) => setTimeout(resolve, 1000));

		GitForm.reset();
		setCurrentValue("git");
		setSubmitting(false);
		toast.success("Git repository linked successfully!");
		return true;
	}

	// Custom Hooks
	// Reset form on mount
	useEffect(() => {
		// Reset form fields
		GitForm.setValue("git_provider", ""); // TSX error but optimal for UX experience
		GitForm.setValue("git_repository", "");
		GitForm.setValue("git_type", ""); // TSX error but optimal for UX experience
		GitForm.setValue("git_target", "");

		// Empty variables
		setRepositories([]);
		setTargets([]);
	}, []);

	// Connect to provider on provider change
	useEffect(() => {
		// Reset form fields
		GitForm.setValue("git_repository", "");
		GitForm.setValue("git_type", ""); // TSX error but optimal for UX experience
		GitForm.setValue("git_target", "");

		// Empty variables
		setRepositories([]);
		setTargets([]);

		// Basic verification
		if (!gitProvider) {
			console.error("Requirements not met to connect to provider");
			return;
		} else {
			connectProvider();
		}
	}, [gitProvider]);

	// Fetch targets on type change
	useEffect(() => {
		// Reset form fields
		GitForm.setValue("git_target", "");

		// Empty variables
		setTargets([]);

		// Basic verification
		if (!gitProvider || !gitRepo || !gitType || providerStatus !== "success") {
			console.error("Requirements not met to fetch targets");
			return;
		} else {
			fetchTargets(gitType);
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
								<SmoothItem layout={false}>
									{gitProvider && providerStatus !== "none" && (
										<Alert
											variant={providerStatus === "error" ? "destructive" : "default"}
										>
											{providerStatus === "loading" && (
												<AlertTitle className="flex items-center gap-2">
													<Loader2 className="h-4 w-4 mr-2 animate-spin" />
													Connecting to provider...
												</AlertTitle>
											)}

											{providerStatus === "error" && (
												<>
													<AlertTitle className="flex items-center gap-2">
														<X className="h-4 w-4" />
														Error connecting to provider {gitProvider}
													</AlertTitle>
													<AlertDescription>
														There was an error connecting to the selected Git provider. Please
														ensure you have the necessary permissions and try again.
													</AlertDescription>
												</>
											)}

											{providerStatus === "success" && (
												<AlertTitle className="flex items-center gap-2">
													<Check className="h-4 w-4" />
													Successfully connected to {gitProvider}!
												</AlertTitle>
											)}
										</Alert>
									)}
								</SmoothItem>

								{/* Provider & Repository */}
								<div className="grid grid-cols-2 gap-4 col-span-1">
									{/* Provider */}
									<div className="col-span-1">
										<FormField
											control={GitForm.control}
											name="git_provider"
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
															disabled={submitting}
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
											name="git_repository"
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
																submitting || !gitProvider || providerStatus !== "success"
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
											name="git_type"
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
																submitting ||
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
											name="git_target"
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
																submitting ||
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
							<AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								variant={"default"}
								type={"submit"}
								onAction={onSubmit}
								disabled={submitting || providerStatus !== "success"}
							>
								{submitting ? (
									<Loader2 className="animate-spin" />
								) : (
									<ArrowDownToLine />
								)}
								Pull repository
							</AlertDialogAction>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function ModalImport({ children }: { children: ReactNode }) {
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
					<AlertDialogBody>
						<div className="grid grid-cols-2">
							{/* Import file */}
							<div></div>
						</div>
					</AlertDialogBody>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction variant={"default"} type={"submit"}>
							<FileUp />
							Import ZIP File
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function AppGit() {
	return <></>;
}
function AppImport() {
	return <></>;
}
