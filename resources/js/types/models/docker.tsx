import { z } from "zod";
import yaml from "js-yaml";

// Docker Compose Schema
const DockerServiceSchema = z.object({
  image: z.string().optional(),
  build: z.union([z.string(), z.object({}).passthrough()]).optional(),
  ports: z.array(z.string()).optional(),
  volumes: z.array(z.string()).optional(),
  environment: z.union([
    z.record(z.any()),
    z.array(z.string())
  ]).optional(),
  env_file: z.union([z.string(), z.array(z.string())]).optional(),
  networks: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
  depends_on: z.union([
    z.array(z.string()),
    z.record(z.object({
      condition: z.string()
    }).passthrough())
  ]).optional(),
  restart: z.string().optional(),
  healthcheck: z.object({
    test: z.union([z.array(z.string()), z.string()]),
    timeout: z.string(),
    retries: z.number()
  }).optional(),
  entrypoint: z.string().optional(),
  working_dir: z.string().optional(),
  command: z.union([z.string(), z.array(z.string())]).optional()
}).passthrough();

const DockerComposeSchema = z.object({
  version: z.string().optional(),
  services: z.record(DockerServiceSchema),
  volumes: z.record(z.union([
    z.object({
      driver: z.string().optional(),
      external: z.boolean().optional(),
    }).passthrough(),
    z.null()
  ])).optional(),
  networks: z.record(z.union([
    z.object({
      driver: z.string().optional(),
      external: z.boolean().optional(),
      name: z.string().optional()
    }).passthrough(),
    z.null()
  ])).optional(),
}).passthrough();

export const DockerComposeFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.name.endsWith(".yml") || file.name.endsWith(".yaml"), {
      message: "The file must have .yml or .yaml extension",
    })
    .refine((file) => file.size <= 1024 * 1024, {
      message: "The file must not exceed 1 MB",
    })
    .refine(
      async (file) => {
        try {
          const text = await file.text();
          return text.trim().length > 0;
        } catch (error) {
          return false;
        }
      },
      {
        message: "The file must not be empty",
      },
    )
    .refine(
      async (file) => {
        try {
          const text = await file.text();
          yaml.load(text);
          return true;
        } catch (error) {
          console.error('YAML parsing error:', error);
          return false;
        }
      },
      {
        message: "The file must be a valid YAML file",
      },
    ),
});

export type DockerComposeState = {
  content: string;
  isSaved: boolean;
  parsed: {
    services: Array<{ name: string; image: string; env_file?: string[]; }>;
    volumes: Array<{ name: string; driver: string; }>;
    networks: Array<{ name: string; driver: string; customName?: string; }>;
  };
};
