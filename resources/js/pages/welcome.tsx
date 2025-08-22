// Necessary imports
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";

// Admin Layout
import { AppLayout } from "@/layouts/app";

// Shadcn UI components
import {
	TabsList,
	TabsContent,
	TabsTrigger,
	Tabs,
	TabsBody,
	useTabsContext,
	TabsNavigation,
} from "@/components/ui/tabs";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTrigger,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
	Card,
	CardHeader,
	CardTitle,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

// Icons
import { Sun, Moon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Example",
		href: route("welcome"),
	},
];

export default function Page() {
	const tabs = [
		{ value: "overview", label: "Overview", icon: <Moon className="h-4 w-4"/> },
		{ value: "integrations", label: "Integrations" },
		{ value: "activity", label: "Activity" },
		{ value: "domains", label: "Domains" },
		{ value: "usage", label: "Usage" },
		{ value: "monitoring", label: "Monitoring" },
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Dashboard" />
			<div className="w-full flex justify-center items-center flex-col gap-12">
				{/* Example */}
				{/* <Example /> */}

				{/* TabsNavigation */}
				<div className="flex justify-center items-center w-full ">
					<Card className="w-full max-w-[1200px] border-none shadow-none relative">
						<CardContent className="p-8">
							<Tabs
								defaultValue="activity"
								// onValueChange={handleTabChange}
								className="w-full"
							>
								<TabsNavigation tabs={tabs} />

								<TabsBody>
									<TabsContent value="overview" className="mt-6">
										<div className="p-4 text-center text-[#0e0f1199] dark:text-[#ffffff99]">
											<h3 className="text-lg font-semibold mb-2 text-[#0e0e10] dark:text-white">
												Overview
											</h3>
											<p>Contenu de l'onglet Overview</p>
										</div>
									</TabsContent>

									<TabsContent value="integrations" className="mt-6">
										<div className="p-4 text-center text-[#0e0f1199] dark:text-[#ffffff99]">
											<h3 className="text-lg font-semibold mb-2 text-[#0e0e10] dark:text-white">
												Integrations
											</h3>
											<p>Contenu de l'onglet Integrations</p>
										</div>
									</TabsContent>

									<TabsContent value="activity" className="mt-6">
										<div className="p-4 text-center text-[#0e0f1199] dark:text-[#ffffff99]">
											<h3 className="text-lg font-semibold mb-2 text-[#0e0e10] dark:text-white">
												Activity
											</h3>
											<p>Contenu de l'onglet Activity</p>
										</div>
									</TabsContent>

									<TabsContent value="domains" className="mt-6">
										<div className="p-4 text-center text-[#0e0f1199] dark:text-[#ffffff99]">
											<h3 className="text-lg font-semibold mb-2 text-[#0e0e10] dark:text-white">
												Domains
											</h3>
											<p>Contenu de l'onglet Domains</p>
										</div>
									</TabsContent>

									<TabsContent value="usage" className="mt-6">
										<div className="p-4 text-center text-[#0e0f1199] dark:text-[#ffffff99]">
											<h3 className="text-lg font-semibold mb-2 text-[#0e0e10] dark:text-white">
												Usage
											</h3>
											<p>Contenu de l'onglet Usage</p>
										</div>
									</TabsContent>

									<TabsContent value="monitoring" className="mt-6">
										<div className="p-4 text-center text-[#0e0f1199] dark:text-[#ffffff99]">
											<h3 className="text-lg font-semibold mb-2 text-[#0e0e10] dark:text-white">
												Monitoring
											</h3>
											<p>Contenu de l'onglet Monitoring</p>
										</div>
									</TabsContent>
								</TabsBody>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			</div>
		</AppLayout>
	);
}

function Example() {
}
