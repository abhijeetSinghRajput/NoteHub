// AdminSidebar.jsx
"use client";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  ChevronsUpDown,
  LogOut,
  Users,
  Mail,
  AlertCircle,
  Trash2,
  Menu,
  X,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { Button } from "@/components/ui/button";

const data = {
  user: {
    name: "Abhijeet Singh",
    email: "abhijeet62008@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Communication",
      url: "/admin/communication",
      icon: Mail,
    },
    {
      title: "Reports & Feedback",
      url: "/admin/reports",
      icon: AlertCircle,
    },
    {
      title: "Trash bin",
      url: "/admin/trash",
      icon: Trash2,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AdminSidebar({ ...props }) {
  const { isCollapsed } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex gap-2 items-center">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>
          {!isCollapsed && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Notehub</span>
              <span className="truncate text-xs">Admin Dashboard</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function NavMain({ items }) {
  const location = useLocation(); // Get current location

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="peer-data-[collapsed]:hidden">
        Panels
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = location.pathname === item.url || 
                         location.pathname.startsWith(`${item.url}/`);
          
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="p-0 h-auto"
                tooltip={item.title}
                asChild
              >
                <Link
                  to={item.url}
                  className={cn(
                    "flex gap-2 px-2 py-2 w-full",
                    "peer-data-[collapsed]:justify-center",
                    "md:justify-start",
                    isActive && "bg-accent text-accent-foreground" // Active state styling
                  )}
                >
                  {item.icon && (
                    <item.icon className={cn(
                      "flex-shrink-0 size-4",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                  )}
                  <span className="peer-data-[collapsed]:hidden md:block">
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavUser({ user }) {
  const { isMobile, isCollapsed } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}