// components/ui/file-explorer.tsx

// Types
import type { FS_FileStructure, FS_Element } from "@/lib/files/type";

interface FileExplorerProps {
	file_structure: FS_FileStructure;
	disabled?: boolean;
}

function FE_Sidebar({ file_structure, disabled = false }: FileExplorerProps) {
	return <></>;
}

interface FileExplorerProps {
	project_path: string;
}

export function FileExplorer({
	project_path,
	file_structure,
	disabled = false,
}: FileExplorerProps) {
	return <></>;
}
