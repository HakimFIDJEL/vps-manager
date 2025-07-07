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
			</div>
		</TabsContent>
	);
}

function FolderPathCard() {

	const { project } = useProject();

	const FolderForm = useForm<z.infer<typeof FolderSchema>>({
		resolver: zodResolver(FolderSchema),
		defaultValues: {
			path: project.folderPath || "",
		},
	});

	const [loading, setLoading] = useState(false);
	const [pathState, setPathState] = useState<PathState>("");

	const [currentPath, setCurrentPath] = useState<string>(project.folderPath || "");

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const subscription = FolderForm.watch((value, { name }) => {
			if (name === "path") {
				setPathState("loading");

				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				timeoutRef.current = setTimeout(() => {
					console.log("Nouvelle valeur du path :", value.path);

					if(value.path && value.path !== currentPath) {
						checkPathAvailability(value.path);
					} else {
						setPathState("");
					}

				}, 500);
			}
		});

		return () => {
			subscription.unsubscribe();
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [FolderForm]);

	async function checkPathAvailability(path: string) {
		setPathState("loading");
		try {
			// Simulate an API call to check path availability
			await new Promise((resolve) => setTimeout(resolve, 1000));
			if (path === "available-path") {
				setPathState("success");
				setCurrentPath(path);
			} else {
				setPathState("error");
			}
		} catch (error) {
			console.error("Error checking path availability:", error);
			setPathState("error");
		}
	}

	async function onSubmit(data: z.infer<typeof FolderSchema>) {
		setLoading(true);
		toast.loading("Changing folder path...", {
			id: "change-folder-path",
		});
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			toast.success("Folder path changed successfully");
		} catch (error) {
			console.error("Error changing folder path:", error);
			toast.error("Failed to change folder path");
		} finally {
			toast.dismiss("change-folder-path");
			setLoading(false);
			setPathState("");
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
										{pathState === "loading" && (
											<Loader2 className="animate-spin text-muted-foreground h-3 w-3" />
										)}

										{pathState === "success" && (
											<div className="flex items-center gap-1">
												<Check className="text-primary h-3 w-3" />
												<span className="text-primary text-xs">The path is available.</span>
											</div>
										)}

										{pathState === "error" && (
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
										/>
									</FormControl>
									<FormDescription>
										The folder path where your project will be stored.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type={"submit"}
							disabled={
								!FolderForm.formState.isValid || loading || pathState !== "success"
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
