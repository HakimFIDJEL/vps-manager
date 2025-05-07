// Necessary imports
import { useEffect, useState } from "react";

// Custom components
import { CreateVariable } from "@/components/page/projects/create/create-variable";
import { VariablesList } from "@/components/page/projects/create/variables-list";

// Shadcn UI components
import { Button } from "@/components/ui/button";

// Icons
import { Download } from "lucide-react";

// Types
import { type Variable } from "@/types/models/project";

export function AppVariables() {
 
    const [variables, setVariables] = useState<Variable[]>([]);

    useEffect(() => {
        console.log("Variables: ", variables);
    }, [variables]);


    return (
        // Wrapper
        <div className="grid gap-4">

            <div className="flex items-center gap-2">
                {/* Import .env */}
                <Button variant={"secondary"}>
                    Import .env
                    <Download />
                </Button>

                {/* Add variable */}
                <CreateVariable 
                    variables={variables}
                    setVariables={setVariables}
                />
            </div>

            {variables.length > 0 ? (

                // Variables list
                <VariablesList variables={variables} setVariables={setVariables} />

            ) : (

                // No variables message
                <div className="flex items-center justify-center w-full text-sm text-muted-foreground border border-dashed border-border rounded-md py-6">
                    No variables added yet. Click on "Add Variable" to create one.
                </div>

            )}


        </div>
    );
}