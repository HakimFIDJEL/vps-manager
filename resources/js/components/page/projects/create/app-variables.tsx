// Necessary imports
import { useState } from "react";

// Custom components
import { CreateVariable } from "@/components/page/projects/create/create-variable";
import { VariablesList } from "@/components/page/projects/create/variables-list";
import { ImportEnv } from "@/components/page/projects/create/import-env";

// Shadcn UI components
import { Input } from "@/components/ui/input";

// Icons
import { Search } from "lucide-react";

// Types
import { type Variable } from "@/types/models/project";

export function AppVariables() {
	const [variables, setVariables] = useState<Variable[]>([]);
	const [search, setSearch] = useState<string>("");

	return (
		// Wrapper
		<div className="grid gap-4">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2">
					{/* Import .env */}
					<ImportEnv variables={variables} setVariables={setVariables} />

					{/* Add variable */}
					<CreateVariable variables={variables} setVariables={setVariables} />
				</div>

				<div>
					<Input
						name="search"
						placeholder="Filter variables..."
						addonText={<Search className="h-4 w-4" />}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						readOnly={variables.length == 0}
					/>
				</div>
			</div>

			{variables.length > 0 ? (
				// Variables list
				<VariablesList
					variables={variables}
					setVariables={setVariables}
					search={search}
				/>
			) : (
				// No variables message
				<div className="flex items-center justify-center w-full text-sm text-muted-foreground border border-dashed border-border rounded-md py-6">
					No variables added yet. Click on "Add Variable" to create one.
				</div>
			)}
		</div>
	);
}
