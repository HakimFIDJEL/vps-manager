// pages/logs/index.tsx

// Necessary imports
import { Head, Link, useForm } from "@inertiajs/react";

// Layout
import { AppLayout } from "@/layouts/app";

// Shadcn UI components
import {
	Card,
	CardAction,
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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

// Functions
import {
	formatActions,
	formatDate,
	formatExitCode,
	formatSuccessful,
} from "@/lib/logs/formatter";

// Icons
import { Loader2, Logs, Trash2 } from "lucide-react";

// Types
import { type BreadcrumbItem } from "@/types";
import { type Log } from "@/lib/logs/type";
import { SmoothItem } from "@/components/ui/smooth-resized";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "VPS Manager",
		link: false,
	},
	{
		title: "Logs",
		href: route("logs.index"),
		link: true,
	},
];

export default function Index({ logs }: { logs: Log[] }) {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Logs" />

			<Content logs={logs} />
		</AppLayout>
	);
}

export function Content({ logs }: { logs: Log[] }) {
	const { delete: destroy, processing } = useForm();

	async function handleClear(): Promise<boolean> {
		destroy(route("logs.clear"));
		return true;
	}

	return (
		<>
			{/* Title */}
			<SmoothItem delay={0.1}>
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
											Are you sure you want to clear all logs? This action cannot be
											undone.
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
			</SmoothItem>

			{/* Table */}
			<SmoothItem delay={0.3} layout={false}>
				<Card className="border-0 overflow-visible">
					<CardContent className="p-0">
						<Table className="border-0 ">
							<TableHeader>
								<TableRow>
									<TableHead className="p-4">User</TableHead>
									<TableHead className="p-4">Command</TableHead>
									<TableHead className="text-center p-4">Successful</TableHead>
									<TableHead className="text-center p-4">Exit Code</TableHead>
									<TableHead className="p-4">Executed At</TableHead>
									<TableHead className="text-center p-4">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{logs.map((log) => (
									<TableRow key={log.id}>
										<TableCell className="font-mono p-4">
											#{log.userid} - {log.username}
										</TableCell>
										<TableCell className="font-mono p-4">{log.command}</TableCell>
										<TableCell className="p-4">
											{formatSuccessful(log.successful)}
										</TableCell>
										<TableCell className="p-4">{formatExitCode(log.exitCode)}</TableCell>
										<TableCell className="p-4">{formatDate(log.executed_at)}</TableCell>
										<TableCell className="w-[12rem]">
											{formatActions(log.id, "full", "sm")}
										</TableCell>
									</TableRow>
								))}
								{logs.length === 0 && (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center py-4 bg-muted/50 text-muted-foreground"
										>
											No logs available yet, they will be added here when commands are
											executed.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</SmoothItem>

			{/* Pagination */}
			<SmoothItem delay={0.5}>
				<Card className="bg-transparent">
					<CardContent className="flex justify-center">
						Here will be the pagination controls.
					</CardContent>
				</Card>
			</SmoothItem>
		</>
	);
}
