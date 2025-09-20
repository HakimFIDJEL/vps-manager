// components/layouts/policies/header.tsx

// Custom Components
import AppearanceToggleDropdown from "@/components/layouts/app/header/theme";
import { Logo } from "@/components/layouts/app/logo";

export function Header() {
	return (
		<header className="bg-background/50 lg:bg-transparent fixed top-0 lg:backdrop-blur-none backdrop-blur-sm z-10 w-full flex shrink-0 items-center gap-2 border-b lg:border-b-0 justify-between px-6 py-4 lg:pointer-events-none">
			<Logo variant={"mini"} color_scheme={"white"} />
			<AppearanceToggleDropdown className="lg:pointer-events-auto" />
		</header>
	);
}
