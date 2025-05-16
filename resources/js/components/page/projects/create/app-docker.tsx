// Necessary imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FileLock, LucideIcon, Save, X } from "lucide-react";
import { useTabsContext } from "@/components/ui/tabs";
import { type DockerComposeState, DockerComposeFileSchema } from "@/types/models/docker";
import { parseDockerCompose } from "@/lib/docker/parser";
import { formatServiceImage, formatDockerDriver } from "@/lib/docker/formatter";
import yaml from "js-yaml";

// Custom components
import {
	SmoothAnimate,
	SmoothItem,
	SmoothResize,
} from "@/components/ui/smooth-resized";

// Shadcn UI components
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { CodeBlock } from "@/components/ui/code-editor";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
	Download,
	Server,
	Database,
	Network,
	Settings,
	List,
	FileText,
	Play,
	ChevronRight,
	FileUp,
	FileCode,
	FileJson,
	ArrowRight,
	File,
	ArrowLeft,
} from "lucide-react";

// Types
import {
	type DockerAction,
	type DockerService,
	type DockerVolume,
	type DockerNetwork,
} from "@/types/models/docker";

import {
	DOCKER_TEMPLATES,
	DOCKER_COMPOSE_PLACEHOLDER
} from "@/lib/docker/templates";
import { useProject } from "@/contexts/project-context";


export function AppDocker() {
	const { project, updateProject } = useProject();

	const [state, setState] = useState<DockerComposeState>(project.docker);


	// Synchroniser l'état avec le contexte du projet
	useEffect(() => {
		if (project.docker.content && project.docker.content !== state.content) {
			setState({
				content: project.docker.content,
				isSaved: project.docker.isSaved,
				parsed: project.docker.parsed
			});
		}
	}, [project.docker]);

	// Synchroniser le contexte avec l'état
	useEffect(() => {
		if (state.content && state.content !== project.docker.content) {
			updateProject("docker", state);
		}
	}, [state, updateProject]);

	return (
		<Tabs 
			defaultValue={project.docker.content ? "docker" : "empty"}
		>
			<TabsList className="hidden">
				<TabsTrigger value="empty">Empty</TabsTrigger>
				<TabsTrigger value="docker">Docker</TabsTrigger>
			</TabsList>
			<TabsBody>
				<TabsContent value="empty">
					<EmptyDockerState 
						state={state}
						setState={setState}
					/>
				</TabsContent>
				<TabsContent value="docker">
					<DockerConfiguration 
						state={state}
						setState={setState}
					/>
				</TabsContent>
			</TabsBody>
		</Tabs>
	);
}

function EmptyDockerState({
	state,
	setState,
}: {
	state: DockerComposeState;
	setState: React.Dispatch<React.SetStateAction<DockerComposeState>>;
}) {
	const { setCurrentValue } = useTabsContext();
	const [isDragActive, setIsDragActive] = useState(false);
	const inputFileRef = useRef<HTMLInputElement>(null);

	const DockerComposeForm = useForm<z.infer<typeof DockerComposeFileSchema>>({
		resolver: zodResolver(DockerComposeFileSchema),
		mode: "onChange",
		defaultValues: {
			file: undefined
		}
	});

	const handleTemplateSelect = (templateKey: keyof typeof DOCKER_TEMPLATES) => {
		const templateContent = DOCKER_TEMPLATES[templateKey];
		// console.log('Template content:', templateKey, templateContent);
		const parsed = parseDockerCompose(templateContent);
		if (parsed.isValid) {
			setState({
				content: templateContent,
				isSaved: true,
				parsed: {
					services: parsed.services,
					volumes: parsed.volumes,
					networks: parsed.networks
				}
			});
			setCurrentValue("docker");
		}
	};

	const handleFileUpload = async (file: File) => {
		try {
			// Update form field
			DockerComposeForm.setValue("file", file, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true
			});
			
			// Validate file
			const result = await DockerComposeForm.trigger("file");
			if (!result) {
				const errors = DockerComposeForm.formState.errors;
				if (errors.file) {
					console.error('Form validation errors:', errors.file);
					toast.error(errors.file.message as string);
				}
				return;
			}
			
			// Read file content
			const content = await file.text();
			console.log('File content:', content);
			
			// Parse and validate content
			const parsed = parseDockerCompose(content);
			if (parsed.isValid) {
				setState({
					content,
					isSaved: true,
					parsed: {
						services: parsed.services,
						volumes: parsed.volumes,
						networks: parsed.networks
					}
				});
				setCurrentValue("docker");
			}
		} catch (error) {
			console.error('Error uploading file:', error);
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

interface TemplateLinkProps {
	title: string;
	subtitle: string;
	icon: LucideIcon;
	onClick: () => void;
	dockerCompose: string;
	className?: string;
}

function TemplateLink({
	title,
	subtitle,
	icon: Icon,
	onClick,
	dockerCompose,
	className
}: TemplateLinkProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"group w-full flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-primary/5 transition-all duration-200 cursor-pointer",
				"relative overflow-hidden",
				className
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
	setCurrentValue
}: {
	state: DockerComposeState;
	setState: React.Dispatch<React.SetStateAction<DockerComposeState>>;
	setCurrentValue: (value: string) => void;
}) {
	const { project, updateProject } = useProject();

	const handleRemove = (name: string, type: 'services' | 'volumes' | 'networks') => {
		const content = yaml.load(state.content) as Record<string, any>;
		if (!content) return;

		const newContent = yaml.dump({
			...content,
			[type]: Object.fromEntries(
				Object.entries(content[type] || {})
					.filter(([key]) => key !== name)
			)
		});
		
		const parsed = parseDockerCompose(newContent);
		if (parsed.isValid) {
			setState({
				content: newContent,
				isSaved: false,
				parsed: {
					services: parsed.services,
					volumes: parsed.volumes,
					networks: parsed.networks
				}
			});
			updateProject("docker", {
				content: newContent,
				isSaved: false,
				parsed: {
					services: parsed.services,
					volumes: parsed.volumes,
					networks: parsed.networks
				}
			});
		}
	};

	const handleReset = () => {
		const newState = {
			content: "",
			isSaved: true,
			parsed: { services: [], volumes: [], networks: [] }
		};

		setState(newState);
		setCurrentValue("empty");
		updateProject("docker", newState);
	};
	
	return (
		<div className="col-span-1 flex flex-col gap-4">
			<div className="rounded-lg border bg-card overflow-hidden">
				<Accordion type="single" collapsible>
					<AccordionItem value="services">
						<AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors rounded-none cursor-pointer">
							<div className="flex items-center gap-2">
								<Server className="h-4 w-4 text-primary" />
								<SmoothAnimate className="text-sm font-medium flex items-center gap-2">
									<span>Services</span> 
									{ state.parsed.services.length > 0 && (
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
								{state.parsed.services.map(service => (
									<div key={service.name} className="relative flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors group">
										<div>
											<div className="text-sm font-medium">{service.name}</div>
											{formatServiceImage(service.image)}
										</div>
										<Button 
											variant="ghost" 
											size="icon" 
											className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
											onClick={() => handleRemove(service.name, 'services')}
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
									{ state.parsed.volumes.length > 0 && (
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
								{state.parsed.volumes.map(volume => (
									<div key={volume.name} className="relative flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors group">
										<div>
											<div className="text-sm font-medium">{volume.name}</div>
											{formatDockerDriver(volume.driver)}
										</div>
										<Button 
											variant="ghost" 
											size="icon" 
											className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
											onClick={() => handleRemove(volume.name, 'volumes')}
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
								{state.parsed.networks.map(network => (
									<div key={network.name} className="relative flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors group">
										<div>
											<div className="text-sm font-medium">{network.name}</div>
											{formatDockerDriver(network.driver, network.customName)}
										</div>
										<Button 
											variant="ghost" 
											size="icon" 
											className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
											onClick={() => handleRemove(network.name, 'networks')}
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
									<SmoothAnimate className="space-y-2 px-4 pb-2 flex flex-wrap gap-2">
										{project.variables.map(variable => (
											<div key={variable.key} className="text-xs flex items-center justify-center px-2 py-1 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors">
													{variable.key}
											</div>
										))}
									</SmoothAnimate>
							</AccordionContent>
						</AccordionItem>
					)}

				</Accordion>
			</div>
			<Button variant="outline" className="w-full" onClick={handleReset}>
				<ArrowLeft className="h-4 w-4" />
				Reset
			</Button>
		</div>
	);
}

function DockerContent({
	state,
	setState
}: {
	state: DockerComposeState;
	setState: React.Dispatch<React.SetStateAction<DockerComposeState>>;
}) {
	const [isSaving, setIsSaving] = useState(false);
	const [isCopying, setIsCopying] = useState(false);

	const handleDockerComposeChange = (content: string) => {
		setState((prev: DockerComposeState) => ({
			...prev,
			content,
			isSaved: false
		}));
	};

	const handleSave = () => {
		setIsSaving(true);

		// Validation stricte au moment de la sauvegarde
		const parsed = parseDockerCompose(state.content);
		if (parsed.isValid) {
			setState({
				content: state.content,
				isSaved: true,
				parsed: {
					services: parsed.services,
					volumes: parsed.volumes,
					networks: parsed.networks
				}
			});
			toast.success("Docker-compose.yml file saved");
		} else {
			// toast.error("The docker-compose file is not valid. Check the structure and required fields.");
		}

		setIsSaving(false);
	};

	const handleCopy = () => {
		setIsCopying(true);
		navigator.clipboard.writeText(state.content);
		setIsCopying(false);
		toast.success("Docker-compose.yml file copied to clipboard");
	};

	return (
		<div className="col-span-3">
			<div className="rounded-lg border">
				<div className="border-b p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Badge variant="secondary" className="text-xs">
								{state.isSaved ? "Saved" : "Not saved"}
							</Badge>
							<h3 className="text-sm font-medium flex items-center gap-2">
								<File className="h-4 w-4 text-muted-foreground" />
								Docker Compose
							</h3>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" disabled={state.isSaved || isSaving} onClick={() => handleSave()}>
								{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
								Save
							</Button>

							<Button variant="outline" size="sm" disabled={isCopying} onClick={() => handleCopy()}>
								{isCopying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
								Copy
							</Button>
						</div>
					</div>
				</div>
				<div className="p-4">
					<Textarea
						value={state.content}
						onChange={(e) => handleDockerComposeChange(e.target.value)}
						className="min-h-[400px] font-mono text-sm"
						placeholder={DOCKER_COMPOSE_PLACEHOLDER}
					/>
				</div>
			</div>
		</div>
	);
}

function DockerConfiguration({
	state,
	setState,
}: {
	state: DockerComposeState;
	setState: React.Dispatch<React.SetStateAction<DockerComposeState>>;
}) {
	const { setCurrentValue } = useTabsContext();

	return (
		<div className="grid gap-4">
			<div className="grid grid-cols-4 gap-4">
				<DockerSidebar state={state} setState={setState} setCurrentValue={setCurrentValue} />
				<DockerContent state={state} setState={setState} />
			</div>
		</div>
	);
}
