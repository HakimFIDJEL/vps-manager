"use client";

import { CheckCircle, Globe } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

import { cn } from "@workspace/ui/lib/utils";

interface StatusSegment {
  online: boolean;
  timestamp: Date;
}

interface TrackerProps {
  serverName: string;
  segments?: StatusSegment[];
  className?: string;
}

export function Tracker({
  serverName,
  segments: initialSegments,
  className,
}: TrackerProps) {
  // Utiliser les segments fournis ou générer des segments aléatoires
  const segments = initialSegments || generateRandomStatus();

  // Calculer le pourcentage d'uptime
  const uptimePercentage = calculateUptimePercentage(segments);

  function calculateUptimePercentage(segments: StatusSegment[]): number {
    const onlineCount = segments.filter((segment) => segment.online).length;
    return (onlineCount / segments.length) * 100;
  }

  function generateRandomStatus(): StatusSegment[] {
    const segments: StatusSegment[] = [];
    const now = new Date();

    // Générer 48 segments (30 minutes chacun pour 24 heures)
    for (let i = 0; i < 48; i++) {
      const timestamp = new Date(now.getTime() - (47 - i) * 30 * 60 * 1000);
      // 95% de chance d'être en ligne pour un uptime réaliste
      const online = Math.random() > 0.05;
      segments.push({ online, timestamp });
    }

    return segments;
  }

  return (
    <div className={cn("mx-4 mb-4 rounded-lg", className)}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Globe className="text-primary h-5 w-5" />
          <span className="font-medium text-foreground">{serverName}</span>
        </div>
        <div className="text-muted-foreground">
          {uptimePercentage.toFixed(1)}% uptime
        </div>
      </div>

      <div className="flex gap-[2px]">
        {segments.map((segment, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "h-8 flex-1 rounded-sm transition-all",
                  segment.online ? "bg-primary" : "bg-secondary"
                )}
              />
            </TooltipTrigger>
            <TooltipContent className={`${segment.online ? "bg-primary" : "bg-secondary text-foreground"}`}>
              <p>
                {segment.online ? "Online" : "Offline"} at{" "}
                {segment.timestamp.toLocaleTimeString()}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
