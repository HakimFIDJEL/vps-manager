// Shadcn UI components
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';

export function AppVariables() {
	return (
		<TabsContent value="variables">
			<Card>
				<CardHeader>
					<CardTitle>
						Variables
					</CardTitle>
				</CardHeader>
			</Card>
		</TabsContent>
	)
}