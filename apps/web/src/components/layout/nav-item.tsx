"use client";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@darasa-lako/ui/components/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

export function NavItem({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: ComponentType<{ className?: string }>;
	}[];
}) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu className="gap-2">
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								tooltip={item.title}
								isActive={pathname === item.url}
								// biome-ignore lint/suspicious/noExplicitAny: item.url is a valid route string; as any required for Next.js typed routes
								render={<Link href={item.url as any} />}
							>
								{item.icon && <item.icon />}
								<span className="text-sm">{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
