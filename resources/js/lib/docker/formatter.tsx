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

	// On garde seulement la partie ISO + timezone numérique
	const clean = date.replace(/ \w+$/, ""); // supprime " CEST"
	return new Date(clean).toLocaleString("en-US", opts);
}


export function formatContainerPort({ mapping }: { mapping: string }): React.ReactNode {
	const parseMapping = (mappingStr: string) => {
		// Exemple attendu : "0.0.0.0:8080->80/tcp"
		const match = mappingStr.trim().match(/^([^:]+):(\d+)->(\d+)\/(tcp|udp)$/);
		if (!match) return null;

		const [, hostIp, hostPort, containerPort, protocol] = match;
		const host = hostIp === "0.0.0.0" ? "localhost" : hostIp;
		return { containerPort, host, hostPort, protocol };
	};

	if (!mapping || mapping.trim().length === 0) {
		return <span className="font-mono text-sm text-muted-foreground">Unknown</span>;
	}

	const parts = mapping.split(/,\s*/);
	const parsedList = parts.map(parseMapping);

	return (
		<div className="flex flex-col gap-1 font-mono text-sm">
			{parsedList.map((p, i) =>
				p ? (
					<div key={i} className="inline-flex items-center gap-2">
						<span className="text-foreground font-medium">{p.containerPort}/{p.protocol}</span>
						<span className="text-muted-foreground">→</span>
						<span className="text-muted-foreground">
							{p.host}:{p.hostPort}
						</span>
					</div>
				) : (
					<span key={i} className="text-muted-foreground">{parts[i]}</span>
				)
			)}
		</div>
	);
}
