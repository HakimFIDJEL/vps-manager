"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@workspace/ui/components/card"

import { UsageCpu } from "@/components/admin/page/dashboard/overview/usage-cpu";
import { UsageRam } from "@/components/admin/page/dashboard/overview/usage-ram";
import { Storage } from "@/components/admin/page/dashboard/overview/storage";
import { Network } from "@/components/admin/page/dashboard/overview/network";
import { Separator } from "@workspace/ui/components/separator";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

export function Overview({ ...props }) {

    const isMobile = useIsMobile();

    return (
        <div className="flex flex-col gap-2">
            <Card className="shadow-sm" {...props}>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>Overview of the server</CardDescription>
                    <Separator/>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <UsageRam />
                        <UsageCpu />
                        <Network />
                    </div>
                    <Separator  />
                    <div>
                        <Storage />
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm" {...props}>
                <CardHeader>
                    <CardTitle>Monitoring</CardTitle>
                    <CardDescription>Overview of the server</CardDescription>
                    <Separator/>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                </CardContent>
            </Card>
        </div>
    );

}