// Necessary imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Libs
import { DOCKER_COMPOSE_KEYWORDS } from "@/lib/docker/keywords";
import { parseDockerCompose } from "@/lib/docker/parser";
import { formatServiceImage, formatDockerDriver } from "@/lib/docker/formatter";
import { DOCKER_TEMPLATES } from "@/lib/docker/templates";

// Custom components
import { SmoothAnimate } from "@/components/ui/smooth-resized";
import { CodeEditor } from "@/components/ui/code-editor";

// Shadcn UI components
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
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
	useTabsContext,
} from "@/components/ui/tabs";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Icons
import {
	Copy,
	Server,
	Database,
	Network,
	Settings,
	FileUp,
	ArrowRight,
	File,
	Check,
	FileLock,
	Info,
	LucideIcon,
	Save,
	X,
	OctagonMinus,
	FileKey,
	Eraser,
	RefreshCcw,
	Ellipsis,
	Upload,
} from "lucide-react";

// Contexts
import { useProject } from "@/contexts/project-context";
import { useDocker } from "@/contexts/docker-context";

// Types
import { type DockerAction } from "@/lib/docker/type";
import { ProjectSchema } from "@/lib/projects/type";
import { DockerComposeFileSchema } from "@/lib/docker/type";

export function AppDocker({
	setValidate,
}: {
	setValidate: Dispatch<SetStateAction<() => Promise<boolean>>>;
}) {
	// Custom hooks
	const { project } = useProject();
	const { handleDocker, loading } = useDocker();

	const validator = async () => {
		// Check if the content is not empty
		if (project.docker.content.length === 0) {
			toast.error("An error occured", { description: "Your docker configuration must not be empty" });
			return false;
		}

		// Check if the schema is valid
		const result = ProjectSchema.shape.docker.safeParse(project.docker);

		if (!result.success) {
			toast.error("An error occured", { description: result.error.errors[0].message });
			return false;
		}

		// Check if the docker configuration is saved
		if (!project.docker.isSaved) {
			toast.error("An error occured", { description: "You must save your docker configuration" });
			return false;
		}

		return true;
	};

	useEffect(() => {
		setValidate(() => validator);
	}, [setValidate, project.docker]);

	return (
		<Tabs defaultValue={project.docker.content ? "docker" : "empty"}>
			<TabsList className="hidden">
				<TabsTrigger value="empty">Empty</TabsTrigger>
				<TabsTrigger value="docker">Docker</TabsTrigger>
			</TabsList>
			<TabsBody>
				<TabsContent value="empty">
					<EmptyDockerState
						handleDocker={handleDocker}
						loading={loading}
					/>
				</TabsContent>
				<TabsContent value="docker">
					<DockerConfiguration
						handleDocker={handleDocker}
						loading={loading}
					/>
				</TabsContent>
			</TabsBody>
		</Tabs>
	);
}

function EmptyDockerState({
	handleDocker,
	loading = false,
}: {
	handleDocker: (action: DockerAction) => Promise<boolean>;
	loading?: boolean;
}) {
	// States
	const [isDragActive, setIsDragActive] = useState(false);

	// Refs
	const inputFileRef = useRef<HTMLInputElement>(null);

	// Custom hooks
	const { setCurrentValue } = useTabsContext();
	const { project } = useProject();

	// Variables
	const DockerComposeForm = useForm<z.infer<typeof DockerComposeFileSchema>>({
		resolver: zodResolver(DockerComposeFileSchema),
		mode: "onChange",
		defaultValues: {
			file: undefined,
		},
	});

	// Custom methods
	const handleTemplateSelect = (templateKey: keyof typeof DOCKER_TEMPLATES) => {
		const templateContent = DOCKER_TEMPLATES[templateKey];
		const variable_length = project.variables.length;
		const parsed = parseDockerCompose(
			templateContent,
			project.docker.isStrict,
			variable_length,
		);
		if (parsed.isValid && parsed.updatedContent) {
			const newState = {
				content: parsed.updatedContent,
				isSaved: true,
				isStrict: false,
				parsed: {
					services: parsed.services,
					volumes: parsed.volumes,
					networks: parsed.networks,
				},
			};

			setCurrentValue("docker");
			handleDocker({ type: "docker-create", docker: newState });
		}
	};

	const handleFileUpload = async (file: File) => {
		try {
			// Update form field
			DockerComposeForm.setValue("file", file, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});

			// Validate file
			const result = await DockerComposeForm.trigger("file");
			if (!result) {
				const errors = DockerComposeForm.formState.errors;
				if (errors.file) {
					console.error("Form validation errors:", errors.file);
					toast.error("An error occured", { description: errors.file.message as string });
				}
				return;
			}

			// Read file content
			const content = await file.text();

			// Parse and validate content
			const variable_length = project.variables.length;
			const parsed = parseDockerCompose(
				content,
				project.docker.isStrict,
				variable_length,
			);
			if (parsed.isValid && parsed.updatedContent) {
				const newState = {
					content: parsed.updatedContent,
					isSaved: true,
					isStrict: false,
					parsed: {
						services: parsed.services,
						volumes: parsed.volumes,
						networks: parsed.networks,
					},
				};

				setCurrentValue("docker");

				handleDocker({ type: "docker-create", docker: newState });
			}
		} catch (error) {
			console.error("Error uploading file:", error);
			toast.error("An error occured", { description: "An error occurred while importing the file" });
		}
	};

	return (
		<div className="grid gap-4">
			<div className="flex flex-col">
				<h3 className="text-sm font-medium mb-2">Import file</h3>
				<Form {...DockerComposeForm}>
					<form onSubmit={(e) => e.preventDefault()}>
						<FormField
							control={DockerComposeForm.control}
							name="file"
							render={({ field }) => {
								const { value, ...rest } = field;

								return (
									<FormItem>
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
												if (!file) {
													toast.error("An error occured", { description: "No file was dropped" });
													return;
												}

												// Validate and upload
												await handleFileUpload(file);
											}}
										>
											<div className="text-center">
												<FileUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
												<p className="text-sm text-muted-foreground mb-2">
													Drag and drop your docker-compose.yml file here
												</p>
												<Button
													variant={"outline"}
													size={"sm"}
													onClick={() => inputFileRef.current?.click()}
													type={"button"}
													disabled={loading}
												>
													Browse files
												</Button>
											</div>
										</FormLabel>
										<FormControl>
											<Input
												id="file"
												type="file"
												accept=".yml,.yaml"
												className="hidden"
												ref={inputFileRef}
												{...Object.fromEntries(
													Object.entries(rest).filter(([k]) => k !== "ref"),
												)}
												onChange={async (e) => {
													const file = e.target.files?.[0] ?? null;
													if (file) {
														await handleFileUpload(file);
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
					</form>
				</Form>

				<div className="relative flex items-center my-6">
					<div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border" />
					<div className="relative bg-card px-2 mx-auto">
						<span className="text-xs text-muted-foreground">OR</span>
					</div>
				</div>

				<h3 className="text-sm font-medium mb-2">Choose a template</h3>
				<div className="grid grid-cols-3 gap-4">
					<TemplateLink
						title="Web Application"
						subtitle="PHP 8.2, Node.js, Apache, MySQL, phpMyAdmin, Traefik"
						icon={Server}
						onClick={() => handleTemplateSelect("webApp")}
						disabled={loading}
					/>

					<TemplateLink
						title="Data Science Stack"
						subtitle="Jupyter Notebook, PostgreSQL, Metabase"
						icon={Database}
						onClick={() => handleTemplateSelect("dataScience")}
						disabled={loading}
					/>

					<TemplateLink
						title="Minimal Configuration"
						subtitle="Nginx, Volume, Network"
						icon={Settings}
						onClick={() => handleTemplateSelect("minimal")}
						disabled={loading}
					/>
				</div>
			</div>
		</div>
	);
}

function TemplateLink({
	title,
	subtitle,
	icon: Icon,
	onClick,
	className,
	disabled = false,
}: {
	title: string;
	subtitle: string;
	icon: LucideIcon;
	onClick: () => void;
	className?: string;
	disabled?: boolean;
}) {
	return (
		<button
			onClick={onClick}
			type={"button"}
			disabled={disabled}
			className={cn(
				"group w-full flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-primary/5 transition-all duration-200 cursor-pointer",
				"relative overflow-hidden",
				className,
			)}
		>
			<div className="p-2 bg-primary/10 rounded-md">
				<Icon className="h-5 w-5 text-primary" />
			</div>
			<div className="flex-1 text-left">
				<div className="font-medium">{title}</div>
				<div className="text-xs text-muted-foreground">{subtitle}</div>
			</div>
			<ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
		</button>
	);
}

function DockerSidebar({
	handleDocker,
	loading = false,
	className = "",
}: {
	handleDocker: (action: DockerAction) => Promise<boolean>;
	loading?: boolean;
	className?: string;
}) {
	// Custom hooks
	const { project } = useProject();

	// Custom methods
	const handleRemove = (
		name: string,
		type: "services" | "volumes" | "networks",
	) => {
		handleDocker({
			type: "docker-remove-type",
			name: name,
			elementType: type,
		});
	};

	return (
		<SmoothAnimate className={`${className}`}>
			{(project.docker.isStrict || project.variables.length > 0) && (
				<Accordion
					type="single"
					collapsible
					className={`rounded-lg bg-card overflow-hidden w-full ${project.docker.isStrict || project.variables.length > 0 ? "border" : ""}`}
				>
					<SmoothAnimate>
						{project.docker.isStrict && (
							<>
								<AccordionItem value="services">
									<AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors rounded-none cursor-pointer">
										<div className="flex items-center gap-2">
											<Server className="h-4 w-4 text-primary" />
											<SmoothAnimate className="text-sm font-medium flex items-center gap-2">
												<span>Services</span>
												{project.docker.parsed.services.length > 0 && (
													<span className="text-xs text-muted-foreground">
														({project.docker.parsed.services.length})
													</span>
												)}
											</SmoothAnimate>
										</div>
									</AccordionTrigger>
									<AccordionContent className="px-0 pt-0">
										<Separator className="mb-6" />
										<SmoothAnimate className="space-y-2 px-4 pb-2">
											{project.docker.parsed.services.map((service) => (
												<div
													key={service.name}
													className="relative flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors group"
												>
													<div>
														<div className="text-sm font-medium">{service.name}</div>
														{formatServiceImage(service.image)}
													</div>
													<Button
														type={"button"}
														variant={"ghost"}
														size={"icon"}
														disabled={loading}
														className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
														onClick={() => handleRemove(service.name, "services")}
													>
														<X className="h-2 w-2 text-primary" />
													</Button>
												</div>
											))}
											{project.docker.parsed.services.length === 0 && (
												<div className="text-sm text-muted-foreground px-4 py-2 bg-muted/50 border border-border/50 rounded-md">
													No services found
												</div>
											)}
										</SmoothAnimate>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem value="volumes">
									<AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors rounded-none cursor-pointer">
										<div className="flex items-center gap-2">
											<Database className="h-4 w-4 text-primary" />
											<SmoothAnimate className="text-sm font-medium flex items-center gap-2">
												<span>Volumes</span>
												{project.docker.parsed.volumes.length > 0 && (
													<span className="text-xs text-muted-foreground">
														({project.docker.parsed.volumes.length})
													</span>
												)}
											</SmoothAnimate>
										</div>
									</AccordionTrigger>
									<AccordionContent className="px-0 pt-0">
										<Separator className="mb-6" />
										<SmoothAnimate className="space-y-2 px-4 pb-2">
											{project.docker.parsed.volumes.map((volume) => (
												<div
													key={volume.name}
													className="relative flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors group"
												>
													<div>
														<div className="text-sm font-medium">{volume.name}</div>
														{formatDockerDriver(volume.driver)}
													</div>
													<Button
														type={"button"}
														variant={"ghost"}
														size={"icon"}
														disabled={loading}
														className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
														onClick={() => handleRemove(volume.name, "volumes")}
													>
														<X className="h-2 w-2 text-primary" />
													</Button>
												</div>
											))}
											{project.docker.parsed.volumes.length === 0 && (
												<div className="text-sm text-muted-foreground px-4 py-2 bg-muted/50 border border-border/50 rounded-md">
													No volumes found
												</div>
											)}
										</SmoothAnimate>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem value="networks">
									<AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors rounded-none cursor-pointer">
										<div className="flex items-center gap-2">
											<Network className="h-4 w-4 text-primary" />
											<SmoothAnimate className="text-sm font-medium flex items-center gap-2">
												<span>Networks</span>
												{project.docker.parsed.networks.length > 0 && (
													<span className="text-xs text-muted-foreground">
														({project.docker.parsed.networks.length})
													</span>
												)}
											</SmoothAnimate>
										</div>
									</AccordionTrigger>
									<AccordionContent className="px-0 pt-0">
										<Separator className="mb-6" />
										<SmoothAnimate className="space-y-2 px-4 pb-2">
											{project.docker.parsed.networks.map((network) => (
												<div
													key={network.name}
													className="relative flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors group"
												>
													<div>
														<div className="text-sm font-medium">{network.name}</div>
														{formatDockerDriver(network.driver, network.customName)}
													</div>
													<Button
														type={"button"}
														variant={"ghost"}
														size={"icon"}
														disabled={loading}
														className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
														onClick={() => handleRemove(network.name, "networks")}
													>
														<X className="h-2 w-2 text-primary" />
													</Button>
												</div>
											))}
											{project.docker.parsed.networks.length === 0 && (
												<div className="text-sm text-muted-foreground px-4 py-2 bg-muted/50 border border-border/50 rounded-md">
													No networks found
												</div>
											)}
										</SmoothAnimate>
									</AccordionContent>
								</AccordionItem>
							</>
						)}

						{project.variables.length > 0 && (
							<AccordionItem value="variables">
								<AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors rounded-none cursor-pointer">
									<div className="flex items-center gap-2">
										<FileLock className="h-4 w-4 text-primary" />
										<SmoothAnimate className="text-sm font-medium flex items-center gap-2">
											<span>Variables available</span>
										</SmoothAnimate>
									</div>
								</AccordionTrigger>
								<AccordionContent className="pt-0 px-0">
									<Separator className="mb-4" />
									<SmoothAnimate className="px-4 pb-0	flex flex-wrap gap-2">
										{project.variables.map((variable) => (
											<div
												key={variable.key}
												className="text-xs flex items-center justify-center px-2 py-1 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors"
											>
												{variable.key}
											</div>
										))}
									</SmoothAnimate>
								</AccordionContent>
							</AccordionItem>
						)}
					</SmoothAnimate>
				</Accordion>
			)}

			{project.variables.length > 0 && (
				<div
					className={` w-full flex flex-col ${project.docker.isStrict ? "gap-4" : ""}`}
				>
					<div className="text-sm text-muted-foreground px-4 py-3 bg-card border rounded-md">
						<div className="flex items-start gap-3">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Info className="h-4 w-4 text-primary" />
									<p className="font-medium text-foreground">Variables usage</p>
								</div>
								<p>Variables are defined in a docker-compose.yml file like this:</p>
								<code className="block px-3 py-2 bg-background/50 rounded-md border border-border/50 text-center">
									$&#123;VARIABLE_NAME&#125;
								</code>
							</div>
						</div>
					</div>
				</div>
			)}

			{project.docker.isStrict && project.variables.length > 0 && (
				<div className="text-sm text-muted-foreground px-4 py-3 bg-card border rounded-md w-full">
					<div className="flex items-start gap-3">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<FileKey className="h-4 w-4 text-primary" />
								<p className="font-medium text-foreground">Environment file</p>
							</div>
							<p>
								Even if the line is deleted, all services will be associated with an .env file containing all
								variables.
							</p>
						</div>
					</div>
				</div>
			)}

			{project.docker.isStrict == false && (
				<div className="text-sm text-muted-foreground px-4 py-3 bg-card border rounded-md w-full">
					<div className="flex items-start gap-3">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<OctagonMinus className="h-4 w-4 text-primary" />
								<p className="font-medium text-foreground">Strict mode disabled</p>
							</div>
							<p>
								Activating strict mode applies comprehensive validations to the format
								and to all services, volumes, and networks.
							</p>
						</div>
					</div>
				</div>
			)}
		</SmoothAnimate>
	);
}

function DockerContent({
	handleDocker,
	loading = false,
	className = "",
}: {
	handleDocker: (action: DockerAction) => Promise<boolean>;
	loading?: boolean;
	className?: string;
}) {
	// Custom hooks
	const { project } = useProject();
	const { setCurrentValue } = useTabsContext();

	return (
		<div className={`${className}`}>
			<div className="rounded-lg border bg-card">
				<div className="border-b">
					<div className="flex items-center justify-between px-4 py-3">
						<div className="flex items-center gap-2">
							<div className="w-7 h-7  rounded-md flex items-center justify-center">
								<File className="h-4 w-4 text-muted-foreground" />
							</div>
							<span className="text-sm font-medium mr-2">docker-compose.yaml</span>
							{project.docker.isSaved ? (
								<Badge variant="default" className="text-xs ">
									<Check className="h-4 w-4" />
									Saved
								</Badge>
							) : (
								<Badge variant="secondary" className="text-xs ">
									<X className="h-4 w-4 text-muted-foreground" />
									Not saved
								</Badge>
							)}
						</div>

						<div className="flex items-center gap-2">
							{/* Actions in a dropdown */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant={"outline"}
										size="icon"
										type="button"
										className="h-8 px-2"
										disabled={loading}
									>
										<Ellipsis className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="">
									{project.isCreated && (
										<>
											<DockerDropdownFileUpload handleDocker={handleDocker} />
											<DropdownMenuSeparator />
										</>
									)}

									<DropdownMenuGroup>
										<DropdownMenuItem
											onClick={async () => {
												await handleDocker({ type: "docker-save" });
											}}
											className="flex items-center gap-2"
											disabled={project.docker.isSaved}
										>
											<Save className="h-4 w-4" />
											<span>Save</span>
										</DropdownMenuItem>

										<DropdownMenuItem
											onClick={() => handleDocker({ type: "docker-copy" })}
											className="flex items-center gap-2"
										>
											<Copy className="h-4 w-4" />
											<span>Copy</span>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handleDocker({ type: "docker-clear" })}
											className="flex items-center gap-2"
											disabled={project.docker.isStrict}
										>
											<Eraser className="h-4 w-4" />
											<span>Clear</span>
										</DropdownMenuItem>
										{!project.isCreated && (
											<DropdownMenuItem
												onClick={() => {
													handleDocker({ type: "docker-reset" });
													if (!project.isCreated) {
														setCurrentValue("empty");
													}
												}}
												className="flex items-center gap-2"
											>
												<RefreshCcw className="h-4 w-4" />
												<span>Reset</span>
											</DropdownMenuItem>
										)}
									</DropdownMenuGroup>

									<DropdownMenuSeparator />
									<div className="p-2">
										<div className="flex items-center justify-between gap-8">
											<div className="flex flex-col gap-1">
												<Label
													htmlFor="strict-mode-dropdown"
													className="text-xs font-medium"
												>
													Strict Mode
												</Label>
												<p className="text-xs text-muted-foreground">Enable validations</p>
											</div>
											<Switch
												id="strict-mode-dropdown"
												className="cursor-pointer"
												checked={project.docker.isStrict}
												onCheckedChange={() =>
													handleDocker({ type: "docker-strict-toggle" })
												}
											/>
										</div>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>

				<SmoothAnimate>
					<CodeEditor
						value={project.docker.content}
						disabled={loading}
						onChange={(content) => handleDocker({ type: "docker-un-save", content })}
						onSave={() => handleDocker({ type: "docker-save" })}
						isSaved={project.docker.isSaved}
						language="yaml"
						customVariables={project.variables.map((variable) => ({
							label: variable.key,
							type: "variable",
							detail: variable.value,
						}))}
						keywords={DOCKER_COMPOSE_KEYWORDS}
						className="!rounded-t-none rounded-b-lg  border-0"
					/>
				</SmoothAnimate>
			</div>
		</div>
	);
}

export function DockerConfiguration({
	handleDocker,
	loading = false,
}: {
	handleDocker: (action: DockerAction) => Promise<boolean>;
	loading?: boolean;
}) {
	return (
		<div className="grid gap-4 relative">
			<div className="grid grid-cols-12 gap-4 relative items-start">
				<DockerContent
					handleDocker={handleDocker}
					loading={loading}
					className="col-span-9"
				/>
				<DockerSidebar
					handleDocker={handleDocker}
					loading={loading}
					className="!sticky top-[4rem] self-start col-span-3 flex flex-col gap-4 items-center"
				/>
			</div>
		</div>
	);
}

function DockerDropdownFileUpload({
	handleDocker,
}: {
	handleDocker: (action: DockerAction) => Promise<boolean>;
}) {
	const { project } = useProject();

	const DockerComposeForm = useForm<z.infer<typeof DockerComposeFileSchema>>({
		resolver: zodResolver(DockerComposeFileSchema),
		mode: "onChange",
		defaultValues: {
			file: undefined,
		},
	});

	const handleFileUpload = async (file: File) => {
		try {
			// Update form field
			DockerComposeForm.setValue("file", file, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});

			// Validate file
			const result = await DockerComposeForm.trigger("file");
			if (!result) {
				const errors = DockerComposeForm.formState.errors;
				if (errors.file) {
					console.error("Form validation errors:", errors.file);
					toast.error("An error occured", { description: errors.file.message as string });
				}
				return;
			}

			// Read file content
			const content = await file.text();

			// Parse and validate content
			const variable_length = project.variables.length;
			const parsed = parseDockerCompose(
				content,
				project.docker.isStrict,
				variable_length,
			);
			if (parsed.isValid && parsed.updatedContent) {
				const newState = {
					content: parsed.updatedContent,
					isSaved: true,
					isStrict: false,
					parsed: {
						services: parsed.services,
						volumes: parsed.volumes,
						networks: parsed.networks,
					},
				};

				// setCurrentValue("docker");

				handleDocker({ type: "docker-create", docker: newState });
			}
		} catch (error) {
			console.error("Error uploading file:", error);
			toast.error("An error occured", { description: "An error occurred while importing the file" });
		}
	};

	const dropdownButton = useRef<HTMLButtonElement>(null);

	return (
		<Form {...DockerComposeForm}>
			<FormField
				control={DockerComposeForm.control}
				name="file"
				render={({ field }) => {
					const { value, ...rest } = field;

					return (
						<FormItem>
							<Button
								className="flex items-start flex-col gap-0 relative py-0 px-2 rounded-sm h-auto hover:!bg-accent"
								variant={"ghost"}
							>
								<FormLabel htmlFor="file" className="w-full h-full py-2 cursor-pointer">
									<Upload className="h-4 w-4 text-muted-foreground" />
									<span>Import file</span>
								</FormLabel>

								<FormControl>
									<Input
										id="file"
										type="file"
										accept=".yml,.yaml"
										className="hidden absolute top-0 left-0 right-0 bottom-0"
										onClick={(e) => {
											(e.target as HTMLInputElement).value = "";
										}}
										onChange={async (e) => {
											const file = e.target.files?.[0] ?? null;
											if (file) {
												await handleFileUpload(file);
											}
										}}
									/>
								</FormControl>

								<FormMessage />
							</Button>
						</FormItem>
					);
				}}
			/>
		</Form>
	);
}
