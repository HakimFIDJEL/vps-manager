// Shadcn UI components
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';

export function AppOverview() {
	return (
		<TabsContent value="overview">
			<Card>
				<CardHeader>
					<CardTitle>
						Overview
					</CardTitle>
				</CardHeader>
			</Card>
		</TabsContent>
	)
}