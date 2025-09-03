// pages/home.tsx

// Necessary imports
import { Head } from "@inertiajs/react";

// Shadcn UI Components
import { SmoothItem } from "@/components/ui/smooth-resized";

// Custom components
import { Header } from "@/components/page/home/header";
import { Hero } from "@/components/page/home/hero";
import { Footer } from "@/components/page/home/footer";
import { Features } from "@/components/page/home/features";
import { Solution } from "@/components/page/home/solution";
import { Customers } from "@/components/page/home/customers";
import { Help } from "@/components/page/home/help";

// Variables
const links = [
	{
		group: "Product",
		items: [
			{
				title: "Features",
				href: "#",
			},
			{
				title: "Solution",
				href: "#",
			},
			{
				title: "Customers",
				href: "#",
			},
			{
				title: "Help",
				href: "#",
			},
			{
				title: "About",
				href: "#",
			},
		],
	},
	{
		group: "Resources",
		items: [
			{
				title: "Requirements",
				href: "#",
			},
			{
				title: "Installation",
				href: "#",
			},
			{
				title: "Documentation",
				href: "#",
			},
			{
				title: "Github",
				href: "#",
			},
		],
	},
	{
		group: "Legal",
		items: [
			{
				title: "Licence",
				href: "#",
			},
			{
				title: "Usage",
				href: "#",
			},
			{
				title: "Privacy",
				href: "#",
			},
			{
				title: "Cookies",
				href: "#",
			},
			{
				title: "Security",
				href: "#",
			},
		],
	},
];

export type Link = {
	group: string;
	items: {
		title: string;
		href: string;
	}[];
};

export default function Home() {
	return (
		<>
			<Head title="Home" />

			<SmoothItem delay={0.1}>
				<Header links={links} />
			</SmoothItem>

			<main className="@container/main w-full flex flex-1 flex-col container mx-auto py-6 gap-4 max-w-5xl px-6">
				<div className="flex flex-1 flex-col lg:gap-4 relative flex-shrink-0 h-full">
					<SmoothItem delay={0.3}>
						<Hero />
					</SmoothItem>

					<SmoothItem delay={0.2}>
						<Features />
					</SmoothItem>

					<SmoothItem delay={0.2}>
						<Solution />
					</SmoothItem>

					<SmoothItem delay={0.2}>
						<Customers />
					</SmoothItem>

					<SmoothItem delay={0.2}>
						<Help />
					</SmoothItem>
				</div>
			</main>

			<SmoothItem delay={0.7}>
				<Footer links={links} />
			</SmoothItem>
		</>
	);
}
