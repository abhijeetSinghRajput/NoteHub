import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Bell, MessageSquare, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function CommunicationTools() {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Communication Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Tabs defaultValue="broadcast" className="w-full">
          <TabsList className="grid w-full h-auto grid-cols-3">
            <TabsTrigger value="broadcast" className="flex gap-2 lg:p-2">
              <Bell className="w-4 h-4" />
              Broadcast
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex gap-2 lg:p-2">
              <Mail className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex gap-2 lg:p-2">
              <MessageSquare className="w-4 h-4" />
              Email Logs
            </TabsTrigger>
          </TabsList>

          {/* Broadcast Tab */}
          <TabsContent value="broadcast">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <Select>
                  <SelectTrigger className="bg-input/30" id="recipients">
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="selected">Selected Users</SelectItem>
                    <SelectItem value="online">Online Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  className="min-h-32 bg-input/30"
                  placeholder="Enter your broadcast message..."
                />
              </div>
              <Button className="w-full sm:w-auto">Send Broadcast</Button>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-medium text-lg">Notification Templates</h3>
                <Button variant="outline" className="flex gap-2 bg-input/30">
                  <Plus className="w-4 h-4" />
                  Add Template
                </Button>
              </div>

              <Card className="divide-y">
                {[
                  "Welcome Message",
                  "Password Reset",
                  "Account Verification",
                ].map((template) => (
                  <div
                    key={template}
                    className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <h4 className="font-medium">{template}</h4>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                      <Button size="sm">
                        Preview
                      </Button>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </TabsContent>

          {/* Email Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>{new Date().toLocaleString()}</TableCell>
                      <TableCell>user{i}@example.com</TableCell>
                      <TableCell>Sample Email Subject</TableCell>
                      <TableCell>
                        <Badge variant="success">Delivered</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
