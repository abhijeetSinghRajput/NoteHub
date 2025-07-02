import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  EllipsisVertical,
  Folder,
  FolderOutput,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { useNoteStore } from '@/stores/useNoteStore';

const NotesOption = ({ trigger, note, setIsRenaming }) => {
  const { collections, moveTo, deleteNote } = useNoteStore();
  const { isMobile } = useIsMobile();

  const handleMove = async (collectionId) => {
    await moveTo({ collectionId, noteId: note._id });
  };

  const handleDelete = () => {
    deleteNote(note._id);
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex-shrink-0 p-1 size-6 text-muted-foreground hover:text-foreground"
        >
          {trigger}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side={isMobile ? 'bottom' : 'right'} align="start" className="w-48">
        <DropdownMenuItem onClick={()=>setIsRenaming(true)} className="gap-2">
          <Pencil className="size-4 text-muted-foreground" />
          Rename
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2">
            <FolderOutput className="size-4 text-muted-foreground" />
            Move to
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-0">
            <Command>
              <CommandInput placeholder="Search collections..." />
              <CommandList>
                <CommandEmpty>No collections found</CommandEmpty>
                <CommandGroup>
                  {collections
                    .filter((c) => c._id !== note.collectionId)
                    .map((collection) => (
                      <CommandItem
                        key={collection._id}
                        value={collection.name}
                        onSelect={() => handleMove(collection._id)}
                        className="gap-2"
                      >
                        <Folder className="size-4 text-muted-foreground" />
                        {collection.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDelete}
          className="gap-2 text-red-500 focus:bg-red-400/20 focus:text-red-500"
        >
          <Trash2 className="size-4" />
          Delete Note
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotesOption;
