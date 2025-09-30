// pages/auth/login.tsx

// Necessary imports
import { Head, useForm } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import * as React from "react";

// Layout
import { AuthLayout } from "@/layouts/auth";

// Shadcn UI components
import { Card, CardContent } from "@/components/ui/card";

// Custom components
import { SmoothItem } from "@/components/ui/smooth-resized";
import { Logo } from "@/components/layouts/app/logo";
import { AppForm } from "@/components/page/auth/app-form";

export default function Login({ className, ...props }: { className?: string }) {
	return (
		<AuthLayout>
			<Head title="Login" />
			<div className={cn("flex flex-col gap-6", className)} {...props}>
				<SmoothItem delay={0.1}>
					<Card className="overflow-hidden p-0">
						<CardContent className="grid p-0 md:grid-cols-2">
							<AppForm />
							<div className="relative hidden md:block dark:border-primary border-border border-l bg-gradient-to-r  dark:from-primary/15 from-muted to-primary/70 ">
								<Logo variant="default" color_scheme={"white"} className="absolute bottom-4 right-5 text-white " />
							</div>
						</CardContent>
					</Card>
				</SmoothItem>
				<SmoothItem delay={0.3}>
					<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 font-thin">
						By clicking "Login", you acknowledge that the application may require some
						root privileges to function correctly. Please ensure your VPS user has the
						necessary permissions as described in the README.
					</div>
				</SmoothItem>
			</div>
		</AuthLayout>
	);
}
