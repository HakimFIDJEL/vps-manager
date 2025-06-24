// Shadcn UI components
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Container, Folder, Settings2 } from 'lucide-react';

export function AppSettings() {
	return (
		<TabsContent value="settings">
			{/* <Tabs defaultValue="settings-folder">
				<TabsList className="h-auto rounded-none border-none bg-transparent p-0">
					<TabsTrigger
						value="settings-folder"
						className="data-[state=active]:after:bg-primary dark:!bg-background gap-2 !bg-muted/50 !text-foreground relative rounded-none py-3 px-4 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
					>
						<Folder />
						Folder
					</TabsTrigger>
					<TabsTrigger
						value="settings-containers"
						className="data-[state=active]:after:bg-primary dark:!bg-background gap-2 !bg-muted/50 !text-foreground relative rounded-none py-3 px-4 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
					>
						<Container />
						Containers
					</TabsTrigger>
					<TabsTrigger
						value="settings-project"
						className="data-[state=active]:after:bg-primary dark:!bg-background gap-2 !bg-muted/50 !text-foreground relative rounded-none py-3 px-4 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
					>
						<Settings2 />
						Project
					</TabsTrigger>
				</TabsList>
				<TabsContent value="tab-1">
					<p className="text-muted-foreground p-4 text-center text-xs">
						Content for Tab 1
					</p>
				</TabsContent>
				<TabsContent value="tab-2">
					<p className="text-muted-foreground p-4 text-center text-xs">
						Content for Tab 2
					</p>
				</TabsContent>
				<TabsContent value="tab-3">
					<p className="text-muted-foreground p-4 text-center text-xs">
						Content for Tab 3
					</p>
				</TabsContent>
			</Tabs> */}

		</TabsContent>
	)
}