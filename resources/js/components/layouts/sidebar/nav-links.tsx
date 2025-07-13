"use client";

// Necessary imports
import { Link } from "@inertiajs/react";

// Shadcn UI components
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";

// Icons
import { ChevronRight, type LucideIcon } from "lucide-react";

export function NavLinks({
	title,
	className,
	items,
}: {
	title?: string;
	className?: string;
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		active?: boolean;
		items?: {
			title: string;
			url: string;
			active?: boolean;
		}[];
	}[];
}) {
	const { openMenu: contextOpenMenu, setOpenMenu: contextSetOpenMenu } =
		useSidebar();

	return (
		<SidebarGroup className={className}>
			{title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}

			<SidebarMenu>
				{items.map((item) => {


					const isOpen = contextOpenMenu === item.title;
					const hasActiveSubItem = item.items?.some((subItem) => subItem.active);
					const shouldBeOpen = isOpen || hasActiveSubItem;

					return (
						<Collapsible
							key={item.title}
							open={shouldBeOpen}
							onOpenChange={(open) => contextSetOpenMenu(open ? item.title : null)}
							asChild
						>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									isActive={item.active}
								>
									<Link href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>

								{item.items?.length ? (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuAction
												className="data-[state=open]:rotate-90"
												disabled={hasActiveSubItem}
											>
												<ChevronRight />
												<span className="sr-only">Toggle</span>
											</SidebarMenuAction>
										</CollapsibleTrigger>

										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items.map((subItem) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild isActive={subItem.active}>
															<Link href={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</>
								) : null}
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
