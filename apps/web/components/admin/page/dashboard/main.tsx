"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card"

import { UsageCpu } from "@/components/admin/page/dashboard/components/usage-cpu";
import { UsageRam } from "@/components/admin/page/dashboard/components/usage-ram";
import { UsageStorage } from "@/components/admin/page/dashboard/components/usage-storage";
import { Network } from "@/components/admin/page/dashboard/components/network";
import { Summary } from "@/components/admin/page/dashboard/components/summary";
import { ProjectsTracker } from "@/components/admin/page/dashboard/components/projectstracker";
import { Separator } from "@workspace/ui/components/separator";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

export function Dashboard({ ...props }) {

    const isMobile = useIsMobile();

    return (
        <div className="flex flex-col gap-4">



            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <UsageRam />
                <UsageCpu />
                <UsageStorage />
            </div>
            
            <div className="grid grid-cols-12 gap-4">
                <Network className="col-span-12" />
            </div>
            
            <div className="grid grid-cols-12 gap-4">
                <ProjectsTracker className="md:col-span-8 col-span-12" />
                <Summary className="md:col-span-4 col-span-12" />
             </div>
                
                


        </div>
    );

}