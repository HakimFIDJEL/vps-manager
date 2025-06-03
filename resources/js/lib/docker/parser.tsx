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
  isStrict: boolean;
  services: Array<{ name: string; image: string; env_file?: string[]; }>;
  volumes: Array<{ name: string; driver: string; }>;
  networks: Array<{ name: string; driver: string; customName?: string; }>;
  updatedContent?: string;
};

export function parseDockerCompose(content: string, isStrict: boolean, variables_length: number): ParsedDockerCompose {
  try {
    if(content.length === 0) {
      toast.error('Invalid docker-compose format: Empty file');
      return {
        isValid: false,
        isStrict: isStrict,
        services: [],
        volumes: [],
        networks: []
      };
    }

    // Parse YAML content
    const parsedYaml = yaml.load(content) as Record<string, any>;
    
    // Validate against schema
    if(isStrict) {
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
          isStrict: false,
          services: [],
          volumes: [],
          networks: []
        };
      }

      // Modifier le YAML pour ajouter .env à tous les services
      if (parsedYaml.services && variables_length > 0) {
        Object.keys(parsedYaml.services).forEach(serviceName => {
          const service = parsedYaml.services[serviceName];
          const envFile = service.env_file || [];
          const envFileArray = Array.isArray(envFile) ? envFile : [envFile];
          
          if (!envFileArray.includes('.env')) {
            service.env_file = [...envFileArray, '.env'];
          }
        });
      }

      // Mettre à jour le contenu YAML
      const updatedContent = yaml.dump(parsedYaml);
      
      // Extract services, volumes, and networks
      const services = Object.entries(parsedYaml.services).map(([name, config]: [string, any]) => ({
        name,
        image: config.image || 'build context',
        env_file: config.env_file
      }));
  
      const volumes = Object.entries(parsedYaml.volumes || {}).map(([name, config]: [string, any]) => ({
        name,
        driver: config?.driver || "local"
      }));
  
      const networks = Object.entries(parsedYaml.networks || {}).map(([name, config]: [string, any]) => ({
        name,
        driver: config?.driver || "bridge",
        customName: config?.name
      }));

      return {
        isValid: true,
        isStrict: isStrict,
        services,
        volumes,
        networks,
        updatedContent
      };
    } else {
      const updatedContent = yaml.dump(parsedYaml);

      return {
        isValid: true,
        isStrict: isStrict,
        services: [],
        volumes: [],
        networks: [],
        updatedContent
      }
    }
    




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
      isStrict: isStrict,
      services: [],
      volumes: [],
      networks: []
    };
  }
}
