import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { ModeToggle } from "../mode-toggle";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

import {
  AlertCircle,
  ChevronDown,
  MessageSquare,
  Trash2,
  Users,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const navs = [
  {
    name: "User Management",
    Icon: Users,
    path: "/admin/users",
  },
  {
    name: "Communication",
    Icon: MessageSquare,
    path: "/admin/communication",
  },
  {
    name: "Reports & Feedback",
    Icon: AlertCircle,
    path: "/admin/reports",
  },
  {
    name: "Trash bin",
    Icon: Trash2,
    path: "/admin/trash",
  },
];

const AdminHeader = () => {
  const location = useLocation();
  const pathnames = ["", ...location.pathname.split("/").filter((x) => x)];
  const isActivePath = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header className="z-50 px-4 lg:px-6 flex sticky top-0 bg-background h-12 shring-0 items-center gap-2 border-b transition-[width, height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 border-l h-5 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex sm:hidden items-center gap-1">
                  <BreadcrumbEllipsis className="size-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="space-y-1"
                  align="start"
                >
                  {pathnames.map((name, i) => {
                    const route =
                      "/" +
                      pathnames
                        .slice(0, i + 1)
                        .filter(Boolean)
                        .join("/");
                    if (i < pathnames.length - 1) {
                      return (
                        <DropdownMenuItem key={name} style={{padding: 0}}>
                          <Link className="w-full px-2 py-1.5" to={route}>{name || "notehub"}</Link>
                        </DropdownMenuItem>
                      );
                    }
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              <BreadcrumbSeparator className="sm:hidden block" />
            </BreadcrumbItem>

            {pathnames.map((name, i) => {
              const route =
                "/" +
                pathnames
                  .slice(0, i + 1)
                  .filter(Boolean)
                  .join("/");
              if (i < pathnames.length - 1)
                return (
                  <div key={i} className="hidden sm:flex items-center gap-2">
                    <BreadcrumbItem>
                      <BreadcrumbLink>
                        <Link to={route}>{name || "notehub"}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </div>
                );
              return (
                <>
                  <BreadcrumbPage>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1">
                        <div>{name}</div>
                        <ChevronDown size={16} />
                        <span className="sr-only">Toggle menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="space-y-1"
                        align="start"
                      >
                        {navs.map(({ name, path, Icon }) => {
                          return (
                            <DropdownMenuItem
                              key={name}
                              className={`${isActivePath(path) && "bg-accent"}`}
                              style={{padding: 0}}
                            >
                              <Link className="flex items-center w-full gap-2 px-2 py-1.5" to={path}>
                                <Icon size={16}/>
                                {name}
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbPage>
                </>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
};

export default AdminHeader;
