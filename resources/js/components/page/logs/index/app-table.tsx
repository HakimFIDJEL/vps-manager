// components/page/logs/index/app-table.tsx

// Shadcn UI components
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTrigger,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

// Functions
import {
	formatDate,
	formatExitCode,
	formatSuccessful,
} from "@/lib/logs/formatter";

// Types
import { Log, LogProps } from "@/lib/logs/type";

// Icons
import { Info, Loader2, Trash2 } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export function AppTable(props: LogProps) {
	const totalPages = Number(props.pages);
	const current = Number(props.page);
	const paginate = Number(props.paginate);
	const totalLogs = Number(props.total);

	return (
		<Card className="border-0 overflow-visible">
			<CardContent className="p-0">
				<Table className="border-0 table-fixed">
					<TableHeader>
						<TableRow>
							<TableHead className="w-[5rem] p-4">ID</TableHead>
							<TableHead className="w-[5rem] p-4">UID</TableHead>
							<TableHead className="w-[7rem] p-4">Username</TableHead>
							<TableHead className="p-4">Command</TableHead>
							<TableHead className="w-[8rem] text-center p-4">Status</TableHead>
							<TableHead className="w-[8rem] text-center p-4">Exit Code</TableHead>
							<TableHead className="w-[16%] p-4">Executed At</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{props.logs.map((log) => (
							<DetailDialog key={log.id} log={log}>
								<TableRow className="cursor-pointer">
									<TableCell className="font-mono p-4">#{log.id}</TableCell>
									<TableCell className="font-mono p-4">#{log.userid}</TableCell>
									<TableCell className="font-mono p-4">{log.username}</TableCell>
									<TableCell className="font-mono p-4 break-all truncate">
										{log.command}
									</TableCell>
									<TableCell className="p-4">
										{formatSuccessful(log.successful)}
									</TableCell>
									<TableCell className="p-4">{formatExitCode(log.exitCode)}</TableCell>
									<TableCell className="p-4">{formatDate(log.executed_at)}</TableCell>
								</TableRow>
							</DetailDialog>
						))}
						{props.logs.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={7}
									className="text-center py-4 bg-muted/50 text-muted-foreground"
								>
									No logs available yet, they will be added here when commands are
									executed.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
					{totalPages > 0 && (
						<TableFooter>
							<TableRow>
								<TableCell colSpan={7} className="text-center px-4 py-2">
									<span className="flex text-sm font-light text-muted-foreground">
										Showing {(current - 1) * paginate + 1}-
										{(current - 1) * paginate + props.logs.length} of {totalLogs} entries
									</span>
								</TableCell>
							</TableRow>
						</TableFooter>
					)}
				</Table>
			</CardContent>
		</Card>
	);
}

function DetailDialog({
	children,
	log,
}: {
	children: React.ReactNode;
	log: Log;
}) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent className="!max-w-3xl">
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center justify-between">
						<div className="flex items-center justify-center gap-2">
							<Info className="text-muted-foreground" />
							Details of log #{log.id}
						</div>
						{formatSuccessful(log.successful)}
					</AlertDialogTitle>
				</AlertDialogHeader>
				<Separator />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="col-span-1 flex flex-col gap-2 h-full">
						<h2 className="text-base font-normal">Command</h2>
						<div className="rounded-md px-3 py-2 dark:bg-input/30 bg-transparent border font-mono text-sm font-light h-full">
							{log.command}
						</div>
					</div>

					<div className="col-span-1 flex flex-col gap-2 h-full">
						<h2 className="text-base font-normal">Output</h2>
						<div className="relative rounded-md px-3 py-2 dark:bg-input/30 bg-transparent border font-mono text-sm font-light h-full">
							{(log.successful && log.stdout != "") ||
							(!log.successful && log.stderr != "") ? (
								log.successful ? (
									log.stdout
								) : (
									log.stderr
								)
							) : (
								<div className="font-sans p-1 flex items-center justify-center text-muted-foreground h-full">
									The command didn't provide any output.
								</div>
							)}
						</div>
					</div>

					<div className="col-span-1 lg:col-span-2 w-full grid gap-2 items-start">
						<h2 className="text-base font-normal">Informations</h2>
						<div className="rounded-md px-3 py-2 dark:bg-input/30 bg-transparent border">
							<div className="flex items-center justify-between">
								<div className="text-muted-foreground text-sm">Author Username</div>
								<Separator className="mx-4 w-auto flex-1" />
								<div className="text-sm font-mono">{log.username}</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="text-muted-foreground text-sm">Author UID</div>
								<Separator className="mx-4 w-auto flex-1" />
								<div className="text-sm font-mono">{log.userid}</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="text-muted-foreground text-sm">Exit Code</div>
								<Separator className="mx-4 w-auto flex-1" />
								<div className="text-sm font-mono">{log.exitCode}</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="text-muted-foreground text-sm">Executed At</div>
								<Separator className="mx-4 w-auto flex-1" />
								<div className="text-sm font-mono">{log.executed_at}</div>
							</div>
						</div>
					</div>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Close</AlertDialogCancel>
					<DeleteDialog log={log}>
						{/* <AlertDialogAction variant={"destructive"}> */}
						<Button variant={"destructive"}>
							<Trash2 />
							Delete
						</Button>
						{/* </AlertDialogAction> */}
					</DeleteDialog>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function DeleteDialog({
	children,
	log,
}: {
	children: React.ReactNode;
	log: Log;
}) {
	const form = useForm();

	function handleDelete() {
		form.delete(route("logs.destroy", { id: log.id }), {
			preserveState: false,
		});

		return false;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						<Trash2 className="w-4 h-4 text-destructive" />
						Delete log #{log.id}
					</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this log? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={form.processing}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onAction={handleDelete}
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
	);
}
