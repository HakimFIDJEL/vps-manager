import { toast } from "sonner";
import { z } from "zod";
// import yaml from "js-yaml";
import * as YAML from "yaml";

// Docker Compose Schema
const DockerServiceSchema = z
	.object({
		image: z.string().optional(),
		build: z.union([z.string(), z.object({}).passthrough()]).optional(),
		ports: z.array(z.string()).optional(),
		volumes: z.array(z.string()).optional(),
		environment: z.union([z.record(z.any()), z.array(z.string())]).optional(),
		env_file: z.union([z.string(), z.array(z.string())]).optional(),
		networks: z.array(z.string()).optional(),
		labels: z
			.union([z.record(z.string()), z.array(z.string().regex(/^[^=]+=.*/))])
			.optional(),

		depends_on: z
			.union([
				z.array(z.string()),
				z.record(
					z
						.object({
							condition: z.string(),
						})
						.passthrough(),
				),
			])
			.optional(),
		restart: z.string().optional(),
		healthcheck: z
			.object({
				test: z.union([z.array(z.string()), z.string()]),
				timeout: z.string(),
				retries: z.number(),
			})
			.optional(),
		entrypoint: z.string().optional(),
		working_dir: z.string().optional(),
		command: z.union([z.string(), z.array(z.string())]).optional(),
	})
	.strict();

const DockerComposeSchema = z
	.object({
		version: z.string().optional(),
		services: z.record(DockerServiceSchema),
		volumes: z
			.record(
				z.union([
					z
						.object({
							driver: z.string().optional(),
							external: z.boolean().optional(),
						})
						.passthrough(),
					z.null(),
				]),
			)
			.optional(),
		networks: z
			.record(
				z.union([
					z
						.object({
							driver: z.string().optional(),
							external: z.boolean().optional(),
							name: z.string().optional(),
						})
						.passthrough(),
					z.null(),
				]),
			)
			.optional(),
	})
	.strict();

export type ParsedDockerCompose = {
	isValid: boolean;
	isStrict: boolean;
	services: Array<{ name: string; image: string; env_file?: string[] }>;
	volumes: Array<{ name: string; driver: string }>;
	networks: Array<{ name: string; driver: string; customName?: string }>;
	updatedContent?: string;
};

export function parseDockerCompose(
  content: string,
  isStrict: boolean,
  variables_length: number,
): ParsedDockerCompose {
  try {
    if (content.length === 0) {
      toast.error("An error occured", { description: "Invalid docker configuration format: Empty file" });
      return { isValid: false, isStrict, services: [], volumes: [], networks: [] };
    }

    if (isStrict) {
      const parsedYaml = YAML.parse(content) as Record<string, any>;
      const result = DockerComposeSchema.safeParse(parsedYaml);
      if (!result.success) {
        const errors = result.error.errors.map(err => `Field "${err.path.join(".")}": ${err.message}`);
        toast.error("An error occured", { description: `Invalid docker configuration format: ${errors.join(", ")}` });
        return { isValid: false, isStrict, services: [], volumes: [], networks: [] };
      }

      if (parsedYaml.services && variables_length > 0) {
        Object.keys(parsedYaml.services).forEach((serviceName) => {
          const service = parsedYaml.services[serviceName] ?? {};
          const envFile = service.env_file ?? [];
          const envFileArray = Array.isArray(envFile) ? envFile : [envFile];
          if (!envFileArray.includes(".env")) service.env_file = [...envFileArray, ".env"];
          parsedYaml.services[serviceName] = service;
        });
      }

      const updatedContent = YAML.stringify(parsedYaml);

      const services = Object.entries(parsedYaml.services ?? {}).map(([name, config]: [string, any]) => ({
        name,
        image: config.image || "build context",
        env_file: Array.isArray(config?.env_file) ? config.env_file : (config?.env_file ? [config.env_file] : undefined),
      }));
      const volumes = Object.entries(parsedYaml.volumes ?? {}).map(([name, config]: [string, any]) => ({
        name,
        driver: config?.driver || "local",
      }));
      const networks = Object.entries(parsedYaml.networks ?? {}).map(([name, config]: [string, any]) => ({
        name,
        driver: config?.driver || "bridge",
        customName: config?.name,
      }));

      if (services.length === 0) {
        toast.error("An error occured", { description: "Invalid docker configuration format: No services found" });
        return { isValid: false, isStrict, services: [], volumes: [], networks: [] };
      }

      return { isValid: true, isStrict, services, volumes, networks, updatedContent };
    } else {
      try {
        YAML.parse(content);
      } catch (e) {
        toast.error("An error occured", { description: `Failed to parse docker configuration: ${(e as Error).message}` });
        return { isValid: false, isStrict, services: [], volumes: [], networks: [] };
      }
      return { isValid: true, isStrict, services: [], volumes: [], networks: [], updatedContent: content };
    }
  } catch (error) {
    console.error("Error parsing docker configuration:", error);
    toast.error("An error occured", {
      description: `Failed to parse docker configuration: ${error instanceof Error ? error.message : String(error)}`,
    });
    return { isValid: false, isStrict, services: [], volumes: [], networks: [] };
  }
}

