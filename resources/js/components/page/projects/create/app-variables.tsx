// Necessary imports
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

// Custom components
import { parseVariablesFromEnv } from "@/lib/projects/parser";

// Shadcn UI components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
	DialogSubmit,
} from "@/components/ui/dialog";
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
	TabsContent, 
	TabsList, 
	TabsTrigger 
} from "@/components/ui/tabs";

// Icons
import { 
	Search, 
	Lock,
	Trash,
	Eye,
	EyeOff,
	Pen,
	Plus,
	Download,
	Copy
} from "lucide-react";

// Types
import {
	type Variable,
	VariableSchema,
	VariableTextSchema,
	VariableEnvSchema,
} from "@/types/models/project";
import { set } from "date-fns";

export function AppVariables() {
	const [variables, setVariables] = useState<Variable[]>([]);
	const [search, setSearch] = useState<string>("");

	return (
		// Wrapper
		<div className="grid gap-4">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					{/* Import .env */}
					<ImportEnv variables={variables} setVariables={setVariables} />

					{/* Add variable */}
					<CreateVariable variables={variables} setVariables={setVariables} />
				</div>

				<div className="flex items-center gap-2">
					<Input
						name="search"
						placeholder="Filter variables..."
						addonText={<Search className="h-4 w-4" />}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						readOnly={variables.length == 0}
					/>
					{variables.length > 0 && (
						<AnimatePresence mode="wait" >
							<motion.div
								key="preview"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.25 }}
							>
								<Button variant="destructive" onClick={() => setVariables([])}>
									<Trash className="h-4 w-4" />
									Delete variables
								</Button>
							</motion.div>
						</AnimatePresence>
					)}
				</div>
			</div>

			{variables.length > 0 ? (
				// Variables list
				<VariablesList
					variables={variables}
					setVariables={setVariables}
					search={search}
				/>
			) : (
				// No variables message
				<div className="flex items-center justify-center w-full text-sm text-muted-foreground border border-dashed border-border rounded-md py-6">
					No variables added yet. Click on "Add Variable" to create one.
				</div>
			)}
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

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Key</TableHead>
					<TableHead>Value</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{variables
					.filter((variable) =>
						variable.key.toLowerCase().includes(search.toLowerCase()),
					)
					.map((variable) => (
						<TableRow key={variable.key}>
							<TableCell className="font-mono">
								<div className="flex items-center gap-2">
									<Lock className="h-4 w-4" />
									{variable.key}
								</div>
							</TableCell>
							<TableCell>
								<span className="font-mono text-muted-foreground relative">
									{!variable.visible && (
										<div className="h-full w-full bg-muted rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
									)}
									{variable.value}
								</span>
							</TableCell>
							<TableCell className="text-right">
								<div className="flex items-center justify-end gap-2">
									<Button
										variant="ghost"
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
										variant="destructive"
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
						<TableCell colSpan={2} className="text-center py-4 bg-muted/50">
							No variables found
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
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

		const data = VariableForm.getValues();
		const keyExists = variables.some((variable) => variable.key === data.key);
		if (keyExists) {
			VariableForm.setError("key", { message: "Key already exists" });
			return false;
		}
		setVariables([...variables, data]);
		setVariable({ key: "", value: "" });
		toast.success(`Variable ${data.key} created successfully!`);
		VariableForm.reset();
		return true; // Retourne true pour fermer le Dialog
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"outline"}>
					<Plus />
					Add Variable
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add variable</DialogTitle>
					<DialogDescription>
						Add an environnement variable to your project. They must be written in
						uppercase and separated by an underscore.
					</DialogDescription>
				</DialogHeader>
				<Form {...VariableForm}>
					<form onSubmit={(e) => e.preventDefault()}>
						<div className="grid gap-4 items-start py-4 grid-cols-2">
							<FormField
								control={VariableForm.control}
								name="key"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Key</FormLabel>
										<FormControl>
											<Input id="key" placeholder="eg: MY_KEY" {...field} />
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
											<Input id="value" placeholder="eg: MY_VALUE" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant={"secondary"}>
									Close
								</Button>
							</DialogClose>
							<DialogSubmit onSubmit={onSubmit} asChild>
								<Button type="submit" variant={"outline"}>
									<Plus />
									Add variable
								</Button>
							</DialogSubmit>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
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

		const data = VariableForm.getValues();
		setVariables(
			variables.map((v) => {
				if (v.key === variable.key) {
					return { ...v, value: data.value };
				}
				return v;
			})
		);
		toast.success(`Variable ${data.key} updated successfully!`);
		VariableForm.reset();
		return true; // Retourne true pour fermer le Dialog
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"ghost"} size={"icon"}>
					<Pen />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit variable</DialogTitle>
					<DialogDescription>
						Edit an environnement variable of your project. 
						You can only change the value.
					</DialogDescription>
				</DialogHeader>
				<Form {...VariableForm}>
					<form onSubmit={(e) => e.preventDefault()}>
						<div className="grid gap-4 items-start py-4 grid-cols-2">
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
												placeholder="eg: MY_VALUE" 
												showPasswordToggle={true}
												{...field} 
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant={"secondary"}>
									Close
								</Button>
							</DialogClose>
							<DialogSubmit onSubmit={onSubmit} asChild>
								<Button type="submit" variant={"outline"}>
									<Pen />
									Edit variable
								</Button>
							</DialogSubmit>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function ImportEnv({
	variables,
	setVariables,
}: {
	variables: Variable[];
	setVariables: (variables: Variable[]) => void;
}) {

	const [envPreview, setEnvPreview] = useState<string>("");

	const VariableTextForm = useForm<z.infer<typeof VariableTextSchema>>({
		resolver: zodResolver(VariableTextSchema),
	});

	const VariableEnvForm = useForm<z.infer<typeof VariableEnvSchema>>({
		resolver: zodResolver(VariableEnvSchema),
	});

	async function onSubmitEnv() {
		const isValid = await VariableEnvForm.trigger();
		if (!isValid) return false;

		const data = VariableEnvForm.getValues();

		// On récupère le contenu du fichier
		const file = data.file as File;
		if (!file) {
			VariableEnvForm.setError("file", { message: "An error occured importing the file." });
			return false;
		}
		const text = await file.text(); 

		return handleUpdate(text, "file");
		
	}

	async function onSubmitText() {
		const isValid = await VariableTextForm.trigger();
		if (!isValid) return false;

		const data = VariableTextForm.getValues();

		console.log(data.textarea);

		return handleUpdate(data.textarea, "text");
	}

	function handleUpdate( text: string, form : "file" | "text" = "text") {
		// On parse le contenu du fichier
		const parsedVariables = parseVariablesFromEnv({
			content: text,
			variables: variables,
		});

		if (parsedVariables.length === 0) {
			if(form === "file") {
				VariableEnvForm.setError("file", { message: "No valid variables found in the file." });
			} else {
				VariableTextForm.setError("textarea", { message: "No valid variables found in the text." });
			}
			return false;
		} else {
			if(form === "file") {
				setEnvPreview("");
			}
		}

		toast.success(`${parsedVariables.length} variables imported successfully!`);

		setVariables([...parsedVariables, ...variables]);

		VariableEnvForm.reset();
		return true; // Retourne true pour fermer le Dialog
	}
	

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"secondary"}>
					<Download />
					Import .env
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import .env</DialogTitle>
					<DialogDescription>
						Either import your .env file or paste the content in a text area.
					</DialogDescription>
				</DialogHeader>
				<Tabs defaultValue="file" className="w-full" animate={true}>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="file">
							<Download />
							Import file
						</TabsTrigger>
						<TabsTrigger value="text">
							<Copy />
							Paste content
						</TabsTrigger>
					</TabsList>


					<TabsContent value="file">
						<Form {...VariableEnvForm}>
							<form onSubmit={(e) => e.preventDefault()} className="mt-4" encType="multipart/form-data">
								<FormField
									control={VariableEnvForm.control}
									name="file"
									render={({ field }) => {
										// Mandatory for a file input that cant take a value
										const { value, ...rest } = field;

										return (
											<FormItem>
												<FormLabel>File</FormLabel>
												<FormControl>
													<Input 
														id="file" 
														type="file" 
														accept=".env"
														{...rest} 
														onChange={e => {
															const file = e.target.files?.[0] ?? null
															field.onChange(file)    
															if (file) {
																const reader = new FileReader()
																reader.onload = (e) => {
																	setEnvPreview(e.target?.result as string)
																}
																reader.readAsText(file)
															} else {
																setEnvPreview('')
															}
														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
								{envPreview && (
									<AnimatePresence mode="wait" >
										<motion.div
											key="preview"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
											transition={{ duration: 0.25 }}
										>
											<div className="mt-4 grid gap-2 ">
												<FormLabel>Preview</FormLabel>
												<Textarea 
													id="preview" 
													value={envPreview} 
													disabled={true} 
													className="min-h-32 max-h-64" 
												/>
											</div>
										</motion.div>
									</AnimatePresence>
								)}
								<DialogFooter className="mt-4">
									<DialogClose asChild>
										<Button type="button" variant={"secondary"}>
											Close
										</Button>
									</DialogClose>
									<DialogSubmit asChild onSubmit={onSubmitEnv}>
										<Button type="submit" variant={"outline"}>
											<Download />
											Import file
										</Button>
									</DialogSubmit>
								</DialogFooter>
							</form>
						</Form>
					</TabsContent>
					<TabsContent value="text">
						<Form {...VariableTextForm}>
							<form onSubmit={(e) => e.preventDefault()} className="mt-4">
								<FormField
									control={VariableTextForm.control}
									name="textarea"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Content</FormLabel>
												<FormControl>
													<Textarea 
														id="textarea" 
														placeholder="KEY=VALUE" 
														className="min-h-32 max-h-64"
														{...field} 
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>

								<DialogFooter className="mt-4">
									<DialogClose asChild>
										<Button type="button" variant={"secondary"}>
											Close
										</Button>
									</DialogClose>
									<DialogSubmit asChild onSubmit={onSubmitText}>
										<Button type="submit" variant={"outline"}>
											<Download />
											Import content
										</Button>
									</DialogSubmit>
								</DialogFooter>
							</form>
						</Form>
					</TabsContent>
				</Tabs>

				
			</DialogContent>
		</Dialog>
	);
}
