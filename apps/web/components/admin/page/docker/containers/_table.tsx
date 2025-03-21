"use client";

// Necessary imports
import Link from "next/link";
import { useConfirm } from "@omit/react-confirm-dialog";

// Shadcn Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";

import { DataTable } from "@workspace/ui/components/data-table";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

// Icons
import {
  ArrowDownUp,
  ArrowUpRight,
  ChevronsLeftRightEllipsis,
  CircleDashed,
  CirclePause,
  CirclePlay,
  CircleSlash,
  Container,
  MoreHorizontal,
  NetworkIcon,
  Plus,
  Trash2,
  X,
} from "lucide-react";

// Custom components
import { useLoader } from "@/lib/loader";

// Type pour les données
interface Container {
  id: string;
  project: string;
  status: "running" | "stopped" | "paused" | "pending";
  name: string;
  image: string;
  ports: string | null;
  uptime: string | null;
}

const containers: Container[] = [
  {
    id: "c1a2b3",
    project: "portfolio",
    name: "nginx_front",
    image: "nginx:latest",
    status: "pending",
    ports: "80:80",
    uptime: "3h 12m",
  },
  {
    id: "d4e5f6",
    project: "jcoaching",
    name: "postgres_db",
    image: "postgres:15",
    status: "running",
    ports: "5432:5432",
    uptime: "6h 23m",
  },
  {
    id: "g7h8i9",
    project: "jcoaching",
    name: "redis_cache",
    image: "redis:7-alpine",
    status: "paused",
    ports: "6379:6379",
    uptime: "1h 05m",
  },
  {
    id: "j0k1l2",
    project: "bcm",
    name: "node_backend",
    image: "node:18",
    status: "running",
    ports: "3000:3000",
    uptime: "2h 44m",
  },
  {
    id: "m3n4o5",
    project: "bcm",
    name: "python_worker",
    image: "python:3.11",
    status: "running",
    ports: null,
    uptime: "8h 02m",
  },
  {
    id: "p6q7r8",
    project: "portfolio",
    name: "mongo_db",
    image: "mongo:6",
    status: "paused",
    ports: "27017:27017",
    uptime: "47m",
  },
  {
    id: "s9t0u1",
    project: "mailer",
    name: "mail_server",
    image: "mailhog/mailhog",
    status: "running",
    ports: "8025:8025",
    uptime: "11h 19m",
  },
  {
    id: "v2w3x4",
    project: "legacy-api",
    name: "php_fpm",
    image: "php:8.2-fpm",
    status: "stopped",
    ports: null,
    uptime: null,
  },
  {
    id: "y5z6a7",
    project: "admin",
    name: "adminer_ui",
    image: "adminer",
    status: "running",
    ports: "8080:8080",
    uptime: "4h 20m",
  },
  {
    id: "b8c9d0",
    project: "infra",
    name: "api_gateway",
    image: "traefik:v3",
    status: "running",
    ports: "443:443, 80:80",
    uptime: "13h 55m",
  },
  {
    id: "e1f2g3",
    project: "legacy-api",
    name: "queue_processor",
    image: "custom/queue:latest",
    status: "paused",
    ports: null,
    uptime: "2h 01m",
  },
  {
    id: "h4i5j6",
    project: "monitoring",
    name: "grafana_monitoring",
    image: "grafana/grafana",
    status: "running",
    ports: "3001:3000",
    uptime: "9h 48m",
  },
];

export function ContainersTable() {
  const confirm = useConfirm();
  const { showLoader, hideLoader } = useLoader();

  async function handleConfirmStop(callback: () => void) {
    const isConfirmed = await confirm({
      title: "Stop container(s)",
      description: "Are you sure you want to stop the container(s)?",
      icon: <CircleSlash className="size-4 text-destructive" />,
      confirmText: "Stop container(s)",
      cancelText: "Cancel",
      cancelButton: {
        size: "default",
        variant: "outline",
      },
      confirmButton: {
        variant: "destructive",
      },
      alertDialogTitle: {
        className: "flex items-center gap-2",
      },
      alertDialogFooter: {
        className: "gap-2",
      },
    });

    if (isConfirmed) {
      callback();
    }
  }

  function formatProject(project: string) {
    return <Badge variant="outline">{project}</Badge>;
  }

  function formatStatus(status: string) {
    const statusVariants = {
      running: "default",
      stopped: "destructive",
      paused: "outline",
      pending: "outline",
    } as const;

    const statusIcons = {
      running: <CirclePlay className="h-4 w-4" />,
      stopped: <CircleSlash className="h-4 w-4" />,
      paused: <CirclePause className="h-4 w-4" />,
      pending: <CircleDashed className="h-4 w-4" />,
    };

    return (
      <Badge
        variant={
          statusVariants[status as keyof typeof statusVariants] || "default"
        }
        className="flex w-max gap-1 items-center"
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
        {statusIcons[status as keyof typeof statusIcons]}
      </Badge>
    );
  }

  // Définition des colonnes
  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      searchable: true,
      render: (value: string) => <span className="font-medium">{value}</span>,
    },
    {
      key: "project",
      label: "Project",
      sortable: true,
      searchable: true,
      render: (value: string) => formatProject(value),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => formatStatus(value),
    },
    { key: "name", label: "Name", sortable: true, searchable: true },
    { key: "image", label: "Image", sortable: true, searchable: true },
    { key: "ports", label: "Ports" },
    { key: "uptime", label: "Uptime", sortable: true },
  ];

  // Actions pour chaque ligne
  function renderActions(container: Container) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>View details</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCopyId(container)}>
            Copy container ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Controls</DropdownMenuLabel>
          <DropdownMenuItem>
            {container.status === "running" ? "Pause" : "Start"} container
          </DropdownMenuItem>
          <DropdownMenuItem>Restart container</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleConfirmStop(() => handleStop(container))}
          >
            Stop container
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function handleCopyId(container: Container) {
    navigator.clipboard.writeText(container.id);
  }

  function handleRestart(Container: Container) {
    // logique ici
  }

  function handleStop(Container: Container) {
    // logique ici
    showLoader();

    setTimeout(() => {
      hideLoader();
    }, 2000);
  }

  function handleStopAll(containers: Container[]) {
    containers.forEach((container) => {
      handleStop(container);
    });
  }

  function renderRowSelection(containers: Container[]) {
    return (
      <Button
        onClick={() => handleConfirmStop(() => handleStopAll(containers))}
        variant="destructive"
        size="sm"
        disabled={containers.length === 0}
        className="md:w-auto w-full"
      >
        Stop containers
        <CircleSlash />
      </Button>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/50">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Container className="h-5 w-5 text-primary" />
            Containers
          </CardTitle>
          <CardDescription>Manage your containers</CardDescription>
        </div>
        {/* <Link href="">
          <Button size="sm">
            Create container
            <Plus />
          </Button>
        </Link> */}
      </CardHeader>

      <Separator className="md:mb-6 mb-2" />

      <CardContent className="flex flex-col gap-4">
        <DataTable
          data={containers}
          columns={columns}
          pageSize={5}
          actions={renderActions}
          searchColumn="name"
          rowSelection={{
            enable: true,
            component: renderRowSelection,
          }}
        />
      </CardContent>
    </Card>
  );
}
