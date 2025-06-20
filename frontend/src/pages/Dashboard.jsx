import AppSidebar from "@/components/dashboard/AppSidebar";
import { ModeToggle } from "@/components/mode-toggle";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarCloseTrigger,
  SidebarInset,
  SidebarOpenTrigger,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, Outlet } from "react-router-dom";
import { useRouteStore } from "@/stores/useRouteStore";
import React from "react";
import { Button } from "@/components/ui/button";
import { Github, Plus } from "lucide-react";
import AddNoteDialog from "@/components/AddNoteDialog";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

const DashboardContent = () => {
  const { routes } = useRouteStore();
  const { authUser } = useAuthStore();
  const { isSidebarOpen } = useSidebar();
  const { theme } = useTheme();

  return (
    <>
      <AppSidebar />

      <SidebarInset className="scrollbar-custom relative w-max h-svh overflow-hidden">
        <header className="z-50 flex border border-b sticky top-0 bg-background justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            {!isSidebarOpen && (
              <>
                <TooltipWrapper message={"Open Sidebar Ctrl M"}>
                  <SidebarOpenTrigger className="-ml-1" />
                </TooltipWrapper>
                <Separator orientation="vertical" className="mr-2 h-4" />
              </>
            )}
            <Breadcrumb>
              <BreadcrumbList className="flex-nowrap">
                {routes.length > 1 ? (
                  <>
                    <BreadcrumbItem>
                      <DropdownMenu
                        modal={true}
                        className="z-50 transition-all"
                      >
                        <DropdownMenuTrigger className="flex items-center gap-1">
                          <BreadcrumbEllipsis className="size-4" />
                          <span className="sr-only">Toggle menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="bg-popover w-32 max-w-52 p-1 border transition-all rounded-lg"
                          align="start"
                        >
                          {routes.slice(0, -1).map((route, index) => (
                            <DropdownMenuItem
                              key={index}
                              className="px-2 py-1 whitespace-nowrap overflow-hidden overflow-ellipsis cursor-pointer hover:bg-accent rounded-sm text-foreground"
                            >
                              <Link to={route.path}>{route.name}</Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                ) : null}

                {/* Always show the last route */}
                {routes.length > 0 && (
                  <BreadcrumbItem className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                    <Link
                      to={routes[routes.length - 1].path}
                      className="text-foreground"
                    >
                      {routes[routes.length - 1].name}
                    </Link>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="mr-4 flex items-center gap-2">
            <AddNoteDialog
              trigger={
                <Button className={`size-8 sm:size-auto`}>
                  <Plus />
                  <span className={`hidden sm:block`}>Add Note</span>
                </Button>
              }
            />

            <a href="https://github.com/abhijeetSinghRajput/notehub">
              <Button className="size-8 p-0" variant="ghost">
                <img
                  src={
                    theme === "dark"
                      ? "/github-mark-white.svg"
                      : "/github-mark.svg"
                  }
                  alt="github logo"
                  className="size-5 object-contain"
                />
              </Button>
            </a>

            <ModeToggle />

            <TooltipWrapper message={authUser.fullName || "user"}>
              <Link
                to="/profile"
                className="size-8 overflow-hidden rounded-full"
              >
                <Avatar>
                  <AvatarImage
                    src={authUser?.avatar}
                    alt={authUser?.fullName}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="rounded-lg">
                    {authUser
                      ? authUser.fullName
                          .trim()
                          .split(/\s+/)
                          .map((w) => w[0].toUpperCase())
                          .join("")
                          .slice(0, 2)
                      : "NH"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </TooltipWrapper>
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </>
  );
};

export default Dashboard;
