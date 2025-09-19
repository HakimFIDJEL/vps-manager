// components/page/home/help.tsx

// Shadcn UI Components
import {
	Accordion,
	AccordionItem,
	AccordionContent,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export function Help() {
	const faqItems = [
		{
			id: "item-1",
			question: "What is VPS Manager?",
			answer:
				"A self-hosted control panel to manage Docker Compose–based projects on your server from a simple UI.",
		},
		{
			id: "item-2",
			question: "What can I do today?",
			answer:
				"Import and manage Compose projects, run Make targets, view/edit/export .env, build/up/down/restart, check container status, and see exit codes.",
		},
		{
			id: "item-3",
			question: "Do I need Docker and Compose installed?",
			answer:
				"Yes. VPS Manager relies on Docker and Compose binaries already installed. Check the README for full requirements.",
		},
		{
			id: "item-4",
			question: "How does authentication work?",
			answer:
				"You sign in with a non-root system user. Actions run with that user’s permissions; some commands require sudo rights, so the user must be in the sudo group.",
		},
		{
			id: "item-5",
			question: "Does it modify my files?",
			answer:
				"It reads .env, Makefile, and docker-compose.yaml. Files are only changed when you explicitly save edits.",
		},
		{
			id: "item-6",
			question: "Can I run custom commands?",
			answer:
				"Not yet. Currently only pre-defined actions are available. Custom command execution is planned.",
		},
		{
			id: "item-7",
			question: "How are environment variables handled?",
			answer:
				"An .env file is created at the project root. Variables can be edited anytime, and linked to services if strict mode is enabled.",
		},
		{
			id: "item-8",
			question: "What about logs and real-time status?",
			answer:
				"Real-time container status is available. Logs and command output streaming are planned for upcoming releases.",
		},
		{
			id: "item-9",
			question: "Which OS is supported?",
			answer:
				"Modern Linux distributions, as long as all requirements are installed.",
		},
		{
			id: "item-10",
			question: "How do I update the app safely?",
			answer:
				"Pull the latest release and restart. Projects are untouched. An update helper is planned.",
		},
		{
			id: "item-11",
			question: "Is it production-ready?",
			answer:
				"It’s self-hosted and respects OS permissions, but use with backups and staging. This is still a side project—use at your own risk.",
		},
	];

	return (
		<section className="py-8 lg:py-12" id="help">
			<h5 className="text-primary font-medium mb-3 text-sm bg-muted rounded-xl px-3 py-1 inline-block">
				Help
			</h5>

			<div className="grid gap-8 md:grid-cols-5 md:gap-12">
				<div className="md:col-span-2">
					<h2 className="text-foreground text-balance text-3xl md:text-3xl">
						<span className="text-muted-foreground">
							Quick answers for running projects on
						</span>{" "}
						your server
					</h2>
					<p className="text-muted-foreground mt-6 block">
						Self-hosted control of Docker and Compose. Clear actions, safe edits,
						real-time feedback.
					</p>
					<p className="text-muted-foreground mt-6 hidden lg:block">
						Still stuck? Read the
						<Button variant={"link"} className="px-1 text-base" asChild>
							<a
								href="https://github.com/HakimFIDJEL/vps-manager/blob/main/README.md"
								target="_blank"
							>
								docs
							</a>
						</Button>
						or
						<Button variant={"link"} className="px-1 text-base" asChild>
							<a
								href="https://github.com/HakimFIDJEL/vps-manager/issues"
								target="_blank"
								className="text-primary font-medium hover:underline"
							>
								open an issue
							</a>
						</Button>
						.
					</p>
				</div>

				<div className="md:col-span-3">
					<Accordion type="single" collapsible>
						{faqItems.map((item, index) => (
							<AccordionItem
								key={item.id}
								value={item.id}
								className="relative border-b-transparent"
							>
								{index != faqItems.length - 1 && (
									<div className="bg-gradient-to-r from-transparent via-primary to-transparent h-[1px] absolute left-0 right-0 bottom-0" />
								)}
								<AccordionTrigger className="cursor-pointer text-base hover:no-underline hover:bg-card rounded-md px-2 transition-colors data-[state=open]:bg-card">
									{item.question}
								</AccordionTrigger>
								<AccordionContent>
									<p className="text-base">{item.answer}</p>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
				<p className="text-muted-foreground block lg:hidden">
					Still stuck? Read the{" "}
					<a
						href="https://github.com/HakimFIDJEL/vps-manager/blob/main/README.md"
						target="_blank"
						className="text-primary font-medium hover:underline"
					>
						docs
					</a>{" "}
					or{" "}
					<a
						href="https://github.com/HakimFIDJEL/vps-manager/issues"
						target="_blank"
						className="text-primary font-medium hover:underline"
					>
						open an issue
					</a>
					.
				</p>
			</div>
		</section>
	);
}
