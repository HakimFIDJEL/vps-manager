// pages/home.tsx

// Necessary imports
import { Head } from "@inertiajs/react";

// Shadcn UI Components
import { HeroSection } from "@/components/page/home/hero";
import { FeaturesSection } from "@/components/page/home/features";
import { FaqsSection } from "@/components/page/home/faqs";
import { RoadmapSection } from "@/components/page/home/roadmap";
import { HeroHeader } from "@/components/page/home/header";
import { AboutSection } from "@/components/page/home/about";

// Custom components

export default function Home() {
	return (
		<>
			<Head title="Home" />

			<HeroHeader />

			<main className="@container/main w-full flex flex-1 flex-col container mx-auto py-6 gap-4 px-4 lg:px-0">
				<div className="flex flex-1 flex-col gap-4 relative flex-shrink-0 h-full">
					<HeroSection />
					<AboutSection />
					{/* <FeaturesSection />
					<RoadmapSection />
					<FaqsSection /> */}
				</div>
			</main>

			{/* <Footer /> */}
		</>
	);
}
