// components/page/home/about.tsx

export function AboutSection() {
	return (
		<section>
			<div className="py-24">
				<div className="mx-auto w-full max-w-5xl px-6">
					<div>
						<span className="text-primary">Infrastructure Simplified</span>
						<h2 className="text-foreground mt-4 text-4xl">
							Manage your VPS like a modern platform
						</h2>
						<p className="text-muted-foreground mb-12 mt-4 font-light">
							VPS Manager brings enterprise-grade orchestration to your own server.
							Control Docker containers, environment variables, and project lifecycles
							through an elegant interface, without ever touching the terminal.
						</p>
					</div>

					<div className="border-foreground/5 space-y-6 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] sm:space-y-0 sm:divide-y">
						<div className="grid sm:grid-cols-5 sm:divide-x">
							<div className="sm:col-span-2 h-36 w-full p-4">
								<img className="w-full h-full object-cover" />
							</div>
							<div className="mt-6 sm:col-span-3 sm:mt-0 sm:border-l sm:pl-12">
								<h3 className="text-foreground text-xl">Project Automation</h3>
								<p className="text-muted-foreground mt-4 font-light">
									Every project is bootstrapped with a Makefile, a Docker Compose stack,
									and a ready-to-use .env file. Your environments stay consistent,
									repeatable, and production-ready by design.
								</p>
							</div>
						</div>
						<div className="grid sm:grid-cols-5 sm:divide-x">
							<div className="pt-12 sm:col-span-3 sm:border-r sm:pr-12">
								<h3 className="text-foreground text-xl">Secure System Integration</h3>
								<p className="text-muted-foreground mt-4 font-light">
									User authentication is tied directly to Linux accounts. Commands are
									executed with the right privileges using PAM and sudo rules, ensuring
									security without sacrificing productivity.
								</p>
							</div>
							<div className="row-start-1 flex items-center justify-center sm:col-span-2 sm:row-start-auto">
								<div className="sm:col-span-2 h-32 w-full p-4">
									<img className="w-full h-full object-cover" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
