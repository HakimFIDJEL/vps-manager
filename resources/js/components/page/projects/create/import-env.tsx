// Necessary imports
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
} from "@/components/ui/dialog";
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs";

// Icons
import { Plus, Download, Upload, Copy } from "lucide-react";

// Types
import { type Variable, VariableSchema } from "@/types/models/project";

export function ImportEnv({
	variables,
	setVariables,
}: {
	variables: Variable[];
	setVariables: (variables: Variable[]) => void;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"secondary"}>
					<Download />
					Import .env
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import .env</DialogTitle>
					<DialogDescription>
						Either import your .env file or paste the content in a text area.
					</DialogDescription>
				</DialogHeader>
                <Tabs defaultValue="file" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="file">
                            <Upload />
                            Import file
                        </TabsTrigger>
                        <TabsTrigger value="text">
                            <Copy />
                            Paste content
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="file">
                        Import file
                    </TabsContent>
                    <TabsContent value="text">
                        Paste content
                    </TabsContent>
                </Tabs>

				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant={"secondary"}>
							Close
						</Button>
					</DialogClose>
					<DialogSubmit asChild>
						<Button type="submit" variant={"outline"}>
							<Plus />
							Import variables
						</Button>
					</DialogSubmit>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
