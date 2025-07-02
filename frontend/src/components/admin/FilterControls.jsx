import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FilterControls = ({
  activeTab,
  handleTabChange,
  columnVisibility,
  setColumnVisibility,
  onlineUsersCount,
  oauthUsersCount,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <div className="flex md:hidden items-center gap-2">
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger className="w-[180px] bg-input/30 h-8">
            <SelectValue placeholder="Select filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="online">Online ({onlineUsersCount})</SelectItem>
              <SelectItem value="oauth">OAuth ({oauthUsersCount})</SelectItem>
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
    );
  }

  return (
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
  );
};