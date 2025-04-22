import AppSidebar from "@/components/dashboard/AppSidebar";
import { ModeToggle } from "@/components/mode-toggle";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
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
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Github, Plus } from "lucide-react";
import AddNoteDialog from "@/components/AddNoteDialog";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useContributionStore } from "@/stores/useContributionStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import DateCalendar from "@/components/streak/DateCalendar";
import { useTheme } from "@/components/theme-provider";

const Dashboard = () => {  
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

const DashboardContent = () => {
  const { theme } = useTheme();
  const { routes } = useRouteStore();
  const { authUser } = useAuthStore();
  const { isSidebarOpen } = useSidebar();
  const { hasContributedToday } = useContributionStore();
  const [date, setDate] = useState(new Date());

  return (
    <>
      <AppSidebar />

      <SidebarInset className="scrollbar-custom relative w-max h-svh overflow-hidden">
        <header className="flex border border-b sticky top-0 z-10 bg-background justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                {routes.map((route, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      <Link to={route.path} className="text-foreground">
                        {route.name}
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </React.Fragment>
                ))}
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
              <TooltipWrapper message="Source Code">
                <Button className="size-8 p-0" variant="ghost">
                  <img
                    className="size-5"
                    src={`./github-mark${theme === 'dark' ? '-white' : ''}.svg`}
                    alt="GitHub icon"
                  />

                </Button>
              </TooltipWrapper>
            </a>

            <TooltipWrapper message="Toggle Theme">
              <ModeToggle />
            </TooltipWrapper>

            <Popover className="z-10">
              <PopoverTrigger>
                <div
                  className={`rounded-md hover:bg-accent flex items-center h-8 p-2 gap-1 ${
                    hasContributedToday
                      ? "text-[#ff8828]"
                      : "text-muted-foreground"
                  }`}
                >
                  {hasContributedToday ? (
                    <img
                      className="size-4"
                      src="/flame-active.svg"
                      alt="Active Streak"
                    />
                  ) : (
                    <Flame className="size-4" />
                  )}
                  {authUser?.currentStreak ?? 0}
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <DateCalendar/>
              </PopoverContent>
            </Popover>

            <TooltipWrapper message={authUser.fullName || "user"}>
              <Link
                to="/profile"
                className="size-8 overflow-hidden rounded-full"
              >
                <Avatar>
                  <AvatarImage
                    src={authUser?.avatarUrl}
                    alt={authUser?.fullName}
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
