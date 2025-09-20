"use client";

// Necessary imports
import * as React from "react";
import {
	clearAllCookies,
	cn,
	getCookie,
	isCookieConsent,
	setCookie,
} from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

// Icons
import { Check, Cookie, X } from "lucide-react";

// Define prop types
interface CookieConsentProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "small" | "mini";
	demo?: boolean;
	onAcceptCallback?: () => void;
	onDeclineCallback?: () => void;
	description?: string;
	learnMoreHref?: string;
}

const ExpandButton = ({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const cookie_consent = isCookieConsent();
	const [hovered, setHovered] = React.useState(false);

	return (
		<Button
			variant="outline"
			className={cn(
				"fixed bottom-4 left-4 z-50 rounded-full transition-all duration-300 !bg-card hover:!bg-muted !p-[9px]",
				isOpen ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
				hovered ? "gap-2" : "gap-0",
			)}
			onClick={() => {
				setIsOpen(true);
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<Cookie className="h-5 w-5" />
			<motion.span
				className={`overflow-hidden whitespace-nowrap ${hovered ? "pr-1" : ""}`}
				initial={{ width: 0, opacity: 0 }}
				animate={{ width: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
				transition={{ duration: 0.2, ease: "easeInOut" }}
			>
				{cookie_consent ? "Cookies enabled" : "Cookies disabled"}
			</motion.span>
		</Button>
	);
};

const CookieConsent = React.forwardRef<HTMLDivElement, CookieConsentProps>(
	(
		{
			variant = "default",
			demo = false,
			onAcceptCallback = () => {},
			onDeclineCallback = () => {},
			className,
			description = "We use cookies to ensure you get the best experience on our website. For more information on how we use cookies, please see our cookie policy.",
			learnMoreHref = "#",
			...props
		},
		ref,
	) => {
		const [isOpen, setIsOpen] = React.useState(false);

		const handleAccept = React.useCallback(() => {
			setIsOpen(false);
			setCookie("cookie_consent", true, 180);
			toast.success("Cookies are enabled for the next 180 days.");
			onAcceptCallback();
		}, [onAcceptCallback]);

		const handleDecline = React.useCallback(() => {
			setIsOpen(false);
			clearAllCookies();
			setCookie("cookie_consent", false, 180);
			toast.info("Cookies are disabled for the next 180 days");
			onDeclineCallback();
		}, [onDeclineCallback]);

		React.useEffect(() => {
			try {
				setIsOpen(false);

				// if cookie_consent is null
				if (getCookie("cookie_consent") == null) {
					setIsOpen(true);
				}
			} catch (error) {
				console.warn("Cookie consent error:", error);
			}
		}, []);

		const containerClasses = cn(
			"fixed z-50 transition-all duration-300",
			!isOpen ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
			className,
		);

		const commonWrapperProps = {
			ref,
			className: cn(
				containerClasses,
				variant === "mini"
					? "left-0 right-0 sm:left-4 bottom-4 w-full sm:max-w-3xl"
					: "bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 w-full sm:max-w-md",
			),
			...props,
		};

		if (variant === "default") {
			return (
				<>
					<ExpandButton setIsOpen={setIsOpen} isOpen={isOpen} />
					<div {...commonWrapperProps}>
						<Card className="m-3 shadow-lg">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-lg">We use cookies</CardTitle>
								<Cookie className="h-5 w-5" />
							</CardHeader>
							<CardContent className="space-y-2">
								<CardDescription className="text-sm">{description}</CardDescription>
								<p className="text-xs text-muted-foreground">
									By clicking <span className="font-medium">"Accept"</span>, you agree to
									our use of cookies.
								</p>
								<a
									href={learnMoreHref}
									target="_blank"
									className="text-xs text-primary underline underline-offset-4 hover:no-underline"
								>
									Learn more
								</a>
							</CardContent>
							<CardFooter className="flex gap-2 pt-2">
								<Button onClick={handleDecline} variant="secondary" className="flex-1">
									Decline
								</Button>
								<Button onClick={handleAccept} className="flex-1">
									Accept
								</Button>
							</CardFooter>
						</Card>
					</div>
				</>
			);
		}

		if (variant === "small") {
			return (
				<>
					<ExpandButton setIsOpen={setIsOpen} isOpen={isOpen} />
					<div {...commonWrapperProps}>
						<Card className="m-3 shadow-lg">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 h-0 px-4">
								<CardTitle className="text-base">We use cookies</CardTitle>
								<Cookie className="h-4 w-4" />
							</CardHeader>
							<CardContent className="pt-0 pb-2 px-4">
								<CardDescription className="text-sm">{description}</CardDescription>
							</CardContent>
							<CardFooter className="flex gap-2 h-0 py-2 px-4">
								<Button
									onClick={handleDecline}
									variant="secondary"
									size="sm"
									className="flex-1 rounded-full"
								>
									Decline
								</Button>
								<Button
									onClick={handleAccept}
									size="sm"
									className="flex-1 rounded-full"
								>
									Accept
								</Button>
							</CardFooter>
						</Card>
					</div>
				</>
			);
		}

		if (variant === "mini") {
			return (
				<>
					<ExpandButton setIsOpen={setIsOpen} isOpen={isOpen} />
					<div {...commonWrapperProps}>
						<Card className="mx-3 p-0 py-3">
							<CardContent className="sm:flex grid gap-4 p-0 pl-3.5 pr-6">
								<CardDescription className="text-xs sm:text-sm flex-1">
									{description}
									<a href={learnMoreHref} target="_blank">
										<Button
											variant={"link"}
											size={"sm"}
											className="px-1 font-light py-0 h-auto"
										>
											Learn more
										</Button>
									</a>
								</CardDescription>
								<div className="flex items-center gap-2 justify-end">
									<Button
										onClick={handleDecline}
										size={"sm"}
										variant={"outline"}
										className="text-xs"
									>
										<X />
										Decline
										<span className="sr-only sm:hidden">Decline</span>
									</Button>
									<Button
										onClick={handleAccept}
										size={"sm"}
										variant={"default"}
										className="text-xs"
									>
										<Check />
										Accept
										<span className="sr-only sm:hidden">Accept</span>
									</Button>
								</div>
							</CardContent>
							<Button
								onClick={() => setIsOpen(false)}
								className="absolute top-1 right-[1rem] rounded-full w-4 h-4"
								variant={"outline"}
								size={"icon"}
							>
								<X className="!h-[0.75rem] !w-[0.75rem]" />
							</Button>
						</Card>
					</div>
				</>
			);
		}

		return null;
	},
);

CookieConsent.displayName = "CookieConsent";
export { CookieConsent };
export default CookieConsent;
