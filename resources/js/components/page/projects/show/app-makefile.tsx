// Shadcn UI components
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';

export function AppMakefile() {
	return (
		<TabsContent value="commands">
			<Card>
				<CardHeader>
					<CardTitle>
						Commands
					</CardTitle>
				</CardHeader>
			</Card>
		</TabsContent>
	)
}
