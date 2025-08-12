"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	showPasswordToggle?: boolean;
	addonText?: string | React.ReactNode;
	addonPosition?: "start" | "end";
	comment?: string;
	error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type,
			showPasswordToggle,
			addonText,
			addonPosition = "start",
			readOnly,
			comment,
			error = false,
			...props
		},
		ref,
	) => {
		const [showPassword, setShowPassword] = React.useState(false);

		// Détermine le type d'input à afficher
		const inputType = type === "password" && showPassword ? "text" : type;

		// Ignore le toggle si le type n'est pas password ou text
		const shouldShowToggle =
			showPasswordToggle && (type === "password" || type === "text");

		// Style commun pour disabled et readonly
		const disabledOrReadonlyStyle =
			"pointer-events-none cursor-not-allowed opacity-50 border-input !ring-0  ";

		// Styles de l'input
		const inputStyles = cn(
			// Styles de base
			"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
			"dark:bg-input/30 bg-background text-base shadow-0 outline-none md:text-sm",
			"file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
			"h-9 min-w-0 px-3  transition-[color,box-shadow, border] duration-200",

			// Styles conditionnels
			// !addonText && "border border-input rounded-md w-full",
			addonText && "border-0 flex-1 rounded-md",
			shouldShowToggle && "pr-10",
			addonPosition === "start" &&
				addonText &&
				"!rounded-tl-none !rounded-bl-none",
			addonPosition === "end" && addonText && "!rounded-tr-none !rounded-br-none",

			// États
			// !readOnly &&
			// 	"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
			"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
			readOnly && disabledOrReadonlyStyle,

			// Classes personnalisées
			className,
		);

		const wrapperStyles = cn(
			"flex items-center w-full rounded-md overflow-hidden border border-input h-9 border relative",
			!readOnly &&
				"focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] transition-[color,box-shadow]",
			// !readOnly && "focus-within:border-ring focus-within:ring-0 transition-[color,box-shadow]",

			"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
			error &&
				"border-destructive ring-destructive/20 dark:ring-destructive/40 ring-[3px] focus-within:!ring-ring/50",
			// error && "border-destructive ring-destructive/20 dark:ring-destructive/40 ring-[3px]",

			readOnly && disabledOrReadonlyStyle,

			className,
		);

		return (
			<div className="w-full">
				{/* Conteneur conditionnel pour les addons */}
				{addonText ? (
					<div className={wrapperStyles}>
						{/* Addon au début */}
						{addonPosition === "start" && (
							<div className="flex items-center justify-center px-3 h-full bg-card text-muted-foreground border-r border-input shrink-0">
								{addonText}
							</div>
						)}

						{/* Input */}
						<input
							type={inputType}
							data-slot="input"
							className={inputStyles}
							readOnly={readOnly}
							tabIndex={readOnly ? -1 : undefined}
							ref={ref}
							{...props}
						/>

						{/* Addon à la fin */}
						{addonPosition === "end" && (
							<div className="flex items-center justify-center px-3 h-full bg-card text-muted-foreground border-l border-input shrink-0">
								{addonText}
							</div>
						)}

						{/* Toggle de mot de passe */}
						{shouldShowToggle && addonPosition === "start" && !readOnly && (
							<PasswordToggle
								showPassword={showPassword}
								setShowPassword={setShowPassword}
								readOnly={readOnly}
							/>
						)}
					</div>
				) : (
					<div className={wrapperStyles}>
						{/* Input simple sans addon */}
						<input
							type={inputType}
							data-slot="input"
							className={inputStyles}
							readOnly={readOnly}
							tabIndex={readOnly ? -1 : undefined}
							ref={ref}
							{...props}
						/>

						{/* Toggle de mot de passe */}
						{shouldShowToggle && !readOnly && (
							<PasswordToggle
								showPassword={showPassword}
								setShowPassword={setShowPassword}
								readOnly={readOnly}
							/>
						)}
					</div>
				)}

				{/* Commentaire sous l'input */}
				{comment && <p className="mt-1 text-xs text-muted-foreground">{comment}</p>}
			</div>
		);
	},
);

function PasswordToggle({
	showPassword,
	setShowPassword,
	readOnly,
}: {
	showPassword: boolean;
	setShowPassword: (value: boolean) => void;
	readOnly: boolean | undefined;
}) {
	return (
		<Button
			type="button"
			variant={"ghost"}
			size={"icon"}
			className={cn(
				"h-6 w-6 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer hover:bg-muted-foreground/10 transition-colors duration-200 p-1 rounded-md",
				readOnly && "opacity-50 pointer-events-none",
			)}
			onClick={() => setShowPassword(!showPassword)}
			aria-label={
				showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
			}
			disabled={readOnly}
			tabIndex={readOnly ? -1 : undefined}
		>
			{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
		</Button>
	);
}

Input.displayName = "Input";

export { Input };
