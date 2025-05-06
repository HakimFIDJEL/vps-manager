// Necessary imports
import { useState } from "react";

// Shadcn UI components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Functions
import { formatSlug } from "@/lib/projects/formatter"; 

export function AppProject() {

    const [name, setName] = useState<string>("");
    const [folderPath, setFolderPath] = useState<string>("");

    return (
        // Wrapper
        <div className="grid gap-4">
            {/* Form row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Form bloc */}
                <div className="grid gap-2">
                    <Label htmlFor="name">Project name</Label>
                    <Input 
                        id="name" 
                        placeholder="eg: My project" 
                        name="name" 
                        required
                        comment="The project name will not be stored, but be displayed from the folder path."
                        value={name}
                        autoFocus
                        onChange={(e) => {
                            setName(e.target.value);
                            setFolderPath(formatSlug(e.target.value));
                        }}
                    />
                </div>
                {/* Form bloc */}
                <div className="grid gap-2">
                    <Label htmlFor="folder-path">Folder path</Label>
                    <Input 
                        id="folder-path"
                        placeholder="eg: my-project" 
                        name="folder-path" 
                        required 
                        addonText="/projects/" 
                        addonPosition="start"
                        comment="The folder path needs to be unique and slugified."
                        value={folderPath}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
}