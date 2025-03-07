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
import {
  ArrowDownUp,
  ArrowUpRight,
  ChevronsLeftRightEllipsis,
  NetworkIcon,
  Activity, Clock, Database, Globe, HardDrive, RefreshCw, Server, Wifi,
  ArrowUp,
  ArrowDown,
  Settings2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

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

export function Network() {
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
        className="h-full w-full md:w-auto gap-4 flex flex-col col-span-8"
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
              <Button size="sm">
                View All
                <ArrowUpRight />
              </Button>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Source IP</TableHead>
                    <TableHead>Destination IP</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead className="text-right">Response Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {networkRequests.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatStatus(request.status)}</TableCell>
                      <TableCell>{formatDate(request.timestamp)}</TableCell>
                      <TableCell>{request.sourceIP}</TableCell>
                      <TableCell>{request.destinationIP}</TableCell>
                      <TableCell>{request.protocol}</TableCell>
                      <TableCell className="text-right">
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
                    <TableHead>Process</TableHead>
                    <TableHead>Source IP</TableHead>
                    <TableHead>Destination IP</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Source Port</TableHead>
                    <TableHead>Destination Port</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeConnections.map((conn, index) => (
                    <TableRow key={index}>
                      <TableCell>{conn.process}</TableCell>
                      <TableCell>{conn.sourceIP}</TableCell>
                      <TableCell>{conn.destinationIP}</TableCell>
                      <TableCell>{conn.protocol}</TableCell>
                      <TableCell>{conn.sourcePort}</TableCell>
                      <TableCell>{conn.destinationPort}</TableCell>
                      <TableCell>
                        <Badge variant="default">{conn.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      <Card className="shadow-sm col-span-4 overflow-hidden">


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
          <div className="grid grid-cols-2 gap-3">

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>Avg. Response Time</span>
              </div>
              <p className="text-xl font-semibold">42ms</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Activity className="h-3.5 w-3.5 mr-1" />
                <span>Error Rate</span>
              </div>
              <p className="text-xl font-semibold">2.4%</p>
            </div>

            <Separator className="col-span-2" />

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Wifi className="h-3.5 w-3.5 mr-1" />
                <span>Packet Loss</span>
              </div>
              <p className="text-xl font-semibold">0.1%</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                <span>Last Restart</span>
              </div>
              <p className="text-xl font-semibold">3d ago</p>
            </div>

            <Separator className="col-span-2" />

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Database className="h-3.5 w-3.5 mr-1" />
                <span>Active Connections</span>
              </div>
              <p className="text-xl font-semibold">1,248</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <HardDrive className="h-3.5 w-3.5 mr-1" />
                <span>Network Throughput</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center text-xs gap-1">
                  <ArrowDown size="14"/> 42MB/s
                </Badge>
                <Badge variant="outline" className="flex items-center text-xs gap-1">
                  <ArrowUp size="14" /> 18MB/s
                </Badge>
              </div>
            </div>

            <Separator className="col-span-2" />

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-3.5 w-3.5 mr-1" />
                <span>Public IP</span>
              </div>
              <p className="text-xl font-semibold font-mono">192.168.1.1</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Server className="h-3.5 w-3.5 mr-1" />
                <span>Requests (Last Hour)</span>
              </div>
              <p className="text-xl font-semibold">24,892</p>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Link href="" className="w-full">
            <Button className="w-full" variant="secondary">
              Go to Settings
              <Settings2 />
            </Button>
          </Link>
        </CardFooter>

      </Card>
    </div>
  );
}
