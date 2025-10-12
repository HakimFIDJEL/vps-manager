// components/ui/file-explorer.tsx

// Necessary imports
import * as React from "react";
import type { ComponentProps } from "react";

// Shadcn UI Components
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarRail,
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

// Icons
import { ChevronRight, File, Folder } from "lucide-react";

// Types
import type { FS_FileStructure, FS_Element } from "@/lib/files/type";

type FE_HeaderProps = {
	file_structure: FS_FileStructure;
	active_element?: FS_Element;
	content?: string;
};

// Sidebar
type SidebarProps = ComponentProps<typeof Sidebar>;
type FE_SidebarProps = SidebarProps & {
	file_structure: FS_FileStructure;
	disabled?: boolean;
};

function FE_Sidebar({
	file_structure,
	disabled = false,
	...sidebarProps
}: FE_SidebarProps) {
	return (
		<Sidebar {...sidebarProps} className="relative">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Files</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{file_structure.elements.map((element: FS_Element) => (
								<FE_SidebarItem key={element.path} element={element} />
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

function FE_SidebarItem({ element }: { element: FS_Element }) {
	if (element.type === "file") {
		return (
			<SidebarMenuButton
				className="data-[active=true]:bg-transparent px-2"
				// isActive={name === "button.tsx"}
				type={"button"}
			>
				<File />
				<span className="min-w-0 flex-1 truncate">{element.name}</span>
			</SidebarMenuButton>
		);
	} else {
		return (
			<SidebarMenuItem>
				<Collapsible
					className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
					// defaultOpen={name === "components" || name === "ui"}
				>
					<CollapsibleTrigger asChild>
						<SidebarMenuButton className="overflow-ellipsis" type={"button"}>
							<ChevronRight className="transition-transform" />
							<Folder />
							<span className="min-w-0 flex-1 truncate">{element.name}</span>
						</SidebarMenuButton>
					</CollapsibleTrigger>
					<CollapsibleContent>
						{element.children && element.children.length > 0 ? (
							<SidebarMenuSub className="pr-0 mr-0">
								{element.children.map((subItem, index) => (
									<FE_SidebarItem key={index} element={subItem} />
								))}
							</SidebarMenuSub>
						) : (
							<SidebarMenuSub>
								<SidebarMenuSubItem>
									This folder is empty.
								</SidebarMenuSubItem>
							</SidebarMenuSub>
						)}
					</CollapsibleContent>
				</Collapsible>
			</SidebarMenuItem>
		);
	}
}

// Header
function FE_Header({
	file_structure,
	active_element,
	content,
}: FE_HeaderProps) {
	return <header></header>;
}

// Content
function FE_Content({}) {
	return <></>;
}

// Body
type FE_BodyProps = FE_HeaderProps & {};
function FE_Body({ file_structure, active_element, content }: FE_BodyProps) {
	return (
		<div className="flex flex-col w-full h-full">
			<FE_Header
				file_structure={file_structure}
				active_element={active_element}
				content={content}
			/>
			<FE_Content />
		</div>
	);
}

// File explorer
type FE_Props = {
	project_path: string;
	file_structure: FS_FileStructure;
	disabled?: boolean;
};

export function FileExplorer({
	project_path,
	file_structure,
	disabled = false,
}: FE_Props) {
	return (
		<div className="w-full relative flex rounded-md border overflow-hidden h-auto">
			<SidebarProvider>
				<FE_Sidebar file_structure={file_structure} disabled={disabled} />
				<SidebarInset>
					<FE_Body
						file_structure={file_structure}
						active_element={undefined}
						content={undefined}
					/>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
