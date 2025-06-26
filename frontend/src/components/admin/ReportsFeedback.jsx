import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Check, X, MessageSquare, Filter, LayoutGrid, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ReportsFeedback() {
  // Mock data
  const reports = [
    {
      id: 1,
      date: "2023-11-15",
      user: "john_doe",
      type: "Bug Report",
      content: "Unable to upload profile picture",
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      date: "2023-11-14",
      user: "jane_smith",
      type: "Feature Request",
      content: "Add dark mode support",
      status: "in_progress",
      priority: "medium"
    },
    {
      id: 3,
      date: "2023-11-13",
      user: "alex_wong",
      type: "Feedback",
      content: "Improve mobile navigation",
      status: "resolved",
      priority: "low"
    }
  ]

  const [searchQuery, setSearchQuery] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState({
    date: true,
    user: true,
    type: true,
    content: true,
    priority: true,
    status: true,
    actions: true
  })

  const filteredReports = reports.filter(report =>
    report.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" /> Pending</Badge>
      case 'in_progress':
        return <Badge><span className="animate-pulse mr-1">•</span> In Progress</Badge>
      case 'resolved':
        return <Badge variant="default"><Check className="w-3 h-3 mr-1" /> Resolved</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="warning">Medium</Badge>
      case 'low':
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <CardTitle>User Reports & Feedback</CardTitle>
            <div className="flex gap-2">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Input
              placeholder="Search reports..."
              className="w-full md:w-64 bg-input/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-input/30">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Reports</DropdownMenuItem>
                  <DropdownMenuItem>Pending</DropdownMenuItem>
                  <DropdownMenuItem>In Progress</DropdownMenuItem>
                  <DropdownMenuItem>Resolved</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-input/30">
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.keys(columnVisibility).map((column) => (
                    <DropdownMenuItem
                      key={column}
                      onSelect={(e) => {
                        e.preventDefault()
                        setColumnVisibility(prev => ({
                          ...prev,
                          [column]: !prev[column]
                        }))
                      }}
                      className="capitalize"
                    >
                      <div className="flex items-center space-x-2">
                        {columnVisibility[column] ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <span className="w-4 h-4" />
                        )}
                        <span>{column}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden rounded-lg border">
            <Table className="whitespace-nowrap">
              <TableHeader className="bg-muted sticky top-0">
                <TableRow>
                  {columnVisibility.date && <TableHead>Date</TableHead>}
                  {columnVisibility.user && <TableHead>User</TableHead>}
                  {columnVisibility.type && <TableHead>Type</TableHead>}
                  {columnVisibility.content && <TableHead>Content</TableHead>}
                  {columnVisibility.priority && <TableHead>Priority</TableHead>}
                  {columnVisibility.status && <TableHead>Status</TableHead>}
                  {columnVisibility.actions && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    {columnVisibility.date && <TableCell>{report.date}</TableCell>}
                    {columnVisibility.user && <TableCell className="font-medium">{report.user}</TableCell>}
                    {columnVisibility.type && (
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                    )}
                    {columnVisibility.content && (
                      <TableCell className="max-w-xs truncate">
                        {report.content}
                      </TableCell>
                    )}
                    {columnVisibility.priority && (
                      <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                    )}
                    {columnVisibility.status && (
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                    )}
                    {columnVisibility.actions && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          {report.status !== 'resolved' && (
                            <Button variant="ghost" size="sm" className="text-green-600">
                              Resolve
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <X className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">-1 from last week</p>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">+5 from last week</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}