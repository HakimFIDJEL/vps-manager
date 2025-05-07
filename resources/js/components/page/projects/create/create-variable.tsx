// Necessary imports
import { useState } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// Shadcn UI components
import { Input } from "@/components/ui/input";
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
    DialogSubmit,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

// Icons
import { Plus } from "lucide-react";

// Types
import { type Variable, VariableSchema } from "@/types/models/project";

export function CreateVariable({ variables, setVariables }: { variables: Variable[]; setVariables: (variables: Variable[]) => void }) {
    
    const [variable, setVariable] = useState<Variable>({ key: "", value: "" });

    const VariableForm = useForm<z.infer<typeof VariableSchema>>({
        resolver: zodResolver(VariableSchema),
        defaultValues: {
            key: variable.key,
            value: variable.value,
        },
      })

    async function onSubmit() {
        const isValid = await VariableForm.trigger()
        if (!isValid) return false
    
        const data = VariableForm.getValues()
        setVariables([...variables, data])
        setVariable({ key: "", value: "" })
        VariableForm.reset()
        return true // Retourne true pour fermer le Dialog
    }

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"outline"}>
					Add Variable
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add variable</DialogTitle>
					<DialogDescription>
						Add an environnement variable to your project. They must be written in
						uppercase and separated by an underscore.
					</DialogDescription>
				</DialogHeader>
                <Form {...VariableForm}>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="grid gap-4 items-start py-4 grid-cols-2">
                            <FormField
                                control={VariableForm.control}
                                name="key"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Key</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="key"
                                            placeholder="eg: MY_KEY"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={VariableForm.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="value"
                                            placeholder="eg: MY_VALUE"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant={"secondary"}>
                                    Close
                                </Button>
                            </DialogClose>
                            <DialogSubmit onSubmit={onSubmit} asChild>
                                <Button type="submit" variant={"outline"}>
                                    Add variable
                                    <Plus />
                                </Button>
                            </DialogSubmit>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
		</Dialog>
	);
}
