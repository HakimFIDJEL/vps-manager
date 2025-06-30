import { useProject } from "@/contexts/project-context";
import { toast } from "sonner";
import yaml from "js-yaml";
import { parseDockerCompose } from "@/lib/docker/parser";
import type { DockerAction } from "@/lib/docker/type";

export function useDockerActionsLocal() {
  const { project, updateProject } = useProject();

  return async (action: DockerAction): Promise<void> => {
    switch (action.type) {
      case "create":
        updateProject("docker", action.docker);
        toast.success("Docker configuration created successfully!");
        break;
      case "update":
        updateProject("docker", action.docker);
        toast.success("Docker configuration updated successfully!");
        break;
      case "delete":
        updateProject("docker", {
          content: "",
          isSaved: false,
          isStrict: false,
          parsed: {
            services: [],
            volumes: [],
            networks: [],
          },
        });
        toast.success("Docker configuration deleted successfully!");
        break;
      case "save": {
        const save_parsed = parseDockerCompose(
          project.docker.content,
          project.docker.isStrict,
          project.variables.length
        );
        if (save_parsed.isValid && save_parsed.updatedContent) {
          updateProject("docker", {
            content: save_parsed.updatedContent,
            isSaved: true,
            isStrict: project.docker.isStrict,
            parsed: {
              services: save_parsed.services,
              volumes: save_parsed.volumes,
              networks: save_parsed.networks,
            },
          });
          toast.success("Docker configuration saved");
        }
        break;
      }
      case "un-save":
        updateProject("docker", {
          ...project.docker,
          content: action.content,
          isSaved: false,
        });
        break;
      case "clear": {
        const emptyContent = yaml.dump({
          services: {},
          volumes: {},
          networks: {},
        });
        const parsedEmpty = parseDockerCompose(
          emptyContent,
          project.docker.isStrict,
          project.variables.length
        );
        if (parsedEmpty.isValid && parsedEmpty.updatedContent) {
          updateProject("docker", {
            content: parsedEmpty.updatedContent,
            isSaved: false,
            isStrict: project.docker.isStrict,
            parsed: {
              services: [],
              volumes: [],
              networks: [],
            },
          });
          toast.success("Docker configuration cleared");
        }
        break;
      }
      case "reset":
        updateProject("docker", {
          content: "",
          isSaved: false,
          isStrict: false,
          parsed: {
            services: [],
            volumes: [],
            networks: [],
          },
        });
        toast.success("Docker configuration reset successfully!");
        break;
      case "copy":
        await navigator.clipboard.writeText(project.docker.content);
        toast.success("Docker configuration file copied to clipboard");
        break;
      case "strict-toggle":
        updateProject("docker", {
          ...project.docker,
          isStrict: !project.docker.isStrict,
          isSaved: false,
        });
        toast.success(
          `Strict mode ${!project.docker.isStrict ? "enabled" : "disabled"}`
        );
        break;
      case "remove-type": {
        const content = project.docker.content;
        const parsed = yaml.load(content) as Record<string, any>;
        if (parsed && parsed[action.elementType] && parsed[action.elementType][action.name]) {
          delete parsed[action.elementType][action.name];
          const newContent = yaml.dump(parsed);
          if (action.elementType == "services" && project.docker.parsed.services.length === 1) {
            toast.error('At least one service is required');
            break;
          }
          const remove_parsed = parseDockerCompose(
            newContent,
            project.docker.isStrict,
            project.variables.length
          );
          if (remove_parsed.isValid && remove_parsed.updatedContent) {
            updateProject("docker", {
              content: remove_parsed.updatedContent,
              isSaved: false,
              isStrict: project.docker.isStrict,
              parsed: {
                services: remove_parsed.services,
                volumes: remove_parsed.volumes,
                networks: remove_parsed.networks,
              },
            });
            toast.success(`${action.elementType.slice(0, -1)} ${action.name} removed successfully!`);
          }
        }
        break;
      }
      default:
        // No-op for server-only actions
        break;
    }
  };
} 