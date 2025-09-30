// components/page/logs/index/app-header.tsx

// Necessary imports
import { useForm } from "@inertiajs/react";

// Shadcn UI components
import {
	Card,
	CardAction,
	CardTitle,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogBody,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTrigger,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Icons
import { Loader2, Logs, Trash2 } from "lucide-react";

// Types
import { type Log } from "@/lib/logs/type";

export function Appheader({ logs }: { logs: Log[] }) {
	const { delete: destroy, processing } = useForm();

	async function handleClear(): Promise<boolean> {
		destroy(route("logs.clear"));
		return true;
	}

	return (
		<Card className="mb-4">
			<CardHeader className="gap-0 gap-x-1.5">
				<div className="flex items-center gap-3">
					<div className="bg-card border rounded-md p-2">
						<Logs className="w-5 h-5 text-muted-foreground" />
					</div>
					<div>
						<CardTitle className="flex items-center gap-2 text-xl">Logs</CardTitle>
						<CardDescription>
							Here you can view and manage system logs.
						</CardDescription>
					</div>
				</div>
				<CardAction className="flex items-center gap-2 self-center">
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant={"outline"} type={"button"}>
								<Trash2 />
								Clear logs
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle className="flex items-center gap-2">
									<Trash2 className="w-4 h-4 text-destructive" />
									Clear logs
								</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to clear all logs? This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogBody>
								<AlertDialogFooter>
									<AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onAction={handleClear}
										disabled={processing}
										variant={"destructive"}
									>
										{processing ? <Loader2 className="animate-spin" /> : <Trash2 />}
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogBody>
						</AlertDialogContent>
					</AlertDialog>
				</CardAction>
			</CardHeader>
		</Card>
	);
}
