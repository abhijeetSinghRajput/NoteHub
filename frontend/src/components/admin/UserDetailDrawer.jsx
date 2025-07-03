import { useState, useEffect } from "react";
import axios from "axios";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Globe,
  Calendar,
  Clock,
  Activity,
  Smartphone,
  UserIcon,
  AlertCircle,
  Folders,
  Files,
  Lock,
} from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";

// Helper functions
const formatDeviceInfo = (device) => {
  if (!device) return "Unknown device";
  return `${device.browser?.name || "Unknown browser"} on ${
    device.os?.name || "Unknown OS"
  }`;
};

const formatLocation = (location) => {
  if (!location) return "Unknown location";
  return `${location.city || ""}${
    location.city && location.country ? ", " : ""
  }${location.country || ""}`;
};

// Sub-components
const ProfileTab = ({ user }) => {
  const { onlineUsers } = useAuthStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} referrerPolicy="no-referrer" />
            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          {onlineUsers.includes(user._id) && (
            <div className="absolute bottom-0.5 right-0.5 size-3 bg-green-500 rounded-full border-2 border-background"></div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium">{user.fullName}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="flex gap-2 mt-1">
            <Badge
              variant={onlineUsers.includes(user._id) ? "default" : "secondary"}
            >
              {onlineUsers.includes(user._id) ? "Online" : "Offline"}
            </Badge>
            <Badge variant={user.hasGoogleAuth ? "default" : "outline"}>
              {user.hasGoogleAuth ? "Google Auth" : "Email Auth"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" value={user.userName} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <Input id="userId" value={user._id} readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="createdAt">Account Created</Label>
          <Input
            id="createdAt"
            value={new Date(user.createdAt).toLocaleString()}
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastLogin">Last Login</Label>
          <Input
            id="lastLogin"
            value={
              user.lastLogin
                ? new Date(user.lastLogin.date).toLocaleString()
                : "Never"
            }
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6 gap-8">
        <div className="space-y-2">
          <Label>Statistics</Label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Files className="h-4 w-4" />
              <span>{user.notesCount || 0} notes</span>
            </div>
            <div className="flex items-center gap-2">
              <Folders className="h-4 w-4" />
              <span>{user.collectionsCount || 0} collections</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{user.currentStreak || 0} day streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{user.maxStreak || 0} max streak</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Last Login Details</Label>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span>{user.lastLogin?.device || "No login data"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>{user.lastLogin?.ip || "Unknown IP"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">Reset Password</Button>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  );
};

const SecurityTab = ({ user, sessions, loading, error, onLogoutAll }) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <h4 className="font-medium">Authentication</h4>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-1">
          <Label>Two-Factor Authentication</Label>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>
        <Switch checked={false} />
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-1">
          <Label>Email Verification</Label>
          <p className="text-sm text-muted-foreground">
            Verify your email address
          </p>
        </div>
        <Badge variant="default">Verified</Badge>
      </div>
      {user.hasGoogleAuth && (
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label>Google Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Connected to Google account
            </p>
          </div>
          <Badge variant="default">Active</Badge>
        </div>
      )}
    </div>

    <div className="space-y-4">
      <h4 className="font-medium">Sessions</h4>
      {loading ? (
        <div className="flex justify-center py-4">
          <p>Loading sessions...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 border rounded-lg">
          Error loading sessions: {error}
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {sessions
              .filter((s) => s.isActive)
              .map((session) => (
                <div key={session.id} className="bg-input/30 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
                      <div>
                        <p className="font-medium">
                          {session.logoutTime
                            ? "Past Session"
                            : "Current Session"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDeviceInfo(session.device)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Logout
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">IP Address</p>
                      <p>{session.ipAddress}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Location</p>
                      <p>{formatLocation(session.location)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Last Active</p>
                      <p>{new Date(session.loginTime).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <Button variant="outline" onClick={onLogoutAll} disabled={loading}>
            Logout All Sessions
          </Button>
        </>
      )}
    </div>

    <div className="space-y-4">
      <h4 className="font-medium">Danger Zone</h4>
      <div className="border rounded-lg p-4 bg-muted">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Delete Account
            </h5>
            <p className="text-sm text-muted-foreground">
              Permanently delete this user account
            </p>
          </div>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
    </div>
  </div>
);

const ActivityTab = () => (
  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
    <Activity className="h-8 w-8 mb-2" />
    <p>Activity tracking coming soon</p>
  </div>
);

const LoginHistoryTab = ({ loginHistory, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <p>Loading login history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border rounded-lg">
        Error loading login history: {error}
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loginHistory.map((login) => (
            <TableRow key={login.id}>
              <TableCell>
                {new Date(login.loginTime).toLocaleString()}
              </TableCell>
              <TableCell>{formatDeviceInfo(login.device)}</TableCell>
              <TableCell>{login.ipAddress}</TableCell>
              <TableCell>{formatLocation(login.location)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {loginHistory.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Lock className="h-8 w-8 mb-2" />
          <p>No login history available</p>
        </div>
      )}
    </>
  );
};

// Main component
export function UserDetailDrawer({ user, open, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState({
    sessions: false,
    loginHistory: false,
    logoutAll: false,
  });
  const [error, setError] = useState({
    sessions: null,
    loginHistory: null,
  });

  const fetchSessions = async () => {
    try {
      setLoading((prev) => ({ ...prev, sessions: true }));
      setError((prev) => ({ ...prev, sessions: null }));
      const response = await axiosInstance.get(
        `/auth/sessions?userId=${user?._id}`
      );
      setSessions(response.data);
    } catch (err) {
      setError((prev) => ({
        ...prev,
        sessions: err instanceof Error ? err.message : "Unknown error",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, sessions: false }));
    }
  };

  const fetchLoginHistory = async () => {
    try {
      setLoading((prev) => ({ ...prev, loginHistory: true }));
      setError((prev) => ({ ...prev, loginHistory: null }));
      const response = await axiosInstance.get(
        `/auth/login-history?userId=${user?._id}`
      );
      setLoginHistory(response.data);
    } catch (err) {
      setError((prev) => ({
        ...prev,
        loginHistory: err instanceof Error ? err.message : "Unknown error",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, loginHistory: false }));
    }
  };

  const handleLogoutAll = async () => {
    try {
      setLoading((prev) => ({ ...prev, logoutAll: true }));
      await axiosInstance.post("/auth/logout-all", { userId: user?._id });
      await fetchSessions();
    } catch (err) {
      console.error("Failed to logout all sessions:", err);
    } finally {
      setLoading((prev) => ({ ...prev, logoutAll: false }));
    }
  };

  useEffect(() => {
    if (open && user) {
      fetchSessions();
      fetchLoginHistory();
    }
  }, [open, user]);

  if (!user) return null;

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>User Details</DrawerTitle>
          <DrawerDescription>
            Manage {user.fullName}'s account
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="login-history">Login History</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab user={user} />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab
                user={user}
                sessions={sessions}
                loading={loading.sessions || loading.logoutAll}
                error={error.sessions}
                onLogoutAll={handleLogoutAll}
              />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTab />
            </TabsContent>

            <TabsContent value="login-history">
              <LoginHistoryTab
                loginHistory={loginHistory}
                loading={loading.loginHistory}
                error={error.loginHistory}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
