import React from 'react';
import { Separator } from './ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { EllipsisVertical, Folder, FolderOutput, Pencil, Trash2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { useNoteStore } from '@/stores/useNoteStore';
import DeleteConfirmation from './DeleteConfirmation';

const NotesOption = ({ trigger, note, onRenameStart }) => {
    const { isMobile } = useIsMobile();
    const { moveTo, deleteNote, collections } = useNoteStore();
    const [open, setOpen] = React.useState(false);
    const [moveOpen, setMoveOpen] = React.useState(false);

    const handleMove = React.useCallback(async (collectionId) => {
        await moveTo({
            collectionId,
            noteId: note._id,
        });
        setMoveOpen(false);
        setOpen(false);
    }, [moveTo, note._id]);

    const handleDelete = React.useCallback(() => {
        deleteNote(note._id);
        setOpen(false);
    }, [deleteNote, note._id]);

    const handleRename = React.useCallback(() => {
        onRenameStart();
        setOpen(false);
    }, [onRenameStart]);

    return (
        <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="ghost" 
                    className="flex-shrink-0 p-1 size-6 text-muted-foreground hover:text-foreground"
                >
                    {trigger}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-48 rounded-lg p-1"
                side={isMobile ? "bottom" : "right"}
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <Button
                    variant="ghost"
                    className="font-normal p-2 h-auto w-full justify-start gap-2"
                    onClick={handleRename}
                >
                    <Pencil className="size-4 text-muted-foreground" />
                    <span>Rename</span>
                </Button>

                <Popover open={moveOpen} onOpenChange={setMoveOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="font-normal p-2 h-auto w-full justify-start gap-2"
                        >
                            <FolderOutput className="size-4 text-muted-foreground" />
                            <span>Move to</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                        className="p-0 w-48" 
                        side={isMobile ? "bottom" : "right"}
                        align="start"
                    >
                        <Command>
                            <CommandInput placeholder="Search collections..." />
                            <CommandList>
                                <CommandEmpty>No collections found</CommandEmpty>
                                <CommandGroup>
                                    {collections
                                        .filter(c => c._id !== note.collectionId)
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
                    </PopoverContent>
                </Popover>

                <Separator orientation="horizontal" className="my-1" />
                <DeleteConfirmation onDelete={handleDelete}/>
            </PopoverContent>
        </Popover>
    );
};

export default NotesOption;