import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, User, Bell, Mail, Trash2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export const UserTable = ({
  users,
  columnVisibility,
  selectedUsers,
  toggleUserSelection,
  toggleAllUsers,
  handleUserClick,
  handleDeleteClick,
}) => {
  const { onlineUsers } = useAuthStore();
  console.log(onlineUsers);

  return (
    <Table className="whitespace-nowrap">
      <TableHeader className="bg-muted sticky top-0">
        <TableRow>
          <TableHead>
            <Checkbox
              checked={
                selectedUsers.length === users.length && users.length > 0
              }
              onCheckedChange={toggleAllUsers}
            />
          </TableHead>
          {columnVisibility.fullName && <TableHead>Profile</TableHead>}
          {columnVisibility.email && <TableHead>Email</TableHead>}
          {columnVisibility.userName && <TableHead>Username</TableHead>}
          {columnVisibility.userId && <TableHead>User ID</TableHead>}
          {columnVisibility.authProvider && (
            <TableHead>Auth Provider</TableHead>
          )}
          {columnVisibility.lastLogin && <TableHead>Last Login</TableHead>}
          {columnVisibility.actions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell>
              <Checkbox
                checked={selectedUsers.includes(user._id)}
                onCheckedChange={() => toggleUserSelection(user._id)}
              />
            </TableCell>
            {columnVisibility.fullName && (
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        src={user.avatar}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback>
                        {user.fullName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {onlineUsers.includes(user._id) && (
                      <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-card"></div>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => handleUserClick(user)}
                      className="font-medium hover:underline focus:outline-none"
                    >
                      {user.fullName}
                    </button>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
            )}
            {columnVisibility.email && <TableCell>{user.email}</TableCell>}
            {columnVisibility.userName && (
              <TableCell>{user.userName}</TableCell>
            )}
            {columnVisibility.userId && (
              <TableCell className="font-mono text-xs">{user._id}</TableCell>
            )}
            {columnVisibility.authProvider && (
              <TableCell>
                <Badge variant={user.hasGoogleAuth ? "default" : "outline"}>
                  {user.hasGoogleAuth ? "Google" : "Email"}
                </Badge>
              </TableCell>
            )}
            {columnVisibility.lastLogin && (
              <TableCell>
                <div className="text-sm">
                  <div>
                    {user.lastLogin?.date
                      ? new Date(user.lastLogin.date).toLocaleString()
                      : "Never"}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {user.lastLogin?.ip || ""}
                  </div>
                </div>
              </TableCell>
            )}
            {columnVisibility.actions && (
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-6">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUserClick(user)}>
                      <User className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Send Notification</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      <span>Send Email</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteClick(user._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete User</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
