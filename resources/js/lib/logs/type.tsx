// lib/logs/type.tsx

export type Log = {
    id: number;
    username: string;
    userid: number;
    command: string;
    successfull: boolean;
    output: string;
    executed_at: string;
}