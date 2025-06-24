// Necessary imports
import React from "react";

// Shadcn ui components
import { Badge } from "@/components/ui/badge";

// Icons
import {
	OctagonMinus,
	OctagonX,
	Pause,
	Play,
	Plus,
	RotateCcw,
} from "lucide-react";

export function formatServiceImage(image: string) {
	const [name, tag] = image.split(":");
	return (
		<div className="text-xs text-muted-foreground">
			{name}
			{tag ? `:${tag}` : ""}
		</div>
	);
}

export function formatDockerDriver(driver: string, name?: string) {
	return (
		<div className="flex items-center gap-2">
			<span className="text-xs text-muted-foreground">{driver} driver</span>
			{name && name !== driver && (
				<span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
					{name}
				</span>
			)}
		</div>
	);
}

// TEMP
const stateBadgeMap: Record<
	"running" | "exited" | "created" | "restarting" | "paused" | "dead",
	JSX.Element
> = {
	running: (
		<Badge variant="default">
			<Play />
			Running
		</Badge>
	),
	exited: (
		<Badge variant="outline">
			<OctagonMinus />
			Exited
		</Badge>
	),
	created: (
		<Badge variant="secondary">
			<Plus />
			Created
		</Badge>
	),
	restarting: (
		<Badge variant="secondary">
			<RotateCcw />
			Restarting
		</Badge>
	),
	paused: (
		<Badge variant="outline">
			<Pause />
			Paused
		</Badge>
	),
	dead: (
		<Badge variant="destructive">
			<OctagonX />
			Dead
		</Badge>
	),
};

export const formatContainerState = ({
	state,
}: {
	state: keyof typeof stateBadgeMap;
}) => {
	return stateBadgeMap[state] ?? <Badge variant="outline">Unknown state</Badge>;
};

export function formatContainerDate({ date }: { date: string }): string {
	const opts: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	};
	return new Date(date).toLocaleString("en-US", opts);
}

export function formatContainerPort({
	mapping,
}: {
	mapping: string;
}): React.ReactNode {
	const formatMapping = (mappingStr: string) => {
		const match = mappingStr.match(/(\d+)\/(tcp|udp)\s*->\s*([^:]+):(\d+)/);
		if (!match) return mappingStr;

		const [, containerPort, protocol, hostIp, hostPort] = match;
		const host = hostIp === "0.0.0.0" ? "localhost" : hostIp;

		return { containerPort, host, hostPort };
	};

	const parsed = formatMapping(mapping);

	if (typeof parsed === "string") {
		if (parsed.length == 0) {
			return (
				<span className="font-mono text-sm text-muted-foreground">Unkown</span>
			);
		}
		return (
			<span className="font-mono text-sm text-muted-foreground">{parsed}</span>
		);
	}

	return (
		<div className="inline-flex items-center gap-2 font-mono text-sm">
			<span className="text-foreground font-medium">{parsed.containerPort}</span>
			<span className="text-muted-foreground">→</span>
			<span className="text-muted-foreground">
				{parsed.host}:{parsed.hostPort}
			</span>
		</div>
	);
}
