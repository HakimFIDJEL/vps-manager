// Necessary imports
import { useEffect, useState } from "react";

// Shadcn Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";

// Components
import { Tracker } from "@workspace/ui/components/tracker";

// Icons
import { AudioLines, Server } from "lucide-react";
interface StatusSegment {
  online: boolean;
  timestamp: Date;
}

export function ProjectsTracker({ className }: { className?: string }) {
  const [segments, setSegments] = useState<StatusSegment[]>([]);

  useEffect(() => {
    const now = Date.now();
    const data = Array(48)
      .fill(null)
      .map((_, i) => {
        const forcedOffline = i >= 20 && i <= 25;
        return {
          online: forcedOffline ? false : Math.random() > 0.05,
          timestamp: new Date(now - (47 - i) * 30 * 60 * 1000),
        };
      });
    setSegments(data);
  }, []);

  return (
    <Card className={`shadow-sm  overflow-hidden ${className}  h-max`} gradient>
      <CardHeader className="bg-muted/50 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AudioLines className="text-primary" />
            Projects Tracker
          </CardTitle>

          <CardDescription>Track the uptime of your projects</CardDescription>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary">
          Live
        </Badge>
      </CardHeader>

      <Separator className="md:mb-6 mb-2" />

      <CardDescription className="p-6 pt-0">
        <Tracker serverName="example.com" segments={segments} />
        <Separator className="mb-4" />
        <Tracker serverName="example.com" segments={segments} />
        <Separator className="mb-4" />
        <Tracker serverName="example.com" segments={segments} />
      </CardDescription>
    </Card>
  );
}
