// Necessary imports
import Link from "next/link";
import { useConfirm } from '@omit/react-confirm-dialog'

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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";

// Icons
import {
  ArrowDownUp,
  ArrowUpRight,
  ChevronsLeftRightEllipsis,
  NetworkIcon,
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
  Settings2,
  Cross,
  X,
} from "lucide-react";

const networkRequests = [
  {
    timestamp: "2025-03-07 14:23:45",
    sourceIP: "192.168.1.10",
    destinationIP: "10.0.0.5",
    protocol: "HTTPS",
    status: "success",
    responseTime: "120ms",
  },
  {
    timestamp: "2025-03-07 14:23:50",
    sourceIP: "192.168.1.11",
    destinationIP: "10.0.0.8",
    protocol: "HTTP",
    status: "client-error",
    responseTime: "98ms",
  },
  {
    timestamp: "2025-03-07 14:23:55",
    sourceIP: "192.168.1.12",
    destinationIP: "10.0.0.3",
    protocol: "SSH",
    status: "success",
    responseTime: "85ms",
  },
  {
    timestamp: "2025-03-07 14:24:00",
    sourceIP: "192.168.1.15",
    destinationIP: "10.0.0.7",
    protocol: "FTP",
    status: "server-error",
    responseTime: "200ms",
  },
  {
    timestamp: "2025-03-07 14:24:05",
    sourceIP: "192.168.1.20",
    destinationIP: "10.0.0.10",
    protocol: "DNS",
    status: "success",
    responseTime: "45ms",
  },
];

const activeConnections = [
  {
    sourceIP: "192.168.1.32",
    destinationIP: "10.0.0.22",
    protocol: "SSH",
    sourcePort: 60123,
    destinationPort: 22,
    status: "Established",
    process: "sshd",
  },
  {
    sourceIP: "192.168.1.40",
    destinationIP: "10.0.0.25",
    protocol: "FTP",
    sourcePort: 54230,
    destinationPort: 21,
    status: "Established",
    process: "vsftpd",
  },
  {
    sourceIP: "192.168.1.50",
    destinationIP: "10.0.0.30",
    protocol: "OpenVPN",
    sourcePort: 1194,
    destinationPort: 1194,
    status: "Established",
    process: "openvpn",
  },
];

const networkTraffic = [
  {
    interface: "eth0",
    incomingBandwidth: "125 Mbps",
    outgoingBandwidth: "98 Mbps",
    packetsSent: 32000,
    packetsReceived: 28900,
  },
  {
    interface: "wlan0",
    incomingBandwidth: "75 Mbps",
    outgoingBandwidth: "60 Mbps",
    packetsSent: 21000,
    packetsReceived: 19500,
  },
];

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

export function Network() {

  const confirm = useConfirm()

  async function handleCloseConnextion (index: number) {

    console.log('index', index)

    const isConfirmed = await confirm({
      title: 'Close connexion',
      description: 'Are you sure you want to close this connexion?',
      icon: <X className="size-4 text-destructive" />,
      confirmText: 'Close connexion',
      cancelText: 'Cancel',
      cancelButton: {
        size: 'default',
        variant: 'outline'
      },
      confirmButton: {
        variant: 'destructive',
      },
      alertDialogTitle: {
        className: 'flex items-center gap-2'
      },
      alertDialogFooter: {
        className: 'gap-2'
      },
    })

    if (isConfirmed) {

    }
  }

  function formatDate(date: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    return new Date(date).toLocaleDateString("en-US", options);
  }

  function formatStatus(status: string) {
    switch (status) {
      case "success":
        return <Badge variant="default">Success</Badge>;
        break;

      case "client-error":
        return <Badge variant="secondary">Client Error</Badge>;
        break;

      case "server-error":
        return <Badge variant="destructive">Server Error</Badge>;
        break;

      default:
        return <Badge variant="outline">Unknown</Badge>;
        break;
    }
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <Tabs
        defaultValue="requests"
        className="h-full w-full md:w-auto gap-4 flex flex-col md:col-span-8 col-span-12"
      >
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/50">
            <div>
              <CardTitle className="flex items-center gap-2">
                <NetworkIcon className="h-5 w-5 text-primary" />
                Network
              </CardTitle>
              <CardDescription>
                Overview of the network activity
              </CardDescription>
            </div>
            <Link href="">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" className="h-8 w-8  md:h-7 md:w-7">
                    <ArrowUpRight />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>See details</p>
                </TooltipContent>
              </Tooltip>
            </Link>
          </CardHeader>

          <Separator className="md:mb-6 mb-2" />

          <CardContent className="flex flex-col gap-4">
            <TabsList className="w-full flex gap-2">
              <TabsTrigger
                value="requests"
                className="w-full px-3 flex items-center gap-2"
              >
                <ArrowDownUp size={16} />
                Requests
              </TabsTrigger>
              <TabsTrigger
                value="connexions"
                className="w-full px-3 flex items-center gap-2"
              >
                <ChevronsLeftRightEllipsis size={16} />
                Connexions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="requests">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                    <TableHead className="whitespace-nowrap">Source IP</TableHead>
                    <TableHead className="whitespace-nowrap">Destination IP</TableHead>
                    <TableHead className="whitespace-nowrap">Protocol</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Response Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {networkRequests.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell className="whitespace-nowrap">{formatStatus(request.status)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(request.timestamp)}</TableCell>
                      <TableCell className="whitespace-nowrap">{request.sourceIP}</TableCell>
                      <TableCell className="whitespace-nowrap">{request.destinationIP}</TableCell>
                      <TableCell className="whitespace-nowrap">{request.protocol}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {request.responseTime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="connexions">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Process</TableHead>
                    <TableHead className="whitespace-nowrap">Source IP</TableHead>
                    <TableHead className="whitespace-nowrap">Destination IP</TableHead>
                    <TableHead className="whitespace-nowrap">Source Port</TableHead>
                    <TableHead className="whitespace-nowrap">Destination Port</TableHead>
                    <TableHead className="whitespace-nowrap">Protocol</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Close</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeConnections.map((conn, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="default">{conn.status}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{conn.process}</TableCell>
                      <TableCell className="whitespace-nowrap">{conn.sourceIP}</TableCell>
                      <TableCell className="whitespace-nowrap">{conn.destinationIP}</TableCell>
                      <TableCell className="whitespace-nowrap">{conn.sourcePort}</TableCell>
                      <TableCell className="whitespace-nowrap">{conn.destinationPort}</TableCell>
                      <TableCell className="whitespace-nowrap"><Badge variant="secondary">{conn.protocol}</Badge></TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button size="icon" variant="destructive" className="h-6 w-6" onClick={() => handleCloseConnextion(index)}>
                          <X />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <Card className="shadow-sm md:col-span-4 col-span-12 overflow-hidden">
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
    </div>
  );
}
