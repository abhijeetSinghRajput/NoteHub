// AdminLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { SidebarProvider } from "../ui/sidebar";
import AdminHeader from "./AdminHeader";

export function AdminLayout() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="flex h-screen">
      <SidebarProvider defaultOpen={false}>
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <AdminHeader />
          <div className="md:p-6 sm:p-4 p-2 flex-shrink-0 w-full">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}