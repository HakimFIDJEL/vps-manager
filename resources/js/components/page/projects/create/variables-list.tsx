// Shadcn ui components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Types
import { type Variable } from "@/types/models/project"
import { Lock, Trash } from "lucide-react";

export function VariablesList({
  variables,
  setVariables,
  search
}: {
  variables: Variable[]
  setVariables: (variables: Variable[]) => void
  search: string
}) {

  function handleDelete(key: string) {
    setVariables(variables.filter((variable) => variable.key !== key))
  }
  

  return (
    <Table>
      <TableHeader>
          <TableRow>
              <TableHead>Key</TableHead>
              <TableHead className="text-right">Actions</TableHead>
          </TableRow>
      </TableHeader>
      <TableBody>
          {variables.filter((variable) => variable.key.toLowerCase().includes(search.toLowerCase())).map((variable) => (
              <TableRow key={variable.key}>
                  <TableCell className="font-mono">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      {variable.key}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">

                      <Button variant="destructive" size="icon" onClick={() => handleDelete(variable.key)}>
                          <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
              </TableRow>
          ))}
          {variables.filter((variable) => variable.key.toLowerCase().includes(search.toLowerCase())).length === 0 && (
              <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 bg-muted/50">
                      No variables found
                  </TableCell>
              </TableRow>
          )}
      </TableBody>
  </Table>
  )
}
