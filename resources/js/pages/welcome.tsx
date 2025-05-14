// Necessary imports
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

// Admin Layout
import { AdminLayout } from "@/components/layouts/admin-layout";

// Shadcn UI components
import { TabsList, TabsContent, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTrigger,
	AlertDialogFooter,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function Example() {
	const [ref] = useAutoAnimate<HTMLDivElement>({
		duration: 300,
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={"outline"}>Open Dialog</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<Tabs>
					<TabsList className="w-full">
						<TabsTrigger value="tab1">Tab 1</TabsTrigger>
						<TabsTrigger value="tab2">Tab 2</TabsTrigger>
					</TabsList>
					{/* My TabsBody component */}
					<div ref={ref} className="relative overflow-hidden">
						<TabsContent value="tab1">
							<div className="h-32 bg-muted rounded-md p-4">Short content</div>
						</TabsContent>
						<TabsContent value="tab2">
							<div className="h-64 bg-muted rounded-md p-4">Tall content</div>
						</TabsContent>
					</div>
				</Tabs>
				<AlertDialogFooter>
					<AlertDialogCancel>Close</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Example",
		href: route("welcome"),
	},
];

export default function Page() {
	return (
		<AdminLayout breadcrumbs={breadcrumbs}>
			<Head title="Dashboard" />
			<div className="w-full h-full flex justify-center items-center">
				<Example />
			</div>
		</AdminLayout>
	);
}
