// Shadcn UI components
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';

export function AppDocker() {
	return (
		<TabsContent value="containers">
			<Card>
				<CardHeader>
					<CardTitle>
						Containers
					</CardTitle>
				</CardHeader>
			</Card>
		</TabsContent>
	)
}
