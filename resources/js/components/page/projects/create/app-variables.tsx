// Necessary imports
import { useState } from "react";

// Shadcn UI components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"

// Functions
import { formatVariable } from "@/lib/projects/formatter";

// Icons
import { Download, Plus } from "lucide-react";

// Types
import { type Variable } from "@/types/models/project";

export function AppVariables() {
 
    const [variables, setVariables] = useState<Variable[]>([]);
    const [variable, setVariable] = useState<Variable>({ key: "", value: "" });


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
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={"outline"}>
                            Add Variable
                            <Plus />
                        </Button>
                    </DialogTrigger>
                    <DialogContent >
                        <DialogHeader>
                            <DialogTitle>Add variable</DialogTitle>
                            <DialogDescription>
                                Add an environnement variable to your project. They must be written in uppercase and separated by an underscore.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="key">
                                    Key
                                </Label>
                                <Input
                                    id="key"
                                    name="key"
                                    placeholder="eg: MY_KEY"
                                    value={variable?.key}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setVariable({
                                            ...variable,
                                            key: formatVariable(value),
                                        });
                                    }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="value">
                                    Value
                                </Label>
                                <Input
                                    id="value"
                                    name="value"
                                    placeholder="eg: MY_VALUE"
                                    value={variable?.value}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setVariable({
                                            ...variable,
                                            value: value,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant={"secondary"}>
                                Close
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant={"outline"}>
                                Add variable
                                <Plus />
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {variables.length > 0 ? (

                // Variables list
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Form bloc */}
                    <div className="grid gap-2">
                        
                    </div>
                    {/* Form bloc */}
                    <div className="grid gap-2">

                    </div>
                </div>
            ) : (
                // No variables message
                <div className="flex items-center justify-center w-full text-sm text-muted-foreground border border-dashed border-border rounded-md py-6">
                    No variables added yet. Click on "Add Variable" to create one.
                </div>
            )}


        </div>
    );
}