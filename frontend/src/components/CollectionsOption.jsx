import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import React, { useEffect, useState, useCallback } from 'react'
import { SidebarMenuAction, useSidebar } from './ui/sidebar'
import { Button } from './ui/button'
import { Bookmark, FilePlus2, MoreHorizontal, Pencil, Pin, PinOff, Plus, Trash2 } from 'lucide-react'
import { DropdownMenuSeparator, Label } from '@radix-ui/react-dropdown-menu'
import { Input } from './ui/input'
import { useNoteStore } from '@/stores/useNoteStore'
import { Separator } from './ui/separator'
import { useNavigate } from 'react-router-dom'
import DeleteConfirmation from './DeleteConfirmation'

const CollectionsOption = ({
    trigger,
    collection,
    onOpenChange,
    pinnedCollections,
    setPinnedCollections,
    onRenameStart
}) => {
    const { isMobile } = useSidebar();
    const [noteName, setNoteName] = useState('');
    const [open, setOpen] = useState(false);
    const {
        deleteCollection,
        renameCollection,
        createNote,
    } = useNoteStore();
    const navigate = useNavigate();

    const togglePin = useCallback(() => {
        const maxPinned = 3;
        if (pinnedCollections.includes(collection._id)) {
            const newPinnedCollections = pinnedCollections.filter(id => id !== collection._id);
            setPinnedCollections(newPinnedCollections);
            localStorage.setItem('pinnedCollections', JSON.stringify(newPinnedCollections));
        } else {
            const newPinnedCollections = [collection._id, ...pinnedCollections.slice(0, maxPinned - 1)];
            setPinnedCollections(newPinnedCollections);
            localStorage.setItem('pinnedCollections', JSON.stringify(newPinnedCollections));
        }
        setOpen(false);
    }, [collection._id, pinnedCollections, setPinnedCollections]);

    const insertNote = useCallback(async () => {
        if (!noteName.trim()) return;

        const noteId = await createNote({
            name: noteName,
            collectionId: collection._id
        });
        setNoteName('');
        navigate(`/note/${noteId}/editor`);
        setOpen(false);
    }, [noteName, collection._id, createNote, navigate]);

    const handleRename = useCallback(() => {
        onRenameStart();
        setOpen(false);
    }, [onRenameStart]);

    const handleDelete = useCallback(() => {
        deleteCollection(collection._id);
        setOpen(false);
    }, [collection._id, deleteCollection]);

    const handleOpenChange = useCallback((isOpen) => {
        setOpen(isOpen);
        onOpenChange?.(isOpen);
    }, [onOpenChange]);

    return (
        <Popover
            modal={true}
            open={open}
            onOpenChange={handleOpenChange}
        >
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent
                className="w-48 rounded-lg p-1 bg-popover border"
                side="bottom"
                align={isMobile ? "end" : "start"}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <Button
                    variant="ghost"
                    className="font-normal p-2 h-auto w-full justify-start gap-2"
                    onClick={togglePin}
                >
                    {!pinnedCollections.includes(collection._id) ? (
                        <>
                            <Pin className="size-4 text-muted-foreground" />
                            <span>Pin Top</span>
                        </>
                    ) : (
                        <>
                            <PinOff className="size-4 text-muted-foreground" />
                            <span>Unpin</span>
                        </>
                    )}
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="font-normal p-2 h-auto w-full justify-start gap-2"
                        >
                            <FilePlus2 className="size-4 text-muted-foreground" />
                            <span>Insert Note</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-64 rounded-lg bg-popover p-4 border"
                        side="bottom"
                        align="end"
                    >
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Insert Note</h4>
                                <p className="text-sm text-muted-foreground">
                                    Add a new note to this collection
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="collectionName">Name</Label>
                                    <Input
                                        id="collectionName"
                                        className="h-8"
                                        value={noteName}
                                        onChange={(e) => setNoteName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                insertNote();
                                            }
                                        }}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={insertNote}
                                disabled={!noteName.trim()}
                                className="gap-2"
                            >
                                <Plus className="size-4" />
                                <span>Add Note</span>
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button
                    variant="ghost"
                    className="font-normal p-2 h-auto w-full justify-start gap-2"
                    onClick={handleRename}
                >
                    <Pencil className="size-4 text-muted-foreground" />
                    <span>Rename</span>
                </Button>

                <Separator orientation="horizontal" className="my-1" />
                
                <DeleteConfirmation onDelete={handleDelete}/>
                
            </PopoverContent>
        </Popover>
    )
}

export default CollectionsOption