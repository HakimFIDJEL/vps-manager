// components/page/home/about.tsx

export function About() {
	return (
		<section>
			<div className="py-8 lg:py-12">
				<h5 className="text-primary font-medium mb-3 text-sm bg-muted rounded-xl px-3 py-1 inline-block">
					About
				</h5>

				<h2 className="text-foreground text-balance text-3xl md:text-3xl">
					<span className="text-muted-foreground">Manage your VPS like a</span>{" "}
					modern platform
				</h2>

				<p className="text-muted-foreground mb-12 mt-4 font-light">
					VPS Manager brings enterprise-grade orchestration to your own server.
					Control Docker containers, environment variables, and project lifecycles
					through an elegant interface, without ever touching the terminal.
				</p>

				<div className="border-foreground/5 space-y-6 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] sm:space-y-0 sm:divide-y">
					<div className="grid sm:grid-cols-5 sm:divide-x">
						<div className="sm:col-span-2 w-full pr-8 py-6">
							<h3 className="text-foreground text-xl">Project Automation</h3>
							<p className="text-muted-foreground mt-2 font-light">
								Every project is bootstrapped with a Makefile, a Docker Compose stack,
								and a ready-to-use .env file.
							</p>
						</div>
						<div className="sm:col-span-3 sm:border-l sm:pl-8 px-2 py-6">
							<h3 className="text-foreground text-xl">Project Automation</h3>
							<p className="text-muted-foreground mt-2 font-light">
								Every project is bootstrapped with a Makefile, a Docker Compose stack,
								and a ready-to-use .env file. Your environments stay consistent,
								repeatable, and production-ready by design.
							</p>
						</div>
					</div>
					<div className="grid sm:grid-cols-5 sm:divide-x">
						<div className="sm:col-span-3 sm:border-r sm:pr-12 py-6">
							<h3 className="text-foreground text-xl">Secure System Integration</h3>
							<p className="text-muted-foreground mt-2 font-light">
								User authentication is tied directly to Linux accounts. Commands are
								executed with the right privileges using PAM and sudo rules, ensuring
								security without sacrificing productivity.
							</p>
						</div>
						<div className="sm:col-span-2 w-full pl-8 py-6">
							<h3 className="text-foreground text-xl">Project Automation</h3>
							<p className="text-muted-foreground mt-2 font-light">
								Every project is bootstrapped with a Makefile, a Docker Compose stack,
								and a ready-to-use .env file.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
