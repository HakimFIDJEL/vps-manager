// Necessary imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

export function AppDocker() {
	const [hasComposeFile, setHasComposeFile] = useState<boolean>(false);

	const emptyRef = useRef<HTMLButtonElement>(null);
	const dockerRef = useRef<HTMLButtonElement>(null);

	return (
		<Tabs defaultValue="empty">
			<TabsList className="">
				<TabsTrigger value="empty" ref={emptyRef}>
					Empty
				</TabsTrigger>
				<TabsTrigger value="docker" ref={dockerRef}>
					Docker
				</TabsTrigger>
			</TabsList>
			<TabsBody>
				<TabsContent value="empty">
					<EmptyDockerState 
						emptyRef={emptyRef}
						dockerRef={dockerRef}
					/>
				</TabsContent>
				<TabsContent value="docker">
					<DockerConfiguration 
						emptyRef={emptyRef}
						dockerRef={dockerRef}
					/>
				</TabsContent>
			</TabsBody>
		</Tabs>
	);
}

function QuickActions() {
	return (
		<div className="grid grid-cols-3 gap-4">
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="outline"
						className="w-full justify-start gap-2 h-auto py-2"
					>
						<div className="p-1.5 bg-primary/10 rounded-md">
							<Server className="h-4 w-4 text-primary" />
						</div>
						<div className="flex-1 text-left">
							<div className="font-medium text-sm">Services</div>
							<div className="text-xs text-muted-foreground">Configure services</div>
						</div>
						<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Create Service</AlertDialogTitle>
						<AlertDialogDescription>
							Configure a new Docker service
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter></AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="outline"
						className="w-full justify-start gap-2 h-auto py-2"
					>
						<div className="p-1.5 bg-primary/10 rounded-md">
							<Database className="h-4 w-4 text-primary" />
						</div>
						<div className="flex-1 text-left">
							<div className="font-medium text-sm">Volumes</div>
							<div className="text-xs text-muted-foreground">Manage volumes</div>
						</div>
						<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Create Volume</AlertDialogTitle>
						<AlertDialogDescription>
							Configure a new persistent volume
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter></AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="outline"
						className="w-full justify-start gap-2 h-auto py-2"
					>
						<div className="p-1.5 bg-primary/10 rounded-md">
							<Network className="h-4 w-4 text-primary" />
						</div>
						<div className="flex-1 text-left">
							<div className="font-medium text-sm">Networks</div>
							<div className="text-xs text-muted-foreground">Configure networks</div>
						</div>
						<ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Create Network</AlertDialogTitle>
						<AlertDialogDescription>
							Configure a new Docker network
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter></AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

function EmptyDockerState({
	emptyRef,
	dockerRef,
}: {
	emptyRef: React.RefObject<HTMLButtonElement>;
	dockerRef: React.RefObject<HTMLButtonElement>;
}) {
	return (
		<div className="grid gap-4">
			<div className="flex flex-col">
				<h3 className="text-sm font-medium mb-2">Import file</h3>
				<div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg bg-muted/50 hover:border-primary transition-colors cursor-pointer group">
					<div className="text-center">
						<FileUp className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
						<p className="text-sm text-muted-foreground mb-2">
							Drag and drop your docker-compose.yml file here
						</p>
						<Button variant="outline" size="sm" className="pointer-events-none">
							Browse files
						</Button>
					</div>
				</div>

				<div className="relative flex items-center my-6">
					<div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border" />
					<div className="relative bg-card px-2 mx-auto">
						<span className="text-xs text-muted-foreground">OR</span>
					</div>
				</div>

				<h3 className="text-sm font-medium mb-2">Choose a template</h3>
				<div className="grid grid-cols-3 gap-4">
					<Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
						<div className="p-2 bg-primary/10 rounded-md">
							<Server className="h-5 w-5 text-primary" />
						</div>
						<div className="flex-1 text-left">
							<div className="font-medium">Web Application</div>
							<div className="text-xs text-muted-foreground">Nginx + PHP + MySQL</div>
						</div>
					</Button>

					<Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
						<div className="p-2 bg-primary/10 rounded-md">
							<Database className="h-5 w-5 text-primary" />
						</div>
						<div className="flex-1 text-left">
							<div className="font-medium">Database Stack</div>
							<div className="text-xs text-muted-foreground">PostgreSQL + pgAdmin</div>
						</div>
					</Button>

					<Button variant="outline" className="w-full justify-start gap-2 h-auto py-4">
						<div className="p-2 bg-primary/10 rounded-md">
							<Network className="h-5 w-5 text-primary" />
						</div>
						<div className="flex-1 text-left">
							<div className="font-medium">Development</div>
							<div className="text-xs text-muted-foreground">Node.js + MongoDB</div>
						</div>
					</Button>
				</div>
			</div>
		</div>
	);
}

function DockerConfiguration({
	emptyRef,
	dockerRef,
}: {
	emptyRef: React.RefObject<HTMLButtonElement>;
	dockerRef: React.RefObject<HTMLButtonElement>;
}) {
	return (
		<div className="grid gap-4">
			{/* Main content */}
			<div className="grid grid-cols-4 gap-4">
				{/* Left sidebar - Docker elements */}
				<div className="col-span-1 flex flex-col gap-4">
					<div className="rounded-lg border bg-card overflow-hidden">
						<Accordion type="multiple">
							<AccordionItem value="services">
								<AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors rounded-none cursor-pointer">
									<div className="flex items-center gap-2">
										<Server className="h-4 w-4 text-primary" />
										<span className="text-sm font-medium">Services</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className="px-0">
									<div className="space-y-2 px-4 pb-2">
										<div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors">
											<div>
												<div className="text-sm font-medium">web</div>
												<div className="text-xs text-muted-foreground">nginx:latest</div>
											</div>
											<Badge variant="secondary" className="text-xs">New</Badge>
										</div>
										<div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors">
											<div>
												<div className="text-sm font-medium">db</div>
												<div className="text-xs text-muted-foreground">postgres:15</div>
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="volumes">
								<AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors rounded-none cursor-pointer">
									<div className="flex items-center gap-2">
										<Database className="h-4 w-4 text-primary" />
										<span className="text-sm font-medium">Volumes</span>
									</div>
								</AccordionTrigger>
								<AccordionContent  className="px-0"	>
									<div className="space-y-2 px-4 pb-2">
										<div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors">
											<div>
												<div className="text-sm font-medium">data</div>
												<div className="text-xs text-muted-foreground">local driver</div>
											</div>
											<Badge variant="secondary" className="text-xs">New</Badge>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="networks">
								<AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors rounded-none cursor-pointer">
									<div className="flex items-center gap-2">
										<Network className="h-4 w-4 text-primary" />
										<span className="text-sm font-medium">Networks</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className="px-0">
									<div className="space-y-2 px-4 pb-2">
										<div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors">
											<div>
												<div className="text-sm font-medium">frontend</div>
												<div className="text-xs text-muted-foreground">bridge driver</div>
											</div>
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
					<Button variant="outline" className="w-full">
						<ArrowLeft className="h-4 w-4" />
						Go back
					</Button>
				</div>

				{/* Main editor area */}
				<div className="col-span-3">
					<div className="rounded-lg border">
						<div className="border-b p-4">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-medium flex items-center gap-2">
									<File className="h-4 w-4 text-muted-foreground" />
									Docker Compose
								</h3>
								<div className="flex items-center gap-2">
									<Button variant="outline" size="sm">
										<FileUp className="h-4 w-4 mr-2" />
										Import
									</Button>
									<Button variant="outline" size="sm">
										<Copy className="h-4 w-4 mr-2" />
										Copy
									</Button>
								</div>
							</div>
						</div>
						<div className="p-4">
							<Textarea
								className="min-h-[400px] font-mono text-sm"
								placeholder="version: '3'
services:
  web:
    image: nginx
    ports:
      - '80:80'
  db:
    image: postgres
    volumes:
      - data:/var/lib/postgresql/data

volumes:
  data:

networks:
  frontend:"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
