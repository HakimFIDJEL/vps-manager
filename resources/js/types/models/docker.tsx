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
  file: z.custom<File>((val) => val instanceof File, {
    message: "Le fichier n'est pas valide",
  })
  .refine((file) => file.name.endsWith(".yml") || file.name.endsWith(".yaml"), {
    message: "Le fichier doit avoir l'extension .yml ou .yaml",
  })
  .refine((file) => file.size <= 1024 * 1024, {
    message: "Le fichier ne doit pas dépasser 1 Mo",
  })
  .refine(
    async (file) => {
      try {
        const text = await file.text();
        console.log('File content:', text);
        const parsed = yaml.load(text) as Record<string, any>;
        console.log('Parsed YAML:', parsed);
        
        // Vérification basique de la structure
        if (!parsed || typeof parsed !== 'object') {
          console.error('Invalid YAML structure');
          return false;
        }

        // Vérification des services
        if (!parsed.services || typeof parsed.services !== 'object') {
          console.error('No services found');
          return false;
        }

        // Si on arrive ici, le fichier est valide
        return true;
      } catch (error) {
        console.error('Error parsing file:', error);
        return false;
      }
    },
    {
      message: "Le fichier doit être un fichier docker-compose valide",
    },
  ),
});

export type DockerComposeState = {
  content: string;
  isSaved: boolean;
  parsed: {
    services: Array<{ name: string; image: string; }>;
    volumes: Array<{ name: string; driver: string; }>;
    networks: Array<{ name: string; driver: string; }>;
  };
};

export type DockerService = {
  name: string;
  image: string;
};

export type DockerVolume = {
  name: string;
  driver: string;
};

export type DockerNetwork = {
  name: string;
  driver: string;
};

export type DockerAction = {
  name: string;
  icon: string;
  description: string;
};
