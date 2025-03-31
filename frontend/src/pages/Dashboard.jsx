import AppSidebar from "@/components/dashboard/AppSidebar";
import { ModeToggle } from "@/components/mode-toggle";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarCloseTrigger,
  SidebarInset,
  SidebarOpenTrigger,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link, Outlet } from "react-router-dom";
import { useRouteStore } from "@/stores/useRouteStore";
import React from "react";
import { Button } from "@/components/ui/button";
import { Github, Plus } from "lucide-react";
import AddNoteDialog from "@/components/AddNoteDialog";
import TooltipWrapper from "@/components/TooltipWrapper";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

const DashboardContent = () => {
  const { routes } = useRouteStore();
  const { isSidebarOpen } = useSidebar();

  return (
    <>
      <AppSidebar />

      <SidebarInset className="scrollbar-custom relative h-svh overflow-hidden">
        <header className="flex border border-b sticky top-0 z-10 bg-background justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            {!isSidebarOpen && (
              <>
                <TooltipWrapper message={"Open Sidebar"}>
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
                      <Link to={route.path} className="text-primary">
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
              <Button className="size-8" variant="ghost">
                <Github />
              </Button>
            </a>
            <ModeToggle />
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </>
  );
};

export default Dashboard;