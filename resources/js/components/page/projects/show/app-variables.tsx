// Necessary imports
import { useRef, useState } from "react";

// Custom components
import { SmoothAnimate } from "@/components/ui/smooth-resized";

// Shadcn UI components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

// Icons
import { Search, Plus, FileUp, Download } from "lucide-react";

// Contexts
import { useProject } from "@/contexts/project-context";
// import { CommandAction, useCommand } from "@/contexts/command-context";
import { useVariable, VariableAction } from "@/contexts/variable-context";

import {
	CreateVariable,
	ImportEnv,
	VariablesList,
} from "../create/app-variables";

export function AppVariables() {
	// States
	const [search, setSearch] = useState<string>("");

	// Refs
	const inputRef = useRef<HTMLInputElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	// Custom Hooks
	const { project } = useProject();
	const { handleVariableAction, loading } = useVariable();

	return (
		<TabsContent value="variables" className="space-y-12">
			<>
				<h3 className="text-sm font-medium mb-2">Actions</h3>
				<div className="flex flex-col gap-2 w-full">
					<SmoothAnimate className="flex items-center gap-2 relative">
						{project.variables.length > 0 && (
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
						)}
					</SmoothAnimate>
					<SmoothAnimate
						className={`grid gap-2 ${project.variables.length > 0 ? "grid-cols-3" : "grid-cols-2  mt-[-10px]"}`}
					>
						{/* Add command */}
						<CreateVariable
							handleVariableAction={handleVariableAction}
							loading={loading}
						>
							<Button
								type={"button"}
								variant={"outline"}
								className="h-auto w-full flex items-start gap-4 p-4 rounded-lg border hover:!border-primary/50 transition-all duration-200 cursor-pointer relative overflow-hidden"
								disabled={loading}
							>
								<div className="p-2 bg-primary/10 rounded-md">
									<Plus className="h-5 w-5 text-primary" />
								</div>
								<div className="flex-1 text-left">
									<div className="font-medium text-foreground">Add variable</div>
									<div className="text-xs text-muted-foreground">
										Create a new variable
									</div>
								</div>
							</Button>
						</CreateVariable>

						{/* Import Makefile */}
						<ImportEnv handleVariableAction={handleVariableAction}>
							<Button
								type={"button"}
								variant={"outline"}
								disabled={loading}
								className="h-auto w-full flex items-start gap-4 p-4 rounded-lg border hover:!border-primary/50 transition-all duration-200 cursor-pointer relative overflow-hidden"
							>
								<div className="p-2 bg-primary/10 rounded-md">
									<FileUp className="h-5 w-5 text-primary" />
								</div>
								<div className="flex-1 text-left">
									<div className="font-medium text-foreground">Import variables</div>
									<div className="text-xs text-muted-foreground">
										Load or paste existing file
									</div>
								</div>
							</Button>
						</ImportEnv>

						{/* Export .env */}
						{project.variables.length > 0 && <ExportEnv loading={loading} />}
					</SmoothAnimate>
				</div>
			</>

			<>
				<h3 className="text-sm font-medium mb-2 mt-8">Variables</h3>
				<div className="bg-background rounded-md">
					<VariablesList
						search={search}
						handleVariableAction={handleVariableAction}
						loading={loading}
					/>
				</div>
			</>
		</TabsContent>
	);
}

function ExportEnv({ loading = false }: { loading?: boolean }) {
	// Custom Hooks
	const { project } = useProject();

	function handleExport() {
		// Créer le contenu du fichier .env
		const envContent = project.variables
			.map((variable) => `${variable.key}=${variable.value}`)
			.join("\n");

		// Créer un blob avec le contenu
		const blob = new Blob([envContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		// Créer un lien de téléchargement
		const link = document.createElement("a");
		link.href = url;
		link.download = ".env";
		document.body.appendChild(link);
		link.click();

		// Nettoyer
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	return (
		<Button
			type={"button"}
			variant={"outline"}
			onClick={handleExport}
			disabled={loading}
			className="h-auto w-full flex items-start gap-4 p-4 rounded-lg border hover:!border-primary/50 transition-all duration-200 cursor-pointer relative overflow-hidden"
		>
			<div className="p-2 bg-primary/10 rounded-md">
				<Download className="h-5 w-5 text-primary" />
			</div>
			<div className="flex-1 text-left">
				<div className="font-medium text-foreground">Export .env</div>
				<div className="text-xs text-muted-foreground">Download current file</div>
			</div>
		</Button>
	);
}
