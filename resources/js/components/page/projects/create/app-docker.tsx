// Necessary imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import yaml from "js-yaml";
import { useProject } from "@/contexts/project-context";

// Libs
import { DOCKER_COMPOSE_KEYWORDS } from "@/lib/docker/keywords";
import { parseDockerCompose } from "@/lib/docker/parser";
import { formatServiceImage, formatDockerDriver } from "@/lib/docker/formatter";
import { DOCKER_TEMPLATES } from "@/lib/docker/templates";

// Types
import { type DockerCompose, DockerComposeFileSchema } from "@/lib/docker/type";

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
	ArrowLeft,
	Check,
	FileLock,
	Info,
	LucideIcon,
	Save,
	X,
	Menu,
	OctagonMinus,
	FileKey,
	Trash,
} from "lucide-react";

export function AppDocker() {
	const { project, updateProject } = useProject();

	const [state, setState] = useState<DockerCompose>(project.docker);

	// Synchroniser l'état avec le contexte du projet
	useEffect(() => {
		if (project.docker.content && project.docker.content !== state.content) {
			setState({
				content: project.docker.content,
				isSaved: project.docker.isSaved,
				isStrict: project.docker.isStrict,
				parsed: project.docker.parsed,
			});
		}
	}, [project.docker]);

	// Synchroniser le contexte avec l'état
	useEffect(() => {
		// Ne mettre à jour que si le contenu a réellement changé
		if (state.content && state.content !== project.docker.content) {
			updateProject("docker", {
				...state,
				isSaved: false,
			});
		}
	}, [state.content, updateProject, project.docker.content]);

	return (
		<Tabs defaultValue={project.docker.content ? "docker" : "empty"}>
			<TabsList className="hidden">
				<TabsTrigger value="empty">Empty</TabsTrigger>
				<TabsTrigger value="docker">Docker</TabsTrigger>
			</TabsList>
			<TabsBody>
				<TabsContent value="empty">
					<EmptyDockerState state={state} setState={setState} />
				</TabsContent>
				<TabsContent value="docker">
					<DockerConfiguration state={state} setState={setState} />
				</TabsContent>
			</TabsBody>
		</Tabs>
	);
}

function EmptyDockerState({
	state,
	setState,
}: {
	state: DockerCompose;
	setState: React.Dispatch<React.SetStateAction<DockerCompose>>;
}) {
	const { setCurrentValue } = useTabsContext();
	const [isDragActive, setIsDragActive] = useState(false);
	const inputFileRef = useRef<HTMLInputElement>(null);
	const { project, updateProject } = useProject();

	const DockerComposeForm = useForm<z.infer<typeof DockerComposeFileSchema>>({
		resolver: zodResolver(DockerComposeFileSchema),
		mode: "onChange",
		defaultValues: {
			file: undefined,
		},
	});

	const handleTemplateSelect = (templateKey: keyof typeof DOCKER_TEMPLATES) => {
		const templateContent = DOCKER_TEMPLATES[templateKey];
		const variable_length = project.variables.length;
		const parsed = parseDockerCompose(
			templateContent,
			state.isStrict,
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

			setState(newState);

			setCurrentValue("docker");

			updateProject("docker", newState);
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
					toast.error(errors.file.message as string);
				}
				return;
			}

			// Read file content
			const content = await file.text();
			console.log("File content:", content);

			// Parse and validate content
			const variable_length = project.variables.length;
			const parsed = parseDockerCompose(content, state.isStrict, variable_length);
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

				setState(newState);

				setCurrentValue("docker");

				updateProject("docker", newState);
			}
		} catch (error) {
			console.error("Error uploading file:", error);
			toast.error("An error occurred while importing the file");
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
													toast.error("No file was dropped");
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
													variant="outline"
													size="sm"
													onClick={() => inputFileRef.current?.click()}
													type="button"
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
						dockerCompose={DOCKER_TEMPLATES.webApp}
					/>

					<TemplateLink
						title="Data Science Stack"
						subtitle="Jupyter Notebook, PostgreSQL, Metabase"
						icon={Database}
						onClick={() => handleTemplateSelect("dataScience")}
						dockerCompose={DOCKER_TEMPLATES.dataScience}
					/>

					<TemplateLink
						title="Minimal Configuration"
						subtitle="Nginx, Volume, Network"
						icon={Settings}
						onClick={() => handleTemplateSelect("minimal")}
						dockerCompose={DOCKER_TEMPLATES.minimal}
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
	dockerCompose,
	className,
}: {
	title: string;
	subtitle: string;
	icon: LucideIcon;
	onClick: () => void;
	dockerCompose: string;
	className?: string;
}) {
	return (
		<button
			onClick={onClick}
			type="button"
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
	state,
	setState,
	setCurrentValue,
}: {
	state: DockerCompose;
	setState: React.Dispatch<React.SetStateAction<DockerCompose>>;
	setCurrentValue: (value: string) => void;
}) {
	const { project, updateProject } = useProject();

	const handleRemove = (
		name: string,
		type: "services" | "volumes" | "networks",
	) => {
		const content = yaml.load(state.content) as Record<string, any>;
		if (!content) return;

		const newContent = yaml.dump({
			...content,
			[type]: Object.fromEntries(
				Object.entries(content[type] || {}).filter(([key]) => key !== name),
			),
		});

		const variable_length = project.variables.length;
		const parsed = parseDockerCompose(
			newContent,
			state.isStrict,
			variable_length,
		);
		if (parsed.isValid) {
			setState({
				content: newContent,
				isSaved: false,
				isStrict: false,
				parsed: {
					services: parsed.services,
					volumes: parsed.volumes,
					networks: parsed.networks,
				},
			});
			updateProject("docker", {
				content: newContent,
				isSaved: false,
				isStrict: false,
				parsed: {
					services: parsed.services,
					volumes: parsed.volumes,
					networks: parsed.networks,
				},
			});
		}
	};

	const handleReset = () => {
		const newState = {
			content: "",
			isSaved: true,
			isStrict: false,
			parsed: { services: [], volumes: [], networks: [] },
		};

		setState(newState);
		setCurrentValue("empty");
		updateProject("docker", newState);
	};

	return (
		<SmoothAnimate
			className="col-span-4 flex flex-col gap-4"
		>
			{(state.isStrict || project.variables.length > 0) && (
				<Accordion
					type="single"
					collapsible
					className={`rounded-lg bg-card overflow-hidden ${state.isStrict || project.variables.length > 0 ? "border" : ""}`}
				>
					<SmoothAnimate>
						{state.isStrict && (
							<>
								<AccordionItem value="services">
									<AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors rounded-none cursor-pointer">
										<div className="flex items-center gap-2">
											<Server className="h-4 w-4 text-primary" />
											<SmoothAnimate className="text-sm font-medium flex items-center gap-2">
												<span>Services</span>
												{state.parsed.services.length > 0 && (
													<span className="text-xs text-muted-foreground">
														({state.parsed.services.length})
													</span>
												)}
											</SmoothAnimate>
										</div>
									</AccordionTrigger>
									<AccordionContent className="px-0 pt-0">
										<Separator className="mb-6" />
										<SmoothAnimate className="space-y-2 px-4 pb-2">
											{state.parsed.services.map((service) => (
												<div
													key={service.name}
													className="relative flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors group"
												>
													<div>
														<div className="text-sm font-medium">{service.name}</div>
														{formatServiceImage(service.image)}
													</div>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
														onClick={() => handleRemove(service.name, "services")}
													>
														<X className="h-2 w-2 text-primary" />
													</Button>
												</div>
											))}
											{state.parsed.services.length === 0 && (
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
												{state.parsed.volumes.length > 0 && (
													<span className="text-xs text-muted-foreground">
														({state.parsed.volumes.length})
													</span>
												)}
											</SmoothAnimate>
										</div>
									</AccordionTrigger>
									<AccordionContent className="px-0 pt-0">
										<Separator className="mb-6" />
										<SmoothAnimate className="space-y-2 px-4 pb-2">
											{state.parsed.volumes.map((volume) => (
												<div
													key={volume.name}
													className="relative flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors group"
												>
													<div>
														<div className="text-sm font-medium">{volume.name}</div>
														{formatDockerDriver(volume.driver)}
													</div>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
														onClick={() => handleRemove(volume.name, "volumes")}
													>
														<X className="h-2 w-2 text-primary" />
													</Button>
												</div>
											))}
											{state.parsed.volumes.length === 0 && (
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
												{state.parsed.networks.length > 0 && (
													<span className="text-xs text-muted-foreground">
														({state.parsed.networks.length})
													</span>
												)}
											</SmoothAnimate>
										</div>
									</AccordionTrigger>
									<AccordionContent className="px-0 pt-0">
										<Separator className="mb-6" />
										<SmoothAnimate className="space-y-2 px-4 pb-2">
											{state.parsed.networks.map((network) => (
												<div
													key={network.name}
													className="relative flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors group"
												>
													<div>
														<div className="text-sm font-medium">{network.name}</div>
														{formatDockerDriver(network.driver, network.customName)}
													</div>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
														onClick={() => handleRemove(network.name, "networks")}
													>
														<X className="h-2 w-2 text-primary" />
													</Button>
												</div>
											))}
											{state.parsed.networks.length === 0 && (
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
								<AccordionContent className="px-0 pt-0">
									<Separator className="mb-6" />
									<SmoothAnimate className="px-4 pb-2 flex flex-wrap gap-2">
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
				<div className={`flex flex-col ${state.isStrict ? "gap-4" : ""}`}>
					<div className="text-sm text-muted-foreground px-4 py-3 bg-muted/50 border border-border/50 rounded-md">
						<div className="flex items-start gap-3">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Info className="h-4 w-4 text-primary" />
									<p className="font-medium text-foreground">Variables usage</p>
								</div>
								<p>Variables are defined in a docker-compose.yml file like this:</p>
								<code className="block px-3 py-2 bg-background rounded-md border border-border/50 text-center">
									$&#123;VARIABLE_NAME&#125;
								</code>
							</div>
						</div>
					</div>
				</div>
			)}

			{state.isStrict && project.variables.length > 0 && (
				<div className="text-sm text-muted-foreground px-4 py-3 bg-muted/50 border border-border/50 rounded-md">
					<div className="flex items-start gap-3">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<FileKey className="h-4 w-4 text-primary" />
								<p className="font-medium text-foreground">Environment file</p>
							</div>
							<p>
								Even if deleted, all services will have a .env file containing all
								variables associated with them.
							</p>
						</div>
					</div>
				</div>
			)}

			{state.isStrict == false && (
				<div className="text-sm text-muted-foreground px-4 py-3 bg-muted/50 border border-border/50 rounded-md">
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

			<Button
				type="button"
				variant="outline"
				className="w-full"
				onClick={handleReset}
			>
				<ArrowLeft className="h-4 w-4" />
				Reset
			</Button>
		</SmoothAnimate>
	);
}

function DockerContent({
	state,
	setState,
}: {
	state: DockerCompose;
	setState: React.Dispatch<React.SetStateAction<DockerCompose>>;
}) {
	const [isSaving, setIsSaving] = useState(false);
	const [isCopying, setIsCopying] = useState(false);

	const { project, updateProject } = useProject();

	const handleDockerComposeChange = (content: string) => {
		setState((prev: DockerCompose) => ({
			...prev,
			content,
			isSaved: false,
		}));
	};

	const handleSave = () => {
		setIsSaving(true);

		// Validation stricte au moment de la sauvegarde
		const variable_length = project.variables.length;
		const parsed = parseDockerCompose(
			state.content,
			state.isStrict,
			variable_length,
		);
		if (parsed.isValid && parsed.updatedContent) {
			const newState = {
				content: parsed.updatedContent,
				isSaved: true,
				isStrict: state.isStrict,
				parsed: {
					services: parsed.services,
					volumes: parsed.volumes,
					networks: parsed.networks,
				},
			};
			setState(newState);
			updateProject("docker", newState); // Synchroniser avec l'état global
			toast.success("Docker-compose.yml file saved");
		}

		setIsSaving(false);
	};

	const handleClear = () => {
		const updatedContent = yaml.dump({
			services: {},
			volumes: {},
			networks: {},
		});
		const variable_length = project.variables.length;
		const parsed = parseDockerCompose(
			updatedContent,
			state.isStrict,
			variable_length,
		);

		if (!parsed.isValid) {
			toast.error(
				"Failed to clear Docker-compose.yml file due to validation errors",
			);
			return;
		}
		// Mettre à jour l'état avec le contenu vide

		const newState: DockerCompose = {
			content: updatedContent,
			isSaved: true,
			isStrict: state.isStrict,
			parsed: { services: [], volumes: [], networks: [] },
		};
		setState(newState);
		updateProject("docker", newState);

		toast.success("Docker-compose.yml file cleared");
	};

	const handleCopy = () => {
		setIsCopying(true);
		navigator.clipboard.writeText(state.content);
		setIsCopying(false);
		toast.success("Docker-compose.yml file copied to clipboard");
	};

	const handleStrictToggle = () => {
		setState((prev: DockerCompose) => ({
			...prev,
			isStrict: !prev.isStrict,
			isSaved: false,
		}));

		updateProject("docker", {
			...state,
			isStrict: !state.isStrict,
			isSaved: false,
		});
	};

	return (
		<div className="col-span-8">
			<div className="rounded-lg border">
				<div className="border-b">
					<div className="flex items-center justify-between px-4 py-3">
						<div className="flex items-center gap-2">
							<div className="w-7 h-7  rounded-md flex items-center justify-center">
								<File className="h-4 w-4 text-muted-foreground" />
							</div>
							<span className="text-sm font-medium">Docker Compose</span>
							{state.isSaved ? (
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
									<Button variant="outline" size="sm" type="button" className="h-8 px-2">
										<Menu className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="">
									<DropdownMenuItem
										onClick={handleSave}
										className="flex items-center gap-2"
										disabled={state.isSaved || isSaving}
									>
										<Save className="h-4 w-4" />
										<span>Save</span>
										{state.isSaved && <Check className="h-3 w-3 ml-auto text-primary" />}
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleCopy}
										className="flex items-center gap-2"
									>
										<Copy className="h-4 w-4" />
										<span>Copy</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={handleClear}
										className="flex items-center gap-2"
									>
										<Trash className="h-4 w-4" />
										<span>Clear</span>
									</DropdownMenuItem>

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
												checked={state.isStrict}
												onCheckedChange={handleStrictToggle}
											/>
										</div>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>

				<SmoothAnimate className="p-4">
					<CodeEditor
						value={state.content}
						onChange={handleDockerComposeChange}
						onSave={handleSave}
						isSaved={state.isSaved}
						language="yaml"
						customVariables={project.variables.map((variable) => ({
							label: variable.key,
							type: "variable",
							detail: variable.value,
						}))}
						keywords={DOCKER_COMPOSE_KEYWORDS}
					/>
				</SmoothAnimate>
			</div>
		</div>
	);
}

function DockerConfiguration({
	state,
	setState,
}: {
	state: DockerCompose;
	setState: React.Dispatch<React.SetStateAction<DockerCompose>>;
}) {
	const { setCurrentValue } = useTabsContext();

	return (
		<div className="grid gap-4">
			<div className="grid grid-cols-12 gap-4">
				<DockerSidebar
					state={state}
					setState={setState}
					setCurrentValue={setCurrentValue}
				/>
				<DockerContent state={state} setState={setState} />
			</div>
		</div>
	);
}
