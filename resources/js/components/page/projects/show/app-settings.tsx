// Necessary imports
import { toast } from "sonner";
import { Link } from "@inertiajs/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
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

// Schemas
import { FolderSchema } from "@/lib/projects/type";

// Icons
import {
	Container,
	Folder,
	Settings2,
	ArrowLeft,
	FolderPen,
	Loader2,
	Check,
	X,
	Trash2,
} from "lucide-react";

// Contexts
import { useProject } from "@/contexts/project-context";

// Types
type PathState = "" | "loading" | "success" | "error";

export function AppSettings() {
	return (
		<TabsContent value="settings">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FolderPathCard />
				<DeleteProjectCard />
			</div>
		</TabsContent>
	);
}

function FolderPathCard() {
	const { project, updateProject } = useProject();

	const FolderForm = useForm<z.infer<typeof FolderSchema>>({
		resolver: zodResolver(FolderSchema),
		defaultValues: {
			path: project.path || "",
		},
	});

	const [loading, setLoading] = useState(false);
	const [availabilityState, setAvailabilityState] = useState<PathState>("");

	const watchedPath = FolderForm.watch("path");

	useEffect(() => {
		setAvailabilityState("");
	}, [watchedPath]);

	async function checkPathAvailability(path: string): Promise<boolean> {
		if (loading) return false;


		// No need to check if the path is the same as the current project folder path
		if (!path || path === project.path) {
			setAvailabilityState("");
			return true;
		}

		// If the state is already success, no need to check again
		if (availabilityState === "success") {
			return true;
		}

		if (FolderSchema.safeParse({ path }).success === false) {
			setAvailabilityState("");
			return false;
		}

		setAvailabilityState("loading");
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const isAvailable = true;

			setAvailabilityState(isAvailable ? "success" : "error");
			return isAvailable;
		} catch (error){
			setAvailabilityState("error");
			return false;
		}
	}

	async function onSubmit(data: z.infer<typeof FolderSchema>): Promise<void> {
		if (loading) return;

		setLoading(true);

		if (availabilityState !== "success") {
			const available = await checkPathAvailability(data.path);
			if (!available) {
				setLoading(false);
				return;
			}
		}

		toast.loading("Changing folder path...", {
			id: "change-folder-path",
		});
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));

			toast.success("Folder path changed successfully!");
			updateProject("path", data.path);

			router.reload();
		} catch (error) {
			console.error("Error changing folder path:", error);
			toast.error("Failed to change folder path");
		} finally {
			toast.dismiss("change-folder-path");
			setLoading(false);
			setAvailabilityState("");
		}
	}

	return (
		<Card className="col-span-1">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="bg-card border rounded-md p-2">
						<FolderPen className="w-5 h-5 text-muted-foreground" />
					</div>
					<div>
						<CardTitle className="flex items-center gap-2 text-xl">
							Folder path
						</CardTitle>
						<CardDescription>Change the folder path of your project.</CardDescription>
					</div>
				</div>
			</CardHeader>
			<Separator />
			<CardContent>
				<Form {...FolderForm}>
					<form
						onSubmit={FolderForm.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<FormField
							control={FolderForm.control}
							name={"path"}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2 justify-between">
										<div>Folder path</div>

										{/* State */}
										{availabilityState === "loading" && (
											<div className="flex items-center gap-1">
												<Loader2 className="animate-spin text-muted-foreground h-3 w-3" />
												<span className="text-muted-foreground text-xs">
													Checking availability...
												</span>
											</div>
										)}

										{availabilityState === "success" && (
											<div className="flex items-center gap-1">
												<Check className="text-primary h-3 w-3" />
												<span className="text-primary text-xs">The path is available.</span>
											</div>
										)}

										{availabilityState === "error" && (
											<div className="flex items-center gap-1">
												<X className="text-destructive h-3 w-3" />
												<span className="text-destructive text-xs">
													The path is not available.
												</span>
											</div>
										)}
									</FormLabel>
									<FormControl>
										<Input
											id={"path"}
											readOnly={loading}
											placeholder={"folder-path"}
											autoFocus={true}
											addonText={"/projects/"}
											{...field}
											onBlur={(e) => {
												field.onBlur();
												checkPathAvailability(e.target.value);
											}}
										/>
									</FormControl>
									{/* <FormDescription>
										Must be at least 6 characters long and can only contain letters,
										numbers, underscores, and dashes.
									</FormDescription> */}
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type={"submit"}
							disabled={
								loading ||
								project.path == watchedPath ||
								availabilityState == "loading" ||
								availabilityState == "error"
							}
							className="w-full"
							variant={"default"}
						>
							{loading ? <Loader2 className="animate-spin" /> : <FolderPen />}
							Edit folder path
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

function DeleteProjectCard() {
	// Variables
	const FolderForm = useForm<z.infer<typeof FolderSchema>>({
		resolver: zodResolver(FolderSchema),
		defaultValues: {
			path: "",
		},
	});
	const watchedPath = FolderForm.watch("path");

	// States
	const [loading, setLoading] = useState(false);
	const [matching, setMatching] = useState(false);

	// Hooks
	const { project } = useProject();

	useEffect(() => {
		if (watchedPath === project.path) {
			setMatching(true);
		} else {
			setMatching(false);
		}
	}, [watchedPath]);

	function handleDelete() {
		setLoading(true);

		if (watchedPath !== project.path) {
			FolderForm.setError("path", {
				type: "manual",
				message: "The provided path does not match to the project folder path",
			});
			setLoading(false);
			return false;
		}

		toast.loading("Deleting project...", {
			id: "delete-project",
		});

		try {
			router.delete(route("projects.destroy", { inode: 1234 }));
		} catch (error) {
			console.error("Error deleting project:", error);
			toast.error("Failed deleting project");
			toast.dismiss("delete-project");
			setLoading(false);
		} finally {
			return false;
		}
	}

	return (
		<Card className="col-span-1">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="bg-card border rounded-md p-2">
						<Trash2 className="w-5 h-5 text-destructive" />
					</div>
					<div>
						<CardTitle className="flex items-center gap-2 text-xl">
							Delete project
						</CardTitle>
						<CardDescription>Delete the project and all its data.</CardDescription>
					</div>
				</div>
			</CardHeader>
			<Separator />
			<CardContent className="flex flex-col justify-between gap-2 h-full">
				<p className="text-muted-foreground text-sm">
					Caution, if you delete the project, the entire folder will be gone, same
					for every variables, docker configuration, commands. This action is
					irreversible.
				</p>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							type={"submit"}
							disabled={loading}
							className="w-full"
							variant={"destructive"}
						>
							<Trash2 />
							Delete project
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className="flex gap-2 items-center">
								<Trash2 className="text-destructive h-4 w-4" />
								Delete project
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete{" "}
								<strong>{project.path}</strong> project and all of its contents. Do you
								want to proceed?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<Form {...FolderForm}>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
							>
								<AlertDialogBody>
									<FormField
										control={FolderForm.control}
										name={"path"}
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													To confirm, type "{project.path}" in the box below
												</FormLabel>
												<FormControl>
													<Input
														id={"path"}
														readOnly={loading}
														placeholder={"folder-path"}
														autoFocus={true}
														addonText={"/projects/"}
														{...field}
													/>
												</FormControl>
												{/* <FormDescription>
										Must be at least 6 characters long and can only contain letters,
										numbers, underscores, and dashes.
									</FormDescription> */}
												<FormMessage />
											</FormItem>
										)}
									/>
								</AlertDialogBody>

								<AlertDialogFooter className="mt-4">
									<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onAction={handleDelete}
										variant={"destructive"}
										disabled={!FolderForm.formState.isValid || loading || !matching}
										type={"submit"}
									>
										{loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
										Delete project
									</AlertDialogAction>
								</AlertDialogFooter>
							</form>
						</Form>
					</AlertDialogContent>
				</AlertDialog>
			</CardContent>
		</Card>
	);
}
