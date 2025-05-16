import { toast } from "sonner";
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

export type ParsedDockerCompose = {
  isValid: boolean;
  services: Array<{ name: string; image: string; }>;
  volumes: Array<{ name: string; driver: string; }>;
  networks: Array<{ name: string; driver: string; customName?: string; }>;
};

export function parseDockerCompose(content: string): ParsedDockerCompose {
  try {
    // console.log('Parsing docker-compose file...');
    // console.log('Raw content:', content);

    if(content.length === 0) {
      toast.error('Invalid docker-compose format: Empty file');
      return {
        isValid: false,
        services: [],
        volumes: [],
        networks: []
      };
    }

    // Parse YAML content
    const parsedYaml = yaml.load(content);
    // console.log('Parsed YAML:', parsedYaml);
    
    // Validate against schema
    const result = DockerComposeSchema.safeParse(parsedYaml);
    
    if (!result.success) {
      console.error('Validation errors:', result.error.errors);
      const errors = result.error.errors.map(err => {
        const path = err.path.join('.');
        return `Field "${path}": ${err.message}`;
      });
      console.error('Detailed validation errors:', errors);
      toast.error(`Invalid docker-compose format: ${errors.join(', ')}`);
      return {
        isValid: false,
        services: [],
        volumes: [],
        networks: []
      };
    }

    // Extract services, volumes, and networks
    const services = Object.entries(result.data.services).map(([name, config]) => ({
      name,
      image: config.image || 'build context'
    }));

    const volumes = Object.entries(result.data.volumes || {}).map(([name, config]) => ({
      name,
      driver: config?.driver || "local"
    }));

    const networks = Object.entries(result.data.networks || {}).map(([name, config]) => ({
      name,
      driver: config?.driver || "bridge",
      customName: config?.name
    }));

    // console.log('Successfully parsed docker-compose file');
    // console.log('Services:', services);
    // console.log('Volumes:', volumes);
    // console.log('Networks:', networks);

    return {
      isValid: true,
      services,
      volumes,
      networks
    };

  } catch (error) {
    console.error('Error parsing docker-compose:', error);
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.join('.');
        return `Field "${path}": ${err.message}`;
      });
      toast.error(`Invalid docker-compose format: ${errors.join(', ')}`);
    } else if (error instanceof Error) {
      toast.error(`Failed to parse docker-compose: ${error.message}`);
    }

    return {
      isValid: false,
      services: [],
      volumes: [],
      networks: []
    };
  }
}
