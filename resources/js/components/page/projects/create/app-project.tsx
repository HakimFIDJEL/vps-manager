// Necessary imports
import { useEffect, useState } from "react";
import { useProject } from "@/contexts/project-context";

// Shadcn UI components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Functions
import { formatSlug } from "@/lib/projects/formatter"; 

export function AppProject() {
    const { project, updateProject } = useProject();
    const [name, setName] = useState<string>(project.name);
    const [folderPath, setFolderPath] = useState<string>(project.folderPath);

    useEffect(() => {
        setName(project.name);
        setFolderPath(project.folderPath);
    }, [project]);

    return (
        // Wrapper
        <div className="grid gap-4">
            {/* Form row */}
            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
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
                            const newName = e.target.value;
                            setName(newName);
                            const newFolderPath = formatSlug(newName);
                            setFolderPath(newFolderPath);
                            updateProject("name", newName);
                            updateProject("folderPath", newFolderPath);
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