import { z } from "zod";
import { type Variable } from "@/types/models/variable";
import { type DockerComposeState } from "@/types/models/docker";
import { type Command } from "@/types/models/command";
// Types
export type Project = {
	name: string;
	folderPath: string;
	variables: Variable[];
	commands: Command[];
	docker: DockerComposeState;
	makefile: {
		content: string;
		isSaved: boolean;
	};
};

export type ProjectContextType = {
	project: Project;
	setProject: React.Dispatch<React.SetStateAction<Project>>;
	updateProject: <K extends keyof Project>(key: K, value: Project[K]) => void;
};

export const DEFAULT_PROJECT: Project = {
	name: "",
	folderPath: "",
	variables: [],
	commands: [],
	docker: {
		content: "",
		isSaved: true,
		parsed: {
			services: [],
			volumes: [],
			networks: []
		}
	},
	makefile: {
		content: "",
		isSaved: true
	}
};

export type Container = {
	name: string;
	image: string;
	status: string;
	updated_at: string;
	created_at: string;
};

