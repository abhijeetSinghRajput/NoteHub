import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mail, Trash2 } from "lucide-react";

export const SelectedUsersActions = ({
  selectedUsers,
  handleDeleteClick,
}) => {
  if (selectedUsers.length === 0) return null;

  return (
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
  );
};