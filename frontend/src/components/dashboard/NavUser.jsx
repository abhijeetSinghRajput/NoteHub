"use client"

import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Settings,
    Sparkles,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/stores/useAuthStore"
import { Link } from "react-router-dom"

const NavUser = () => {
    const { isMobile } = useSidebar();
    const { authUser } = useAuthStore();
    const { logout } = useAuthStore();
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >

                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={authUser?.avatarUrl} alt={authUser?.fullName} />
                                <AvatarFallback className="rounded-lg">
                                    {
                                        authUser ?
                                            authUser.fullName.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('').slice(0, 2) :
                                            "NH"
                                    }
                                </AvatarFallback>
                            </Avatar>

                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{authUser?.fullName}</span>
                                <span className="truncate text-xs">{authUser?.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <Link to="/profile">
                            <DropdownMenuItem>
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={authUser?.avatarUrl} alt={authUser?.fullName} />
                                    <AvatarFallback className="rounded-lg">
                                        {
                                            authUser ?
                                                authUser.fullName.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('').slice(0, 2) :
                                                "NH"
                                        }
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{authUser?.fullName}</span>
                                    <span className="truncate text-xs">{authUser?.email}</span>
                                </div>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <Link to='/settings'>
                                <DropdownMenuItem>
                                    <Settings />
                                    Settings
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}


export default NavUser;