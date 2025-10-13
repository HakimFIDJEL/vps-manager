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
import { 
	Tabs,
	TabsBody,
	TabsContent,
	TabsNavigation,
	TabsTrigger,
	TabsList,
	useTabsContext
} from "@/components/ui/tabs";

// Icons
import { ChevronRight, File, FileX, Folder } from "lucide-react";

// Types
import type { FS_FileStructure, FS_Element } from "@/lib/files/type";

// Sidebar
type SidebarProps = ComponentProps<typeof Sidebar>;
type FE_SidebarProps = SidebarProps & {
	file_structure: FS_FileStructure;
	active_element?: FS_Element;
	set_pinned_elements?: React.Dispatch<React.SetStateAction<FS_Element[]>>;
	disabled?: boolean;
};

function FE_Sidebar({
	file_structure,
	disabled = false,
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
	pinned_elements: FS_Element[];
	set_pinned_elements: React.Dispatch<React.SetStateAction<FS_Element[]>>;
};

function FE_Header({
	active_element,
	pinned_elements,
	set_pinned_elements,
}: FE_HeaderProps) {
	return (
		<header>
				<FE_HeaderNav
					active_element={active_element}
					pinned_elements={pinned_elements}
					set_pinned_elements={set_pinned_elements}
				/>
		</header>
	);
}

type FE_HeaderNavProps = {
	active_element?: FS_Element;
	pinned_elements?: FS_Element[];
	set_pinned_elements?: React.Dispatch<React.SetStateAction<FS_Element[]>>;
};
function FE_HeaderNav({
	active_element,
	pinned_elements,
	set_pinned_elements,
}: FE_HeaderNavProps) {
	const { currentValue } = useTabsContext();
	const [hoverStyle, setHoverStyle] = React.useState({});
	const [activeStyle, setActiveStyle] = React.useState({
		left: "0px",
		width: "0px",
	});
	const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
	const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	// Animation of highlight
	React.useEffect(() => {
		if (hoveredIndex !== null) {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}

			const hoveredElement = tabRefs.current[hoveredIndex];
			if (hoveredElement) {
				const { offsetLeft, offsetWidth } = hoveredElement;
				setHoverStyle({
					left: `${offsetLeft}px`,
					width: `${offsetWidth}px`,
				});
			}
		}
	}, [hoveredIndex]);

	// Animation of indicator
	React.useEffect(() => {

		if (!pinned_elements || pinned_elements.length === 0) {
			setActiveStyle({
				left: "0px",
				width: "0px",
			});
			return;
		}

		const activeIndex = pinned_elements.findIndex((element) => element.path === currentValue);

		const activeElement = tabRefs.current[activeIndex];
		if (activeElement) {
			const { offsetLeft, offsetWidth } = activeElement;
			setActiveStyle({
				left: `${offsetLeft}px`,
				width: `${offsetWidth}px`,
			});
		}
	}, [currentValue]);

	return (
		<div className="relative border-b">
			{/* Hover Highlight */}
			<div
				className="absolute h-full duration-200 bg-accent rounded-md flex items-center pointer-events-none"
				style={{
					...hoverStyle,
					opacity: hoveredIndex !== null ? 1 : 0,
				}}
			/>

			{/* Active Indicator */}
			<div
				className="absolute bottom-[-2px] h-[3px] bg-primary duration-200 pointer-events-none z-2 rounded-md"
				style={activeStyle}
			/>

			{!pinned_elements || pinned_elements.length === 0 ? (
				<></>
			) : (

				<TabsList
					className="!bg-transparent rounded-none h-auto space-x-[6px] relative border-0 px-2"
					onMouseLeave={() => {
						setHoveredIndex(null);
						timeoutRef.current = setTimeout(() => {
							setHoverStyle({});
						}, 200);
					}}
				>
					{pinned_elements.map((element, index) => (
						<TabsTrigger
							key={element.path}
							value={element.path}
							ref={(el) => (tabRefs.current[index] = el)}
							className="px-2 py-1 text-sm whitespace-nowrap !shadow-none !bg-transparent data-[state=inactive]:!text-muted-foreground data-[state=active]:text-foreground hover:bg-transparent data-[state=inactive]:hover:!text-foreground rounded-sm relative"
							onMouseEnter={() => {
								setHoveredIndex(index);
							}}
							onMouseLeave={() => setHoveredIndex(null)}
						>
							{/* Function for icon */}
							{element.name}
						</TabsTrigger>
					))}
				</TabsList>
			)}

		</div>
	);
}

// Content
type FE_ContentProps = {
	active_element?: FS_Element;
	disabled?: boolean;
};
function FE_Content({ active_element, disabled }: FE_ContentProps) {
	return (
		<Tabs className="flex-1 h-full w-full overflow-auto">
			{active_element ? (
				<TabsContent value={active_element.path}>
					{active_element.name}
				</TabsContent>
			) : (
				<div className="flex h-full justify-center items-center flex-col">
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<FileX />
							</EmptyMedia>
							<EmptyTitle>No file opened</EmptyTitle>
							<EmptyDescription>
								You have no file opened. Open a file from the sidebar to view its
								content.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				</div>
			)}
		</Tabs>
	);
}

// Body
type FE_BodyProps = FE_HeaderProps & {
	disabled?: boolean;
};
function FE_Body({
	file_structure,
	active_element,
	pinned_elements,
	set_pinned_elements,
	disabled,
}: FE_BodyProps) {
	return (
		<div className="flex flex-col w-full h-full">
			<FE_Header
				file_structure={file_structure}
				active_element={active_element}
				pinned_elements={pinned_elements}
				set_pinned_elements={set_pinned_elements}
			/>
			<FE_Content active_element={active_element} disabled={disabled} />
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
	const [pinnedElements, setPinnedElements] = React.useState<FS_Element[]>(file_structure.elements.length > 0 ? [file_structure.elements[0]] : []);
	const [activeElement, setActiveElement] = React.useState<
		FS_Element | undefined
	>(undefined);

	return (
		<SidebarProvider>
			<ResizablePanelGroup
				className="w-full relative flex rounded-md border overflow-hidden h-auto"
				direction={"horizontal"}
			>
				<ResizablePanel defaultSize={20} minSize={15} maxSize={50}>
					<FE_Sidebar
						file_structure={file_structure}
						active_element={activeElement}
						set_pinned_elements={setPinnedElements}
						disabled={disabled}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel>
					<SidebarInset className="h-full">
						<FE_Body
							file_structure={file_structure}
							active_element={activeElement}
							pinned_elements={pinnedElements}
							set_pinned_elements={setPinnedElements}
							disabled={disabled}
						/>
					</SidebarInset>
				</ResizablePanel>
			</ResizablePanelGroup>
		</SidebarProvider>
	);
}
