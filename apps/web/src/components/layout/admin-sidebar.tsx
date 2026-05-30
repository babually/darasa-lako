"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Book,
  FileText,
} from "lucide-react"

import { NavItem } from "./nav-item"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@darasa-lako/ui/components/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      title: "My Notes",
      url: "/dashboard/notes",
      icon: Book,
    },
    {
      title: "Exams",
      url: "/dashboard/exams",
      icon: FileText,
    },
    {
      title: "Resources",
      url: "/dashboard/resources",
      icon: Users,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              render={<Link href='/dashboard/overview' className="flex items-center gap-2" />}
            >
              <div className='bg-primary text-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-md'>
                <LayoutDashboard className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>Darasa Lako Hub</span>
                <span className='text-muted-foreground truncate text-xs'>Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavItem items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}