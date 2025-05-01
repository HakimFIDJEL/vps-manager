import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { Head } from "@inertiajs/react";

import { getStatusTitle } from "@/components/ui/placeholder-pattern";

export default function Page({ statusCode }: { statusCode: number }) {
    const statusTitle = getStatusTitle(statusCode);

    return (
        <>
            <Head title={statusTitle} />
            <PlaceholderPattern
                className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20 top-0 bottom-0"
                statusCode={statusCode}
            />
        </>
    );
}
