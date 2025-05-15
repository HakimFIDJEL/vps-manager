// Types de base pour le design
export type DockerAction = {
  title: string;
  description: string;
  icon: React.ReactNode;
  actions: {
    title: string;
    icon: React.ReactNode;
  }[];
};

export type DockerService = {
  name: string;
  image: string;
  status: string;
};

export type DockerVolume = {
  name: string;
  driver: string;
};

export type DockerNetwork = {
  name: string;
  driver: string;
};
