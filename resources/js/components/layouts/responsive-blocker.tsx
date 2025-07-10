import { ArrowRight, Monitor, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ResponsiveBlocker() {
	return (
		<div
			className={`
      fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4
      lg:opacity-0 lg:pointer-events-none 
      opacity-100 pointer-events-auto
      transition-all duration-300 ease-in-out
    `}
		>
			<Card className="w-full max-w-sm mx-auto shadow-lg">
				<CardContent className="p-6 text-center space-y-4">
					<Badge variant="outline" className="text-xs">
						Mobile version coming soon
					</Badge>

					{/* Icons */}
					<div className="flex justify-center items-center gap-3">
						<Monitor className="w-8 h-8 text-primary" />
						<div className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-muted-foreground">
							→
						</div>
						<Smartphone className="w-6 h-6 text-muted-foreground" />
					</div>

					{/* Title & Badge */}
					<div>
						<h2 className="text-xl font-semibold text-foreground tracking-tight">
							Responsive design not implemented
						</h2>
						{/* Description */}
						<p className="text-sm text-muted-foreground">
							Please use a larger screen to access this application.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
