// components/ui/file-explorer.tsx

// Necessary imports
import * as React from "react";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Shadcn UI Components
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
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
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { CodeEditor } from "@/components/ui/code-editor";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

// Icons
import {
	Check,
	ChevronRight,
	FileX,
	Folder,
	Clipboard,
	File,
	FileLock,
	FileImage,
	FileVideo2,
	Database,
	X,
	Ellipsis,
	Save,
} from "lucide-react";

// Extension icons
import {
	SiHtml5,
	SiCss3,
	SiJavascript,
	SiReact,
	SiTypescript,
	SiLess,
	SiPhp,
	SiPython,
	SiGnubash,
	SiLaravel,
	SiGo,
	SiVuedotjs,
	SiSvelte,
	SiAstro,
	SiJson,
	SiDotenv,
	SiSqlite,
	SiPrisma,
	SiDocker,
	SiSvg,
	SiMarkdown,
} from "react-icons/si";

// Types
import type { FS_FileStructure, FS_Element } from "@/lib/files/type";

// Sidebar
type SidebarProps = ComponentProps<typeof Sidebar>;
type FE_SidebarProps = SidebarProps & {
	file_structure: FS_FileStructure;
	active_element?: FS_Element;
	set_active_element?: React.Dispatch<
		React.SetStateAction<FS_Element | undefined>
	>;
	disabled?: boolean;
	display_icons?: boolean;
};

function FE_Sidebar({
	file_structure,
	active_element,
	set_active_element,
	disabled = false,
	display_icons = false,
	...sidebarProps
}: FE_SidebarProps) {
	return (
		<Sidebar {...sidebarProps} className="relative w-full !border-r-0">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Files</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{file_structure.elements.map((element: FS_Element) => (
								<FE_SidebarItem
									key={element.path}
									element={element}
									active_element={active_element}
									set_active_element={set_active_element}
									display_icons={display_icons}
								/>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

type FE_SidebarItemProps = {
	element: FS_Element;
	active_element?: FS_Element;
	set_active_element?: React.Dispatch<
		React.SetStateAction<FS_Element | undefined>
	>;
	display_icons?: boolean;
};

function FE_SidebarItem({
	element,
	active_element,
	set_active_element,
	display_icons,
}: FE_SidebarItemProps) {
	function handleClick() {
		if (set_active_element) {
			set_active_element(element);
		}
	}

	if (element.type === "file") {
		return (
			<SidebarMenuButton
				className="px-2"
				isActive={element === active_element}
				type={"button"}
				onClick={handleClick}
			>
				{/* {display_icons ? (
					<>{_get_icon({ extension: element.extension || "" })}</>
				) : ( */}
				<File className="h-4 w-4" />
				{/* )} */}
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
									<FE_SidebarItem
										key={index}
										element={subItem}
										active_element={active_element}
										set_active_element={set_active_element}
									/>
								))}
							</SidebarMenuSub>
						) : (
							<SidebarMenuSub>
								<SidebarMenuSubItem className="py-1">
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
type FE_HeaderProps = {
	file_structure: FS_FileStructure;
	active_element?: FS_Element;
	set_active_element?: React.Dispatch<
		React.SetStateAction<FS_Element | undefined>
	>;
	display_icons?: boolean;
};

function FE_Header({
	active_element,
	set_active_element,
	display_icons,
}: FE_HeaderProps) {
	return (
		active_element && (
			<div className="border-b px-4 py-2 bg-sidebar">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						{/* Icon */}
						{display_icons ? (
							<>
								{_get_icon({
									extension: active_element.extension || "",
									className: "text-muted-foreground",
								})}
							</>
						) : (
							<File className="h-4 w-4 text-muted-foreground" />
						)}

						{/* Name */}
						<span className="text-sm text-muted-foreground">
							{active_element.path}
						</span>
					</div>
					<div className="flex items-center space-x-2">
						{/* Saved */}
						{active_element.saved ? (
							<Badge variant="default" className="text-xs">
								<Check className="h-4 w-4" />
								Saved
							</Badge>
						) : (
							<Badge variant="secondary" className="text-xs ">
								<X className="h-4 w-4 text-muted-foreground" />
								Not saved
							</Badge>
						)}

						{/* Actions */}
						<FE_HeaderDropdown active_element={active_element} />
					</div>
				</div>
			</div>
		)
	);
}

type FE_HeaderDropdownProps = {
	active_element?: FS_Element;
};
function FE_HeaderDropdown({ active_element }: FE_HeaderDropdownProps) {
	function handleFileCopy() {
		if (active_element) {
			navigator.clipboard.writeText(active_element.content || "");
			toast.success("File content copied to clipboard");
		} else {
			toast.error("Failed to copy file content");
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant={"outline"}
					size={"icon"}
					type={"button"}
					className="h-6 w-8"
					// disabled={loading}
				>
					<Ellipsis className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="">
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={handleFileCopy}
						className="flex items-center gap-2"
					>
						<Clipboard className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">Copy</span>
					</DropdownMenuItem>

					<DropdownMenuItem
						// onClick={handleFileSave}
						disabled={!active_element || active_element.saved}
						className="flex items-center gap-2"
					>
						<Save className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">Save</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />
				<div className="p-2"></div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// Content
type FE_ContentProps = {
	active_element?: FS_Element;
	set_active_element?: React.Dispatch<
		React.SetStateAction<FS_Element | undefined>
	>;
	disabled?: boolean;
};

function FE_Content({
	active_element,
	set_active_element,
	disabled,
}: FE_ContentProps) {
	const [temp, setTemp] = React.useState<string>("");

	return active_element ? (
		<CodeEditor
			value={active_element.content || ""}
			onChange={(newValue) =>
				set_active_element?.((prev) =>
					prev ? { ...prev, content: newValue, saved: false } : prev,
				)
			}
			isSaved={!!active_element?.saved}
			onSave={() =>
				set_active_element?.((prev) => (prev ? { ...prev, saved: true } : prev))
			}
			className={`
			rounded-none 
			border-0 
			focus-within:!ring-0	
					`}
			disabled={disabled}
		/>
	) : (
		<div className="flex h-full justify-center items-center flex-col">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FileX />
					</EmptyMedia>
					<EmptyTitle>No file opened</EmptyTitle>
					<EmptyDescription>
						You have no file opened. Open a file from the sidebar to view its content.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	);
}

// Body
type FE_BodyProps = FE_HeaderProps & {
	disabled?: boolean;
	display_icons?: boolean;
};

function FE_Body({
	file_structure,
	active_element,
	set_active_element,
	disabled,
	display_icons,
}: FE_BodyProps) {
	return (
		<div className="flex flex-col w-full h-full">
			<FE_Header
				file_structure={file_structure}
				active_element={active_element}
				display_icons={display_icons}
			/>
			<FE_Content
				active_element={active_element}
				set_active_element={set_active_element}
				disabled={disabled}
			/>
		</div>
	);
}

// File explorer
type FE_Props = {
	project_path: string;
	file_structure: FS_FileStructure;
	display_icons?: boolean;
	disabled?: boolean;
};

export function FileExplorer({
	project_path,
	file_structure,
	display_icons = true,
	disabled = false,
}: FE_Props) {
	const [activeElement, setActiveElement] = React.useState<
		FS_Element | undefined
	>(undefined);

	React.useEffect(() => {
		console.log("Active element", activeElement?.extension);
	}, [activeElement]);

	return (
		<SidebarProvider className="!h-[100svh] !min-h-0">
			<ResizablePanelGroup
				className="w-full relative flex rounded-md border overflow-hidden h-auto"
				direction={"horizontal"}
			>
				<ResizablePanel defaultSize={20} minSize={15} maxSize={50}>
					<FE_Sidebar
						file_structure={file_structure}
						active_element={activeElement}
						set_active_element={setActiveElement}
						disabled={disabled}
						display_icons={display_icons}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel>
					<SidebarInset className="h-full">
						<FE_Body
							file_structure={file_structure}
							active_element={activeElement}
							set_active_element={setActiveElement}
							disabled={disabled}
							display_icons={display_icons}
						/>
					</SidebarInset>
				</ResizablePanel>
			</ResizablePanelGroup>
		</SidebarProvider>
	);
}

// Custom methods
function _get_icon({
	extension,
	className,
}: {
	extension: string;
	className?: string;
}) {
	const iconClassName = cn("h-4 w-4", className);

	switch (extension) {
		case "html":
			return <SiHtml5 className={iconClassName} />;
		case "css":
		case "scss":
			return <SiCss3 className={iconClassName} />;
		case "js":
			return <SiJavascript className={iconClassName} />;
		case "jsx":
		case "tsx":
			return <SiReact className={iconClassName} />;
		case "ts":
			return <SiTypescript className={iconClassName} />;
		case "json":
			return <SiJson className={iconClassName} />;
		case "less":
			return <SiLess className={iconClassName} />;
		case "php":
			return <SiPhp className={iconClassName} />;
		case "py":
			return <SiPython className={iconClassName} />;
		case "sh":
		case "bash":
			return <SiGnubash className={iconClassName} />;
		case "blade.php":
			return <SiLaravel className={iconClassName} />;
		case "go":
			return <SiGo className={iconClassName} />;
		case "vue":
			return <SiVuedotjs className={iconClassName} />;
		case "svelte":
			return <SiSvelte className={iconClassName} />;
		case "astro":
			return <SiAstro className={iconClassName} />;
		case "json":
			return <SiJson className={iconClassName} />;
		case "env":
			return <SiDotenv className={iconClassName} />;
		case "lock":
			return <FileLock className={iconClassName} />;
		case "db":
		case "sql":
			return <Database className={iconClassName} />;
		case "sqlite":
			return <SiSqlite className={iconClassName} />;
		case "prisma":
			return <SiPrisma className={iconClassName} />;
		case "dockerfile":
		case "compose.yaml":
		case "compose.yml":
			return <SiDocker className={iconClassName} />;
		case "md":
			return <SiMarkdown className={iconClassName} />;
		case "jpg":
		case "jpeg":
		case "png":
		case "gif":
		case "webp":
			return <FileImage className={iconClassName} />;

		case "mp4":
			return <FileVideo2 className={iconClassName} />;

		case "svg":
			return <SiSvg className={iconClassName} />;

		default:
			return <File className={iconClassName} />;
	}
}
