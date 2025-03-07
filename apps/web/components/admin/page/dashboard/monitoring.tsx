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
import { UsageStorage } from "@/components/admin/page/dashboard/overview/usage-storage";
import { Network } from "@/components/admin/page/dashboard/overview/network";
import { Separator } from "@workspace/ui/components/separator";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

export function Monitoring({ ...props }) {

    const isMobile = useIsMobile();

    return (
        <div className="flex flex-col gap-4">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UsageRam />
                <UsageCpu />
                <UsageStorage />
            </div>
                
            <div>
                <Network />
            </div>


        </div>
    );

}