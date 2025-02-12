import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import ListKeymap from '@tiptap/extension-list-keymap'
import TextAlign from '@tiptap/extension-text-align'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'

import React, { useEffect, useState } from 'react'


import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'

// eslint-disable-next-line
import CodeBlockComponent from './CodeBlockComponent'

// create a lowlight instance
const lowlight = createLowlight(all)

// you can also register individual languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

import { Button } from './ui/Button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import TooltipWrapper from "./TooltipWrapper";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    ArrowDownToLine,
    ArrowLeftToLine,
    ArrowRightToLine,
    ArrowUpToLine,
    Bold,
    Code,
    CodeSquare,
    Ellipsis,
    EllipsisVertical,
    Eraser,
    Heading,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    HeadingIcon,
    HighlighterIcon,
    ImageIcon,
    Indent,
    Italic,
    List,
    ListChecks,
    ListOrdered,
    Loader2,
    Outdent,
    Palette,
    Pilcrow,
    Quote,
    Redo,
    Strikethrough,
    TableIcon,
    Trash,
    UnderlineIcon,
    Undo,
    Upload,
    UploadCloudIcon
} from 'lucide-react'
import { useNoteStore } from '@/stores/useNoteStore'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { useNavigate, useParams } from 'react-router-dom'
import NoteSkeleton from './sekeletons/NoteSkeleton'
import FileDropZone from './FileDropZone'

const formatingGroup = [
    {
        name: 'bold',
        icon: <Bold />,
        command: 'toggleBold',
        tooltip: 'Ctrl + B',
    },
    {
        name: 'italic',
        icon: <Italic />,
        command: 'toggleItalic',
        tooltip: 'Ctrl + I',
    },
    {
        name: 'underline',
        icon: <UnderlineIcon />,
        command: 'toggleUnderline',
        tooltip: 'Ctrl + U',
    },
    {
        name: 'strike',
        icon: < Strikethrough />,
        command: 'toggleStrike',
        tooltip: 'Ctrl + Shift + S',
    },
]

const listGroup = [
    {
        name: 'orderedList',
        icon: <ListOrdered />,
        command: 'toggleOrderedList',
        tooltip: "Ctrl + Shift + 7",
    },
    {
        name: 'bulletList',
        icon: <List />,
        command: 'toggleBulletList',
        tooltip: "Ctrl + Shift + 8",
    },
    {
        name: 'taskList',
        icon: <ListChecks />,
        command: 'toggleTaskList',
        tooltip: "Ctrl + Shift + 9",
    }
]

const listController = [
    {
        name: ['listItem', 'taskItem'],
        icon: <Outdent />,
        command: 'liftListItem',
        tooltip: "Lift list item/task item",
    },
    {
        name: ['listItem', 'taskItem'],
        icon: <Indent />,
        command: 'sinkListItem',
        tooltip: "Sink list item/task item",
    },
];


const blockGroup = [
    {
        name: 'codeBlock',
        icon: <CodeSquare />,
        command: 'toggleCodeBlock',
        tooltip: 'Code Block"',
    },
    {
        name: 'code',
        icon: <Code />,
        command: 'toggleCode',
        tooltip: 'Code',
    },
    {
        name: 'blockquote',
        icon: <Quote />,
        command: 'toggleBlockquote',
        tooltip: 'blockquote',
    },
];

const controller = [
    {
        icon: <Undo />,
        command: 'undo',
        tooltip: 'Ctrl + Z',
    },
    {
        icon: <Redo />,
        command: 'redo',
        tooltip: 'Ctrl + Y',
    },
]
const alignments = [
    {
        name: 'left',
        icon: <AlignLeft />,
        command: 'setTextAlign',
        tooltip: 'Ctrl + Shift + L',
    },
    {
        name: 'center',
        icon: <AlignCenter />,
        command: 'setTextAlign',
        tooltip: 'Ctrl + Shift + E',
    },
    {
        name: 'right',
        icon: <AlignRight />,
        command: 'setTextAlign',
        tooltip: 'Ctrl + Shift + R',
    },
    {
        name: 'justify',
        icon: <AlignJustify />,
        command: 'setTextAlign',
        tooltip: 'Ctrl + Shift + J',
    },
]

const tableGroup = [
    {
        icon: <TableIcon />,
        command: "insertTable",
        tooltip: "Insert talbe",
        params: {
            rows: 3, cols: 3, withHeaderRow: true
        },
    },
    {
        icon: <HeadingIcon />,
        command: "toggleHeaderRow",
        tooltip: "Toggle header",
    },
    {
        icon: <Trash />,
        command: "deleteTable",
        tooltip: "Delete table",
    },
];

const tableRowController = [
    {
        icon: <ArrowUpToLine />,
        command: "addRowBefore",
        tooltip: "Add row before",
    },
    {
        icon: <ArrowDownToLine />,
        command: "addRowAfter",
        tooltip: "Add row after",
    },
    {
        icon: <Trash />,
        command: "deleteRow",
        tooltip: "Delete row",
    },
];

const tableColumnController = [
    {
        icon: <ArrowLeftToLine />,
        command: "addColumnBefore",
        tooltip: "Add column before",
    },
    {
        icon: <ArrowRightToLine />,
        command: "addColumnAfter",
        tooltip: "Add column after",
    },
    {
        icon: <Trash />,
        command: "deleteColumn",
        tooltip: "Delete column",
    },
];

const colors = ['#fb7185', '#fdba74', '#d9f99d', '#a7f3d0', '#a5f3fc', '#a5b4fc'];

const MenuBar = ({ noteId }) => {
    const { editor } = useCurrentEditor()
    const navigate = useNavigate();

    const { updateContent, isContentUploading } = useNoteStore();
    if (!editor) {
        return null
    }
    const headers = [1, 2, 3, 4, 5, 6];
    const isEmptyContent = (htmlString) => {
        const contentRegex = /<[^>]*>(\s*[^<]*\S\s*|<img\s+[^>]*>.*?)<\/[^>]*>/;
        return !contentRegex.test(htmlString);
    }
    const handleContentSave = async () => {
        let content = editor.getHTML().replace(/<table/g, '<div class="tableWrapper"><table')
            .replace(/<\/table>/g, '</table></div>')
            .replace(/<pre/g, "<div class='relative pre-wrapper'><pre")
            .replace(/<\/pre>/g, '</pre></div>');

        if (isEmptyContent(content)) content = '';
        await updateContent({
            content,
            noteId: noteId
        });
        navigate(-1);
    }

    return (
        <div className="control-group mb-2 sticky top-0 z-10 bg-background border-b border-input">
            <div className="Button-group flex flex-wrap gap-1">

                {
                    formatingGroup.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                onClick={() => editor.chain().focus()[command]().run()}
                                disabled={!editor.can().chain().focus()[command]().run()}
                                variant={editor.isActive(name) ? 'secondary' : 'ghost'}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }
                {
                    blockGroup.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                onClick={() => editor.chain().focus()[command]().run()}
                                variant={editor.isActive(name) ? 'secondary' : 'ghost'}
                                disabled={name === 'code' && !editor.can().chain().focus()[command]().run()}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }

                {
                    listGroup.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                onClick={() => editor.chain().focus()[command]().run()}
                                variant={editor.isActive(name) ? 'secondary' : 'ghost'}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }

                {
                    listController.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    if (editor.can()[command](name[0])) {
                                        editor.chain().focus()[command](name[0]).run();
                                    } else if (editor.can()[command](name[1])) {
                                        editor.chain().focus()[command](name[1]).run();
                                    }
                                }}
                                disabled={!editor.can()[command](name[0]) && !editor.can()[command](name[1])}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }


                {
                    controller.map(({ icon, command, tooltip }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => editor.chain().focus()[command]().run()}
                                disabled={!editor.can().chain().focus()[command]().run()}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>
                    ))
                }

                {
                    alignments.map(({ icon, command, tooltip, name }, index) => (
                        <TooltipWrapper key={index} message={tooltip}>
                            <Button
                                size="icon"
                                onClick={() => editor.chain().focus()[command](name).run()}
                                variant={editor.isActive({ textAlign: name }) ? 'secondary' : 'ghost'}
                            >
                                {icon}
                            </Button>
                        </TooltipWrapper>

                    ))
                }

                <Select>
                    <SelectTrigger className="w-16">
                        <SelectValue placeholder={
                            editor.isActive('heading', { level: 1 }) ? <Heading1 className='size-5' /> :
                                editor.isActive('heading', { level: 2 }) ? <Heading2 className='size-5' /> :
                                    editor.isActive('heading', { level: 3 }) ? <Heading3 className='size-5' /> :
                                        editor.isActive('heading', { level: 4 }) ? <Heading4 className='size-5' /> :
                                            editor.isActive('heading', { level: 5 }) ? <Heading5 className='size-5' /> :
                                                editor.isActive('heading', { level: 6 }) ? <Heading6 className='size-5' /> :
                                                    editor.isActive('paragraph') ? <Pilcrow className='size-4' /> :
                                                        <Heading className='size-4' />
                        } />
                    </SelectTrigger>
                    <SelectContent className="flex-col">
                        {
                            headers.map((level, index) => (
                                <TooltipWrapper key={index} message={`Heading ${level}`}>
                                    <Button
                                        onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                                        variant={editor.isActive('heading', { level }) ? 'secondary' : 'ghost'}
                                    >
                                        H{level}
                                    </Button>
                                </TooltipWrapper>
                            ))
                        }
                        <Button
                            onClick={() => editor.chain().focus().setParagraph().run()}
                            variant={editor.isActive('paragraph') ? 'secondary' : 'ghost'}
                        >
                            <Pilcrow />
                        </Button>
                    </SelectContent>
                </Select>

                <TooltipWrapper message={"Highlighter"}>
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost"
                                    style={{
                                        backgroundColor: colors.find((color) => editor.isActive('highlight', { color })) || 'transparent'
                                    }}
                                >
                                    <HighlighterIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto flex items-center gap-1 p-2">
                                {
                                    colors.map(color => (
                                        <Button
                                            key={color}
                                            onClick={() => editor.chain().focus().setHighlight({ color }).run()}
                                            className={`relative w-8 h-8 ${editor.isActive('textStyle', { color }) ? 'bg-primary' : ''} hover:bg-accent rounded-md cursor-pointer`}
                                        >
                                            <div
                                                className="absolute inset-[6px] rounded-sm"
                                                style={{ backgroundColor: color }}
                                            />
                                        </Button>
                                    ))
                                }
                                <Button
                                    variant="ghost"
                                    onClick={() => editor.chain().focus().unsetHighlight().run()}
                                    data-testid="unsetHighlight"
                                >
                                    <Eraser />
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                </TooltipWrapper>



                <TooltipWrapper message={"Set Color"}>
                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost"
                                    style={{
                                        backgroundColor: colors.find((color) => editor.isActive('textStyle', { color })) || 'transparent'
                                    }}
                                >
                                    <Palette />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto flex items-center gap-1 p-2">
                                {
                                    colors.map(color => (
                                        <Button
                                            key={color}
                                            onClick={() => editor.chain().focus().setColor(color).run()}
                                            className={`relative w-8 h-8 ${editor.isActive('textStyle', { color }) ? 'bg-primary' : ''} hover:bg-accent rounded-md cursor-pointer`}
                                        >
                                            <div
                                                className="absolute inset-[6px] rounded-sm"
                                                style={{ backgroundColor: color }}
                                            />
                                        </Button>
                                    ))
                                }
                                <Button
                                    variant="ghost"
                                    onClick={() => editor.chain().focus().unsetColor().run()}
                                    data-testid="unsetColor"
                                >
                                    <Eraser />
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </div>
                </TooltipWrapper>

                <div className='border rounded-lg'>
                    <TableGroup
                        editor={editor}
                        controllers={tableGroup}
                        triggerIcon={<TableIcon />}
                    />
                    <TableGroup
                        editor={editor}
                        controllers={tableColumnController}
                        triggerIcon={<Ellipsis />}
                    />
                    <TableGroup
                        editor={editor}
                        controllers={tableRowController}
                        triggerIcon={<EllipsisVertical />}
                    />
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline"><ImageIcon /></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle style={{ display: "none" }}>Add Image</DialogTitle>
                        <FileDropZone editor={editor} />
                    </DialogContent>
                </Dialog>

                <TooltipWrapper message={"Save Content"}>
                    <Button
                        disabled={!noteId || isContentUploading}
                        onClick={handleContentSave}
                    >
                        {
                            isContentUploading ?
                                <Loader2 className='animate-spin' /> :
                                <><UploadCloudIcon />Save</>
                        }
                    </Button>
                </TooltipWrapper>
            </div>
        </div >
    )
}


function TableGroup({ controllers, triggerIcon, editor }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    {triggerIcon}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1 w-min" align="start">
                {
                    controllers.map((controller, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start p-2 font-normal leading-tight h-8"
                            onClick={() => editor.chain().focus()[controller.command]().run()}
                        >
                            {controller.icon} {controller.tooltip}
                        </Button>
                    ))
                }
            </PopoverContent>
        </Popover>
    )
};

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
    CodeBlockLowlight
        .extend({
            addNodeView() {
                return ReactNodeViewRenderer(CodeBlockComponent)
            },
        })
        .configure({ lowlight }),
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    Underline,
    ListKeymap,
    TaskList,
    TaskItem.configure({
        nested: true,
    }),
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({
        placeholder: "Write someting ...",
    }),
    Image,
]


const Tiptap = () => {
    const { getNoteContent, isContentLoading } = useNoteStore();
    const { id: noteId } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (noteId) {
                const noteContent = await getNoteContent(noteId);
                setContent(noteContent);
                setLoading(false);
            }
        };
        fetchData();
    }, [noteId, getNoteContent]);


    if (isContentLoading || loading) {
        return <NoteSkeleton />;
    }
    return (
        <EditorProvider
            className="h-full opacity-0"
            slotBefore={<MenuBar noteId={noteId} />}
            extensions={extensions}
            content={content}
        />
    );
};
export default Tiptap;