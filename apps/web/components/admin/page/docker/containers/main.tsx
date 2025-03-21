import { Widgets } from "@/components/admin/page/docker/containers/_widgets";
import { ContainersTable } from "@/components/admin/page/docker/containers/_table";


export function Containers() {
    return (
        <div className="flex flex-col gap-4">
            <Widgets />
            <ContainersTable />
        </div>
    )
}