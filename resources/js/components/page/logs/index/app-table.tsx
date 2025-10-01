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

// Functions
import {
	formatActions,
	formatDate,
	formatExitCode,
	formatSuccessful,
} from "@/lib/logs/formatter";

// Types
import { LogProps } from "@/lib/logs/type";

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
							<TableHead className="w-[12rem] p-4">User</TableHead>
							<TableHead className="p-4">Command</TableHead>
							<TableHead className="w-[8rem] text-center p-4">Status</TableHead>
							<TableHead className="w-[8rem] text-center p-4">Exit Code</TableHead>
							<TableHead className="w-[20%] p-4">Executed At</TableHead>
							<TableHead className="w-[8rem] text-center p-4">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{props.logs.map((log) => (
							<TableRow key={log.id}>
								<TableCell className="font-mono p-4">
									#{log.userid} - {log.username}
								</TableCell>
								<TableCell className="font-mono p-4 break-all truncate">
									{log.command}
								</TableCell>
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
						{props.logs.length === 0 && (
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
					{totalPages > 0 && (
						<TableFooter>
							<TableRow>
								<TableCell colSpan={6} className="text-center px-4 py-2">
									<span className="flex text-sm font-light text-muted-foreground">
										Showing {(current- 1) * paginate + 1}-{(current - 1) * paginate + props.logs.length } of {totalLogs} entries
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
