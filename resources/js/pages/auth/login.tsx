// Necessary imports
import { Head, useForm } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import * as React from "react";

// Layout
import { AuthLayout } from "@/layouts/auth";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Icons
import { Lock, LogIn, User, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/layouts/logo";

export default function Page({ className, ...props }: { className?: string }) {
	const { data, setData, processing, errors, post } = useForm({
		username: "",
		password: "",
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const key = event.target.name;
		const value = event.target.value;
		setData((prevData) => ({ ...prevData, [key]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			post(route("auth.login", data));
		} catch (error) {
			toast.error("An error occured");
		}
	};

	React.useEffect(() => {
		if (Object.keys(errors).length === 0) return;

		Object.values(errors).forEach((error) => {
			toast.error(error);
		});

		return () => {
			setData((prevData) => ({ ...prevData, errors: {} }));
		};
	}, [errors]);

	return (
		<AuthLayout>
			<Head title="Login" />
			<div className={cn("flex flex-col gap-6", className)} {...props}>
				<Card className="overflow-hidden p-0">
					<CardContent className="grid p-0 md:grid-cols-2">
						<form className="p-6 md:p-8" onSubmit={(e) => handleSubmit(e)}>
							<div className="flex flex-col gap-4">
								<div className="flex flex-col items-center text-center">
									<h1 className="text-2xl font-normal">Welcome back!</h1>
									<p className="text-muted-foreground font-light">
										Manage your projects with ease.
									</p>
								</div>
								<div className="grid gap-2 mt-1">
									<Label htmlFor="username">Username</Label>
									<Input
										id="username"
										name="username"
										type="text"
										placeholder="Enter a username"
										required
										autoFocus
										addonPosition={"start"}
										addonText={<User className="h-4 w-4" />}
										readOnly={processing}
										onChange={handleChange}
										error={!!errors.username}
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										name="password"
										type="password"
										placeholder="Enter a password"
										required
										addonPosition={"start"}
										addonText={<Lock className="h-4 w-4" />}
										readOnly={processing}
										onChange={handleChange}
										error={!!errors.password}
										showPasswordToggle={true}
									/>
								</div>
								<div className="flex items-center gap-2">
									<Checkbox id="remember" />
									<Label htmlFor="remember" className="font-normal hover:underline">Remember me</Label>
								</div>
								<Button
									type={"submit"}
									variant={"default"}
									size={"default"}
									className="w-full mt-2"
									disabled={processing}
								>
									{processing ? <Loader2 className="animate-spin" /> : <LogIn />}
									Login
								</Button>
								<Separator />
								<span className="text-muted-foreground text-center text-sm font-light">
									Log in as any non-root user on your VPS.
								</span>
							</div>
						</form>
						<div className="relative hidden md:block border-border border-l bg-gradient-to-r  dark:from-primary/15 from-muted to-primary/70 ">
							<Logo variant="default" className="absolute bottom-4 right-5" />
						</div>
					</CardContent>
				</Card>
				<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 font-light">
					By clicking "Login", you acknowledge that the application may require some
					root privileges to function correctly. Please ensure your VPS user has the
					necessary permissions as described in the README.
				</div>
			</div>
		</AuthLayout>
	);
}
