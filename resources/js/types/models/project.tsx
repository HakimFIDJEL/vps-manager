export type Project = {
    inode: number;
    name: string;
    folder: string;
    traefik_enabled: boolean;
    updated_at: string;
    created_at: string;
    containers: Container[];
}

export type Container = {
    name: string;
    image: string;
    status: string;
    updated_at: string;
    created_at: string;
}