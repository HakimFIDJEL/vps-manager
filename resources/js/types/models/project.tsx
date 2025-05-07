import { z } from "zod"


// Types
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

export type Variable = {
    key: string;
    value: string;
}

// Schemas
export const VariableSchema = z.object({
    key: z.string().regex(/^[A-Z_]+$/, { message: "Key must be uppercase and separated by an underscore" }),
    value: z.string().regex(/^\S+$/, { message: "Value must not contain spaces" }),
  })
