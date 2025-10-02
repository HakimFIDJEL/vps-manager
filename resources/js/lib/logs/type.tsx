// lib/logs/type.tsx

export type Log = {
	id: number;
	username: string;
	userid: number;
	successful: boolean;
	exitCode: number;
	command: string;
	stdout: string;
	stderr: string;
	executed_at: string;
};

export type LogProps = {
	logs: Log[];
	paginate: number;
	pages: number;
	page: number;
	total: number;
}