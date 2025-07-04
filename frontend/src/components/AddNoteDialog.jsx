import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Folder, FolderPlus, Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { useNoteStore } from "@/stores/useNoteStore"
import { useNavigate } from "react-router-dom"

const AddNoteDialog = ({ trigger }) => {
    const [noteName, setNoteName] = useState('');
    const [collectionName, setCollectionName] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const {
        collections,
        createCollection,
        isCreatingCollection,

        createNote,
        isCreatingNote
    } = useNoteStore();

    const [selectedCollection, setSelectedCollection] = useState(null);


    const handleAddNote = async () => {
        const noteId = await createNote({
            name: noteName,
            collectionId: selectedCollection._id,
            content: `<h1>${noteName}</h1>`
        })

        setNoteName('');
        setOpen(false);
        navigate(`/note/${noteId}/editor`);
    }
    const handleAddCollection = async () => {
        const collection = await createCollection({ name: collectionName });
        if (collection) {
            setSelectedCollection(collection);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] rounded-lg scrollbar-sm">
                <DialogHeader>
                    <DialogTitle className="hidden">Create Note</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <div className="mb-5 space-y-2">
                        <div>
                            {!noteName.trim() && <p className="text-sm mb-1 text-red-500">Note Name required</p>}
                            <Input
                                placeholder="Note Title"
                                id="name"
                                value={noteName}
                                onChange={e => setNoteName(e.target.value)}
                            />
                        </div>
                        <Input
                            readOnly
                            placeholder="No collection Selected"
                            className="pointer-events-none"
                            value={selectedCollection?.name}
                        />
                    </div>

                    <div className="">
                        <Command className="border max-h-52 rounded-b-none">
                            <CommandInput placeholder="Choose a Collection ..." />
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                    {
                                        collections.map((collection) => (
                                            <CommandItem
                                                key={collection._id}
                                                value={collection.name}
                                                onSelect={() => setSelectedCollection(collection)}
                                            >
                                                <Folder className="text-muted-foreground" /> {collection.name}
                                            </CommandItem>
                                        ))
                                    }
                                </CommandGroup>
                            </CommandList>
                        </Command>
                        <div className="relative">
                            <Input
                                className="pr-10 rounded-t-none border-t-0"
                                placeholder="Add Collection"
                                value={collectionName}
                                onChange={(e) => setCollectionName(e.target.value)}
                            />
                            <Button
                                disabled={isCreatingCollection || !collectionName.trim()}
                                variant="outline"
                                className="absolute top-0 right-0 rounded-s-none overflow-hidden"
                                onClick={handleAddCollection}
                                size="icon"
                            >
                                {
                                    isCreatingCollection ?
                                        <Loader2 className="animate-spin" /> :
                                        <FolderPlus />
                                }
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        disabled={!selectedCollection || isCreatingNote || !noteName.trim()}
                        onClick={handleAddNote}>
                        {
                            isCreatingNote ?
                                <>
                                    <Loader2 className="animate-spin" /> Adding...
                                </> :
                                <>
                                    <Plus /> Add Note
                                </>
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNoteDialog