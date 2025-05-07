// Necessary imports
import { Link } from "@inertiajs/react";

// Shadcn ui components
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// Icons
import { Check, X, ArrowUpRight } from "lucide-react";

// Types
import { type Container } from "@/types/models/project";

export function formatDate(date: string): string {
  const opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
  return new Date(date).toLocaleString("en-US", opts);
}

export function formatTraefik(traefik_enabled: boolean) {
  return traefik_enabled
    ? <Badge variant="outline" className="flex items-center gap-2"><Check/>Enabled</Badge>
    : <Badge variant="secondary"><X/>Disabled</Badge>;
}

export function formatContainers(containers: Container[]) {
  const running = containers.filter(c => c.status === "running").length;
  const total = containers.length;
  const pct = total ? (running/total)*100 : 0;
  return (
    <Tooltip>
      <TooltipTrigger asChild><Progress value={pct} className="w-[100px]" /></TooltipTrigger>
      <TooltipContent>
        <p>{ running === total ? "All containers running" : `${running} sur ${total}` }</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function formatActions(inode: number) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={route("projects.show", { inode })}>
          <Button variant="outline" size="sm"><ArrowUpRight className="h-4 w-4"/></Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>Show project</TooltipContent>
    </Tooltip>
  );
}

export function formatSlug(string: string) {
  return string.replace(/[^A-Za-z0-9-]/g, "-").toLowerCase().replace(/--+/g, "-").replace(/^-|-$/g, "");
}

export function formatVariable(string: string) {
  return string.replace(/[^A-Za-z0-9_]/g, "_").toUpperCase().replace(/__+/g, "_");
}