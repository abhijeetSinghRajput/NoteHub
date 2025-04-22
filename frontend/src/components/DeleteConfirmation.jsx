import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

const DeleteConfirmation = ({ onCancel, onDelete }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="rounded-md font-normal p-2 flex items-center text-sm h-auto w-full justify-start gap-2 text-red-500 hover:bg-red-400/20 hover:text-red-500">
        <Trash2 className="size-4 opacity-60" />
        <span>Delete</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            files'
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel();
              document.body.style.pointerEvents = "auto";
            }}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => {
              onDelete();
              document.body.style.pointerEvents = "auto";
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmation;
