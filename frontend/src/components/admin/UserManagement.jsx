"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MoreVertical,
  Trash2,
  Mail,
  Bell,
  User,
  ChevronDown,
  Plus,
  LayoutGrid,
  CircleCheck,
  Loader2,
  Check,
  Filter,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { UserDetailDrawer } from "./UserDetailDrawer";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import users from "./mock_users.json";
import { Label } from "../ui/label";

export function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({
    fullName: true,
    email: false,
    userName: true,
    userId: true,
    authProvider: true,
    lastLogin: true,
    actions: true,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id.$oid));
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeDrawer = () => {
    setSelectedUser(null);
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Here you would call your API to delete the user
    alert(`User ${userToDelete} deleted successfully`);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setIsLoading(true);

    try {
      // Here you would fetch users based on the selected tab
      // For example:
      // const response = await fetch(`/api/users?filter=${tab}`);
      // const data = await response.json();
      // setUsers(data.users);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count users for each tab (in a real app, this would come from the backend)
  const onlineUsersCount = users.filter((user) => user.isOnline).length;
  const oauthUsersCount = users.filter((user) => user.hasGoogleAuth).length;

  // Calculate paginated users
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Mangement
          </CardTitle>

          {/* Search Bar */}
          <div className="flex gap-2">
            <Input
              placeholder="Search users..."
              className="w-full bg-input/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Controls - Desktop */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex-1 pb-2">
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="online">
                    <div className="flex items-center gap-1">
                      Online{" "}
                      <Badge variant="secondary" className="px-1">
                        {onlineUsersCount}
                      </Badge>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="oauth">
                    <div className="flex items-center gap-2">
                      OAuth{" "}
                      <Badge variant="secondary" className="px-1">
                        {oauthUsersCount}
                      </Badge>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <LayoutGrid className="size-4" />
                    <span>Columns</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-48">
                  {Object.keys(columnVisibility).map((column) => (
                    <DropdownMenuItem
                      key={column}
                      onSelect={(e) => {
                        e.preventDefault();
                        setColumnVisibility((prev) => ({
                          ...prev,
                          [column]: !prev[column],
                        }));
                      }}
                      className="capitalize"
                    >
                      <div className="flex items-center space-x-2">
                        {columnVisibility[column] ? (
                          <Check className="size-4 text-primary" />
                        ) : (
                          <span className="size-4" />
                        )}
                        <span>{column}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>
                <Plus className="mr-2 size-4" />
                Add User
              </Button>
            </div>
          </div>

          {/* Filter Controls - Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <Select value={activeTab} onValueChange={handleTabChange}>
              <SelectTrigger className="w-[180px] bg-input/30 h-8">
                <SelectValue placeholder="Select filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="online">
                    Online ({onlineUsersCount})
                  </SelectItem>
                  <SelectItem value="oauth">
                    OAuth ({oauthUsersCount})
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-input/30 h-8">
                  <LayoutGrid className="size-4" />
                  <span>Columns</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.keys(columnVisibility).map((column) => (
                  <DropdownMenuItem
                    key={column}
                    onSelect={(e) => {
                      e.preventDefault();
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [column]: !prev[column],
                      }));
                    }}
                    className="capitalize"
                  >
                    <div className="flex items-center space-x-2">
                      {columnVisibility[column] ? (
                        <Check className="size-4 text-primary" />
                      ) : (
                        <span className="size-4" />
                      )}
                      <span>{column}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="icon" className="ml-auto size-8">
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {/* Table with horizontal scrolling */}
        {!isLoading && (
          <div className="space-y-4">
            <div className="flex-1 overflow-hidden rounded-lg border">
              <div className="relative w-full overflow-auto">
                <Table className="whitespace-nowrap">
                  <TableHeader className="bg-muted sticky top-0">
                    <TableRow>
                      <TableHead>
                        <Checkbox
                          checked={
                            selectedUsers.length === filteredUsers.length &&
                            filteredUsers.length > 0
                          }
                          onCheckedChange={toggleAllUsers}
                        />
                      </TableHead>
                      {columnVisibility.fullName && (
                        <TableHead>Profile</TableHead>
                      )}
                      {columnVisibility.email && <TableHead>Email</TableHead>}
                      {columnVisibility.userName && (
                        <TableHead>Username</TableHead>
                      )}
                      {columnVisibility.userId && (
                        <TableHead>User ID</TableHead>
                      )}
                      {columnVisibility.authProvider && (
                        <TableHead>Auth Provider</TableHead>
                      )}
                      {columnVisibility.lastLogin && (
                        <TableHead>Last Login</TableHead>
                      )}
                      {columnVisibility.actions && (
                        <TableHead>Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow key={user._id.$oid}>
                        <TableCell>
                          <Checkbox
                            checked={selectedUsers.includes(user._id.$oid)}
                            onCheckedChange={() =>
                              toggleUserSelection(user._id.$oid)
                            }
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
                                    {user.userName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>

                                {user.isOnline && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
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
                        {columnVisibility.email && (
                          <TableCell>{user.email}</TableCell>
                        )}
                        {columnVisibility.userName && (
                          <TableCell>{user.userName}</TableCell>
                        )}
                        {columnVisibility.userId && (
                          <TableCell className="font-mono text-xs">
                            {user._id.$oid}
                          </TableCell>
                        )}
                        {columnVisibility.authProvider && (
                          <TableCell>
                            <Badge
                              variant={
                                user.hasGoogleAuth ? "default" : "outline"
                              }
                            >
                              {user.hasGoogleAuth ? "Google" : "Email"}
                            </Badge>
                          </TableCell>
                        )}
                        {columnVisibility.lastLogin && (
                          <TableCell>
                            <div className="text-sm">
                              <div>
                                {new Date(user.lastLogin.date).toLocaleString()}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {user.lastLogin.ip}
                              </div>
                            </div>
                          </TableCell>
                        )}
                        {columnVisibility.actions && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-6"
                                >
                                  <MoreVertical className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleUserClick(user)}
                                >
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
                                  onClick={() =>
                                    handleDeleteClick(user._id.$oid)
                                  }
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
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Label className="hidden sm:block">Rows per page</Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                >
                  <SelectTrigger className="gap-2 w-min sm:w-[80px] h-8">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-input/30 size-8"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-input/30 size-8"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-input/30 size-8"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-input/30 size-8"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedUsers.length > 0 && (
          <Card className="mt-10 bg-muted">
            <CardHeader className="p-4 pb-0">
              <CardTitle>{selectedUsers.length} user(s) selected</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteClick(selectedUsers)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>

      <UserDetailDrawer
        user={selectedUser}
        open={!!selectedUser}
        onClose={closeDrawer}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${
          Array.isArray(userToDelete) ? "these users" : "this user"
        }? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
