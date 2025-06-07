// Shadcn UI components
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';

export function AppSettings() {
	return (
		<TabsContent value="settings">
			<Card>
				<CardHeader>
					<CardTitle>
						Settings
					</CardTitle>
				</CardHeader>
			</Card>
		</TabsContent>
	)
}