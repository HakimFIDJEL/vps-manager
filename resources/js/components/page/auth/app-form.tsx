// components/page/auth/app-form.tsx

// Necessary imports
import { Head, Link, useForm } from "@inertiajs/react";
import { toast } from "sonner";
import * as React from "react";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Icons
import { Lock, LogIn, User, Loader2, ArrowLeft } from "lucide-react";

export function AppForm() {
	const inputRef = React.useRef<HTMLInputElement>(null);

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
		setTimeout(() => {
			inputRef.current?.focus();
		}, 700);

		return () => {
			inputRef.current?.blur();
		};
	}, []);

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
						// autoFocus
						addonPosition={"start"}
						addonText={<User className="h-4 w-4" />}
						readOnly={processing}
						onChange={handleChange}
						error={!!errors.username}
						ref={inputRef}
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
					<Checkbox id="remember" disabled={processing} />
					<Label htmlFor="remember" className="font-normal hover:underline">
						Remember me
					</Label>
				</div>
				<div>
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
					<Link href={route("home")}>
						<Button
							type={"button"}
							variant={"outline"}
							size={"default"}
							className="w-full mt-2"
							disabled={processing}
						>
							<ArrowLeft />
							Back to home
						</Button>
					</Link>
				</div>
				<Separator />
				<span className="text-muted-foreground text-center text-sm font-light">
					Log in as any non-root user on your VPS.
				</span>
			</div>
		</form>
	);
}
