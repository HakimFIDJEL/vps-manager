// components/page/logs/index/app-header.tsx

// Necessary imports
import { useForm, router, Link } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";

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
import { LogProps } from "@/lib/logs/type";

export function Appheader(props: LogProps) {
	const form = useForm();

	function handleClear() {
		form.delete(route("logs.clear"), {
			preserveState: false,
		});

		return false;
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
									Are you sure you want to delete {props.total} log{props.total > 1 ? 's' : ''}? This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
							>
								<AlertDialogBody></AlertDialogBody>
								<AlertDialogFooter>
									<AlertDialogCancel disabled={form.processing}>
										Cancel
									</AlertDialogCancel>
									<AlertDialogAction
										onAction={handleClear}
										variant={"destructive"}
										type={"submit"}
										disabled={form.processing}
									>
										{form.processing ? <Loader2 className="animate-spin" /> : <Trash2 />}
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</form>
						</AlertDialogContent>
					</AlertDialog>
				</CardAction>
			</CardHeader>
		</Card>
	);
}
