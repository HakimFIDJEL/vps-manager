// Necessary imports
import Link from "next/link";
import { useConfirm } from '@omit/react-confirm-dialog'

// Shadcn Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";


import { Badge } from "@workspace/ui/components/badge";

// Icons
import {
  Activity,
  Clock,
  Database,
  Globe,
  HardDrive,
  RefreshCw,
  Server,
  Wifi,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface WidgetServerProps {
  title: string;
  value: React.ReactNode
  icon: React.ReactNode;
}

function WidgetServer({ title, value, icon }: WidgetServerProps) {
  return (
    <div className="space-y-1 col-span-2 md:col-span-1 flex flex-col items-center md:items-start">
      <div className="flex items-center text-sm text-muted-foreground">
        {icon}
        <span>{title}</span>
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

export function Summary({ className }: { className?: string }) {
    return (
        <Card className={`shadow-sm  overflow-hidden ${className}`} gradient>
        <CardHeader className="bg-muted/50 flex flex-row justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Server className="text-primary" />
              Server Summary
            </CardTitle>

            <CardDescription>
              Key metrics about network activity
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            Live
          </Badge>
        </CardHeader>

        <Separator className="md:mb-6 mb-2" />

        <CardContent className="pt-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">

            <WidgetServer
              title="Avg. Response Time"
              value="42ms"
              icon={<Clock className="h-3.5 w-3.5 mr-1" />}
            />

            <Separator className="col-span-2 block md:hidden" />

            <WidgetServer
              title="Error Rate"
              value="2.4%"
              icon={<Activity className="h-3.5 w-3.5 mr-1" />}
            />

            <Separator className="col-span-2" />

            <WidgetServer
              title="Packet Loss"
              value="0.1%"
              icon={<Wifi className="h-3.5 w-3.5 mr-1" />}
            />
            
            <Separator className="col-span-2 block md:hidden" />

            <WidgetServer
              title="Last Restart"
              value="3d ago"
              icon={<RefreshCw className="h-3.5 w-3.5 mr-1" />}
            />

            <Separator className="col-span-2" />

            <WidgetServer
              title="Active Connections"
              value="1,248"
              icon={<Database className="h-3.5 w-3.5 mr-1" />}
            />

            <Separator className="col-span-2 block md:hidden" />

            <WidgetServer
              title="Network Throughput"
              value={
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant="outline"
                    className="flex items-center text-xs gap-1"
                  >
                    <ArrowDown size="14" /> 42MB/s
                  </Badge>
                  <Badge
                    variant="outline"
                    className="flex items-center text-xs gap-1"
                  >
                    <ArrowUp size="14" /> 18MB/s
                  </Badge>
                </div>
              }
              icon={<HardDrive className="h-3.5 w-3.5 mr-1" />}
            />

            <Separator className="col-span-2" />

            <WidgetServer
              title="Public IP"
              value={<div className="font-mono">192.168.1.1</div>}
              icon={<Globe className="h-3.5 w-3.5 mr-1" />}
            />

            <Separator className="col-span-2 block md:hidden" />

            <WidgetServer
              title="Requests (Last Hour)"
              value="24,892"
              icon={<Server className="h-3.5 w-3.5 mr-1" />}
            />

          </div>
        </CardContent>
      </Card>
    );
}