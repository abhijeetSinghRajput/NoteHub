import React, { useState } from "react";
import { Bell, Check, Circle, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "System Update Available",
      message: "A new version of the system is available for installation.",
      type: "system",
      read: false,
      time: "10 min ago",
    },
    {
      id: "2",
      title: "Security Alert",
      message: "Unusual login attempt detected from a new device.",
      type: "security",
      read: false,
      time: "25 min ago",
    },
    {
      id: "3",
      title: "Maintenance Scheduled",
      message: "System maintenance is scheduled for tomorrow at 2:00 AM.",
      type: "system",
      read: true,
      time: "1 hour ago",
    },
    {
      id: "4",
      title: "Password Changed",
      message:
        "Your password was successfully changed. hello then they have only onet hing to do but did you notice one thing that notification has been arrived and i discovered one more thing that is dp is the most popular topics for the ",
      type: "security",
      read: true,
      time: "2 hours ago",
    },
    {
      id: "5",
      title: "New Message",
      message: "You have received a new message from the support team.",
      type: "message",
      read: false,
      time: "5 hours ago",
    },
    {
      id: "6",
      title: "Backup Completed",
      message: "The nightly backup was completed successfully.",
      type: "system",
      read: true,
      time: "1 day ago",
    },
  ]);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !notification.read;
    return notification.type === activeFilter;
  });

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full overflow-x-auto">
      <div className="space-y-6 p-4 max-w-screen-lg w-full m-auto">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Notifications
            </h2>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setActiveFilter("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("unread")}>
                  Unread
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("system")}>
                  System
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("security")}>
                  Security
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={clearAll}
            >
              Clear all
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveFilter("all")}>
              All
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              onClick={() => setActiveFilter("unread")}
            >
              Unread{" "}
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="system"
              onClick={() => setActiveFilter("system")}
            >
              System
            </TabsTrigger>
            <TabsTrigger
              value="security"
              onClick={() => setActiveFilter("security")}
            >
              Security
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeFilter === "all" && "All Notifications"}
              {activeFilter === "unread" && "Unread Notifications"}
              {activeFilter === "system" && "System Notifications"}
              {activeFilter === "security" && "Security Notifications"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start p-2 border rounded-lg cursor-pointer bg-input/30 hover:bg-accent transition-colors`}
                >
                  <div className="space-y-1 w-full overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-sm truncate font-medium flex items-center gap-1 ${
                          !notification.read
                            ? "text-primary"
                            : "text-muted-foreground"
                        } truncate`}
                      >
                        {!notification.read && <Circle fill="#ff6568" stroke="#ff6568" size={10}/>}
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 w-full">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationPage;
