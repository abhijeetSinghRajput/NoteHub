import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, User, FileText, Folder, RotateCw, Delete } from "lucide-react"

export function TrashBin() {
  // Mock data
  const deletedUsers = [
    {
      id: 1,
      name: "john_doe",
      email: "john@example.com",
      deletedAt: "2023-11-15",
      deletedBy: "admin"
    }
  ]

  const deletedNotes = [
    {
      id: 1,
      title: "Meeting Notes",
      deletedAt: "2023-11-14",
      deletedBy: "user123"
    }
  ]

  const deletedCollections = [
    {
      id: 1,
      name: "Project Ideas",
      deletedAt: "2023-11-13",
      deletedBy: "user456"
    }
  ]

  return (
    <Card className="w-full max-w-screen-xl">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Trash Bin
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users" className="flex gap-2">
              <User className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex gap-2">
              <FileText className="w-4 h-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex gap-2">
              <Folder className="w-4 h-4" />
              Collections
            </TabsTrigger>
          </TabsList>

          {/* Deleted Users Tab */}
          <TabsContent value="users">
            <div className="rounded-lg overflow-hidden border">
              <Table className="whitespace-nowrap">
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Deleted At</TableHead>
                    <TableHead>Deleted By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.deletedAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.deletedBy}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex gap-1">
                            <RotateCw className="w-4 h-4" />
                            Restore
                          </Button>
                          <Button variant="destructive" size="sm" className="flex gap-1">
                            <Delete className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Deleted Notes Tab */}
          <TabsContent value="notes">
            <div className="rounded-lg overflow-hidden border">
              <Table className="whitespace-nowrap">
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Note Title</TableHead>
                    <TableHead>Deleted At</TableHead>
                    <TableHead>Deleted By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedNotes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">{note.title}</TableCell>
                      <TableCell>{note.deletedAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{note.deletedBy}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex gap-1">
                            <RotateCw className="w-4 h-4" />
                            Restore
                          </Button>
                          <Button variant="destructive" size="sm" className="flex gap-1">
                            <Delete className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Deleted Collections Tab */}
          <TabsContent value="collections">
            <div className="rounded-lg overflow-hidden border">
              <Table className="whitespace-nowrap">
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Collection Name</TableHead>
                    <TableHead>Deleted At</TableHead>
                    <TableHead>Deleted By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedCollections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell className="font-medium">{collection.name}</TableCell>
                      <TableCell>{collection.deletedAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{collection.deletedBy}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex gap-1">
                            <RotateCw className="w-4 h-4" />
                            Restore
                          </Button>
                          <Button variant="destructive" size="sm" className="flex gap-1">
                            <Delete className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}