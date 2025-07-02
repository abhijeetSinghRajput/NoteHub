"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { UserDetailDrawer } from "./UserDetailDrawer";
import { ConfirmDialog } from "./ConfirmDialog";
import { UserTable } from "./UserTable";
import { FilterControls } from "./FilterControls";
import { SelectedUsersActions } from "./SelectedUsersActions";
import { useAuthStore } from "@/stores/useAuthStore";
import { PaginationControls } from "./PaginationControls.jsx";

export function UserManagement() {
  const { getUser, getAllUsers } = useAuthStore();

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
  const [usersData, setUsersData] = useState({
    users: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalUsers: 0,
      usersPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    counts: {
      all: 0,
      online: 0,
      oauth: 0,
    },
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, activeTab, searchQuery]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers(
        currentPage,
        itemsPerPage,
        searchQuery,
        activeTab
      );
      setUsersData(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === usersData.users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(usersData.users.map((user) => user._id));
    }
  };

  const handleUserClick = async (user) => {
    // Fetch fresh user data if needed
    // const freshUser = await getUser(user._id);
    // setSelectedUser(freshUser || user);
    setSelectedUser(user);
  };

  const closeDrawer = () => {
    setSelectedUser(null);
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Here you would call your API to delete the user
      // await deleteUser(userToDelete);
      alert(`User ${userToDelete} deleted successfully`);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      setSelectedUsers([]);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
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

          <FilterControls
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            onlineUsersCount={usersData.counts.online}
            oauthUsersCount={usersData.counts.oauth}
          />

          <FilterControls
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            onlineUsersCount={usersData.counts.online}
            oauthUsersCount={usersData.counts.oauth}
            isMobile
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex-1 overflow-hidden rounded-lg border">
              <div className="relative w-full overflow-auto">
                <UserTable
                  users={usersData.users}
                  columnVisibility={columnVisibility}
                  selectedUsers={selectedUsers}
                  toggleUserSelection={toggleUserSelection}
                  toggleAllUsers={toggleAllUsers}
                  handleUserClick={handleUserClick}
                  handleDeleteClick={handleDeleteClick}
                />
              </div>
            </div>

            <PaginationControls
              currentPage={usersData.pagination.currentPage}
              totalPages={usersData.pagination.totalPages}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              setCurrentPage={setCurrentPage}
            />

            <SelectedUsersActions
              selectedUsers={selectedUsers}
              handleDeleteClick={handleDeleteClick}
            />
          </div>
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
