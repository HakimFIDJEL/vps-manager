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
} from "lucide-react";

// Contexts
import { useProject } from "@/contexts/project-context";

// Schemas
import { FileSchema } from "@/lib/files/type";

// Types
import { type ComboboxOption } from "@/components/ui/combobox";

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

	// Constants
	const [types, setTypes] = useState<ComboboxOption[]>([
		{ label: "Branch", value: "branch" },
		{ label: "Tag", value: "tag" },
	]);
	const [providers, setProviders] = useState<ComboboxOption[]>([
		{ label: "GitHub", value: "github", icon: <Github /> },
		{ label: "GitLab", value: "gitlab", icon: <Gitlab /> },
		// Bitbucket for a next release
		// { label: "Bitbucket", value: "bitbucket"},
	]);

	// Temp variables
	const [fetchingRepositories, setFetchingRepositories] = useState<boolean>(false);
	const [fetchingTargets, setFetchingTargets] = useState<boolean>(false);
	const [submitting, setSubmitting] = useState<boolean>(false);

	// Form
	const GitForm = useForm<z.infer<typeof FileSchema>>({
		resolver: zodResolver(FileSchema),
		defaultValues: {
			type: "git",
		},
	});

	// Custom methods
	async function fetchRepositories() {
		setFetchingRepositories(true);

		// Fetch repositories from API
		await new Promise((resolve) => setTimeout(resolve, 4000));

		setFetchingRepositories(false);

		setRepositories([
			{ label: "my-repo", value: "my-repo" },
			{ label: "another-repo", value: "another-repo" },
			{ label: "test-repo", value: "test-repo" },
		]);
	}

	async function fetchTargets(type: string) {
		setFetchingTargets(true);

		// Fetch targets from API based on type (branch or tag)
		await new Promise((resolve) => setTimeout(resolve, 4000));

		setFetchingTargets(false);

		if (type === "branch") {
			setTargets([
				{ label: "main", value: "main" },
				{ label: "development", value: "development" },
				{ label: "feature-xyz", value: "feature-xyz" },
			]);
		} else {
			setTargets([
				{ label: "v1.0.0", value: "v1.0.0" },
				{ label: "v1.1.0", value: "v1.1.0" },
				{ label: "v2.0.0", value: "v2.0.0" },
			]);
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

	const gitProvider = GitForm.watch("git_provider");
	const gitRepo = GitForm.watch("git_repository");
	const gitType = GitForm.watch("git_type");

	// Fetch repositories on provider change
	useEffect(() => {
		GitForm.resetField("git_repository");
		GitForm.resetField("git_type");
		GitForm.resetField("git_target");
		setRepositories([]);
		setTargets([]);
		if (gitProvider) fetchRepositories();
	}, [gitProvider]);

	// Fetch targets on type change
	useEffect(() => {
		GitForm.resetField("git_target");
		setTargets([]);
		if (gitType) fetchTargets(gitType);
	}, [gitType]);

	// Test : Console.log form values on change
	// useEffect(() => {
	// 	console.log("Form values:", GitForm.getValues());
	// }, [GitForm.watch()]);

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

				<Form {...GitForm}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						<AlertDialogBody className="mb-4">
							<div className="grid items-center gap-3">
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
															options={providers}
															className="w-full"
															placeholder="Select a provider"
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
														Select a Git provider to import an existing project from a Git Repository.
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
															disabled={submitting || !gitProvider}
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
															options={types}
															searchable={false}
															className="w-full"
															placeholder="Select a type"
															onValueChange={field.onChange}
															disabled={submitting || !gitRepo}
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
															disabled={submitting || !gitType}
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
								disabled={submitting}
							>
								{submitting ? <Loader2 className="animate-spin" /> : <ArrowDownToLine />}
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
