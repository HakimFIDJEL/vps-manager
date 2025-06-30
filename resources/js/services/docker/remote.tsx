import { useProject } from "@/contexts/project-context";
import { toast } from "sonner";
import yaml from "js-yaml";
import { parseDockerCompose } from "@/lib/docker/parser";
import type { DockerAction } from "@/lib/docker/type";

export function useDockerActionsRemote() {
  const { project, updateProject } = useProject();

  return async (action: DockerAction): Promise<void> => {
    switch (action.type) {
      case "create":
        // TODO: Server call not necessary
        updateProject("docker", action.docker);
        toast.success("Docker configuration created successfully!");
        break;
      case "update":
        // TODO: Server call not necessary
        updateProject("docker", action.docker);
        toast.success("Docker configuration updated successfully!");
        break;
      case "delete":
        // TODO: Server call not necessary
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

        
        toast.info("Saving docker configuration...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // TODO: Replace with real server call
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
        } else {
          // toast.error("Invalid docker configuration");
          // Error toast already sent in parseDockerCompose
        }

        break;
      }
      case "un-save":
        // TODO: Server call not necessary
        updateProject("docker", {
          ...project.docker,
          content: action.content,
          isSaved: false,
        });
        break;
      case "clear": {
        // TODO: Server call not necessary
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
        // TODO: Server call not necessary
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
        // TODO: Server call not necessary
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
        // TODO: Server call not necessary
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
      case "run":
        // TODO: Replace with real server call
        toast.info("Running all containers...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("All containers are successfully running!");
        break;
      case "stop":
        // TODO: Replace with real server call
        toast.info("Stopping all containers...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("All containers are successfully stopped!");
        break;
      case "remove":
        // TODO: Replace with real server call
        toast.info("Removing all containers...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("All containers are successfully removed!");
        break;
      case "prune":
        // TODO: Replace with real server call
        toast.info("Pruning...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("The system has been successfully pruned!");
        break;
      case "container-run":
        // TODO: Replace with real server call
        toast.info(`Running container ${action.container_id}...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Container is successfully running!");
        break;
      case "container-stop":
        // TODO: Replace with real server call
        toast.info(`Stopping container ${action.container_id}...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Container is successfully stopped!");
        break;
      case "container-restart":
        // TODO: Replace with real server call
        toast.info(`Restarting container ${action.container_id}...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Container is successfully restarting!");
        break;
      case "container-remove":
        // TODO: Replace with real server call
        toast.info(`Removing container ${action.container_id}...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success("Container is successfully removing!");
        break;
      default:
        break;
    }
  };
} 