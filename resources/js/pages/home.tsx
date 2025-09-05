// pages/home.tsx

// Necessary imports
import { Head } from "@inertiajs/react";
import Lenis from "lenis";
import React from "react";

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
import { About } from "@/components/page/home/about";
import { ScrollTop } from "@/components/page/home/scroll-top";

// Variables
const links = [
	{
		group: "Product",
		items: [
			{
				title: "Features",
				href: "#features",
			},
			{
				title: "Solution",
				href: "#solution",
			},
			{
				title: "Customers",
				href: "#customers",
			},
			{
				title: "Help",
				href: "#help",
			},
			{
				title: "About",
				href: "#about",
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
	// Smooth scroll
	const lenisRef = React.useRef<Lenis | null>(null);

	React.useEffect(() => {
		const lenis = new Lenis({ duration: 1.1, autoRaf: true });
		lenisRef.current = lenis;
		return () => {
			lenis.destroy();
			lenisRef.current = null;
		};
	}, []);

	// Active section
	const [activeSection, setActiveSection] = React.useState<string | null>(null);

	React.useEffect(() => {
		const sections = document.querySelectorAll("section[id]");
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((e) => e.isIntersecting);
				if (!visible.length) return;
				const top = visible.reduce((a, b) =>
					b.intersectionRatio > a.intersectionRatio ? b : a,
				);
				const id = (top.target as HTMLElement).id;
				setActiveSection(id);
				console.log(id);
			},
			{ root: null, rootMargin: "0px", threshold: 0.4 },
		);

		sections.forEach((sec) => observer.observe(sec));
		return () => sections.forEach((sec) => observer.unobserve(sec));
	}, []);

	return (
		<>
			<Head title="Home" />

			<SmoothItem delay={0.1}>
				<Header links={links} activeSection={activeSection} />
			</SmoothItem>

			<main className="@container/main w-full flex flex-1 flex-col container mx-auto py-6 gap-4 max-w-5xl px-6 relative">
				<div className="flex flex-1 flex-col lg:gap-4 relative flex-shrink-0 h-full">
					<SmoothItem delay={0.3}>
						<Hero />
					</SmoothItem>

					<SmoothItem delay={0.5}>
						<Features />
					</SmoothItem>

					<SmoothItem delay={0.5}>
						<Solution />
					</SmoothItem>

					<SmoothItem delay={0.5}>
						<Customers />
					</SmoothItem>

					<SmoothItem delay={0.5}>
						<Help />
					</SmoothItem>

					<SmoothItem delay={0.5}>
						<About />
					</SmoothItem>
				</div>

				<ScrollTop />
			</main>

			<SmoothItem delay={0.3}>
				<Footer links={links} />
			</SmoothItem>
		</>
	);
}
