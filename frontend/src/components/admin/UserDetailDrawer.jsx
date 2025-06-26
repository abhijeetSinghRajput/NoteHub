import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Mail,
  Globe,
  Calendar,
  Clock,
  Shield,
  Key,
  Activity,
  HardDrive,
  Smartphone,
  MapPin,
  User as UserIcon,
  CreditCard,
  Lock,
  AlertCircle,
  Folders,
  Files
} from "lucide-react"

export function UserDetailDrawer({ user, open, onClose }) {
  if (!user) return null

  // Mock data for activity and login history
  const activities = [
    { id: 1, action: "Created note", date: "2025-06-24T10:30:45.000Z", details: "Note ID: N-12345" },
    { id: 2, action: "Updated collection", date: "2025-06-23T14:22:18.000Z", details: "Collection: Work" },
    { id: 3, action: "Logged in", date: "2025-06-23T09:15:33.000Z", details: "From Chrome on Windows" },
  ]

  const loginHistory = [
    { id: 1, date: "2025-06-24T10:30:45.000Z", ip: "192.168.1.1", device: "Chrome on Windows 10", location: "New York, US" },
    { id: 2, date: "2025-06-23T09:15:33.000Z", ip: "192.168.1.1", device: "Chrome on Windows 10", location: "New York, US" },
    { id: 3, date: "2025-06-22T18:45:12.000Z", ip: "203.0.113.42", device: "Safari on iPhone", location: "San Francisco, US" },
  ]

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
            
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {console.log(user.avatar)}
                  <AvatarImage src={user.avatar} referrerpolicy="no-referrer" />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{user.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={user.isOnline ? "default" : "secondary"}>
                      {user.isOnline ? "Online" : "Offline"}
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
                  <Input id="userId" value={user._id.$oid} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="createdAt">Account Created</Label>
                  <Input
                    id="createdAt"
                    value={new Date(user.createdAt.$date).toLocaleString()}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastLogin">Last Login</Label>
                  <Input
                    id="lastLogin"
                    value={new Date(user.lastLogin.date).toLocaleString()}
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
                      <span>{user.notesCount} notes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Folders className="h-4 w-4" />
                      <span>{user.collectionsCount} collections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{user.currentStreak} day streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{user.maxStreak} max streak</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last Login Details</Label>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>{user.lastLogin.device}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>{user.lastLogin.ip}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Reset Password</Button>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
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
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">
                          {user.lastLogin.device}
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
                      <p>{user.lastLogin.ip}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Location</p>
                      <p>New York, US</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Last Active</p>
                      <p>{new Date(user.lastLogin.date).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
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
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        {activity.action}
                      </TableCell>
                      <TableCell>{activity.details}</TableCell>
                      <TableCell className="text-right">
                        {new Date(activity.date).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {activities.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mb-2" />
                  <p>No activity recorded</p>
                </div>
              )}
            </TabsContent>

            {/* Login History Tab */}
            <TabsContent value="login-history">
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
                        {new Date(login.date).toLocaleString()}
                      </TableCell>
                      <TableCell>{login.device}</TableCell>
                      <TableCell>{login.ip}</TableCell>
                      <TableCell>{login.location}</TableCell>
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
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  )
}