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



export function Network({ className }: { className?: string }) {

  const confirm = useConfirm()

  async function handleCloseConnextion (index: number) {

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
      <Tabs
        defaultValue="requests"
        className={`h-full w-full md:w-auto gap-4 flex flex-col ${className}`}
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

      
  );
}
