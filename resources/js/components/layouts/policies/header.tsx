// components/layouts/policies/header.tsx

// Necessary imports
import { Link } from "@inertiajs/react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";

// Icons
import { ArrowLeft } from "lucide-react";

export function Header() {
    return (
        <nav>
            <Button asChild variant={"link"} className="text-foreground !px-0">
                <Link href={route('home')}>
                    <ArrowLeft />
                    Go back to home
                </Link>
            </Button>
        </nav>
    )
}