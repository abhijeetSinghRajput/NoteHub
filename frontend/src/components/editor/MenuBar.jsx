import React, { useRef } from 'react';
import { useCurrentEditor } from '@tiptap/react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore } from '@/stores/useNoteStore';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from '../ui/dialog';
import {
    UploadCloudIcon,
    Loader2,
    HighlighterIcon,
    Palette,
    TableIcon,
    Ellipsis,
    EllipsisVertical,
    ImageIcon,
    SquareDivide
} from 'lucide-react';
import TooltipWrapper from '../TooltipWrapper';
import { SelectHeading } from './SelectHeading';
import { ColorPicker } from './ColorPicker';
import { TablePopover } from './TablePopover';
import {
    FORMATTING_BUTTONS,
    LIST_BUTTONS,
    LIST_CONTROL_BUTTONS,
    BLOCK_BUTTONS,
    CONTROL_BUTTONS,
    ALIGNMENT_BUTTONS,
    TABLE_BUTTONS,
    TABLE_ROW_CONTROLS,
    TABLE_COLUMN_CONTROLS,
    COLORS
} from './config/menu.config';
import FileDropZone from '../FileDropZone';
import { MathsSymbol } from './MathsSymbol';

export const MenuBar = ({ noteId }) => {
    const { editor } = useCurrentEditor();
    const navigate = useNavigate();
    const { updateContent, isContentUploading } = useNoteStore();
    const imageTrigger = useRef(null);


    if (!editor) {
        return null;
    }

    const isEmptyContent = (htmlString) => {
        const contentRegex = /<[^>]*>(\s*[^<]*\S\s*|<img\s+[^>]*>.*?)<\/[^>]*>/;
        return !contentRegex.test(htmlString);
    };

    const handleContentSave = async () => {
        let content = editor.getHTML()
            .replace(/[^\S\r\n]/g, ' ')
            .replace(/<table/g, '<div class="tableWrapper"><table')
            .replace(/<\/table>/g, '</table></div>')
            .replace(/<pre/g, "<div class='relative pre-wrapper'><pre")
            .replace(/<\/pre>/g, '</pre></div>');

        if (isEmptyContent(content)) content = '';
        await updateContent({
            content,
            noteId: noteId
        });
        console.log(`/notes/${noteId}`);
        navigate(`/note/${noteId}`);
    };



    return (
        <div className="control-group mb-2 sticky top-0 z-10 bg-background border-b border-input">
            <div className="Button-group flex flex-wrap gap-1">
                {
                    FORMATTING_BUTTONS.map(({ icon, command, tooltip, name }, index) => (
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
                    BLOCK_BUTTONS.map(({ icon, command, tooltip, name }, index) => (
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
                    LIST_BUTTONS.map(({ icon, command, tooltip, name }, index) => (
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
                    LIST_CONTROL_BUTTONS.map(({ icon, command, tooltip, name }, index) => (
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
                    CONTROL_BUTTONS.map(({ icon, command, tooltip }, index) => (
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
                    ALIGNMENT_BUTTONS.map(({ icon, command, tooltip, name }, index) => (
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
                <SelectHeading editor={editor} />

                <MathsSymbol  editor={editor}/>

                <ColorPicker
                    icon={HighlighterIcon}
                    tooltipMessage="Highlighter"
                    colors={COLORS}
                    activeColor={COLORS.find((color) => editor.isActive('highlight', { color }))}
                    onColorSelect={(color) => editor.chain().focus().setHighlight({ color }).run()}
                    onUnsetColor={() => editor.chain().focus().unsetHighlight().run()}
                    isActive={(color) => editor.isActive('highlight', { color })}
                />

                <ColorPicker
                    icon={Palette}
                    tooltipMessage="Set Color"
                    colors={COLORS}
                    activeColor={COLORS.find((color) => editor.isActive('textStyle', { color }))}
                    onColorSelect={(color) => editor.chain().focus().setColor(color).run()}
                    onUnsetColor={() => editor.chain().focus().unsetColor().run()}
                    isActive={(color) => editor.isActive('textStyle', { color })}
                />

                <div className='border rounded-lg'>
                    <TablePopover
                        editor={editor}
                        controllers={TABLE_BUTTONS}
                        triggerIcon={<TableIcon />}
                    />
                    <TablePopover
                        editor={editor}
                        controllers={TABLE_COLUMN_CONTROLS}
                        triggerIcon={<Ellipsis />}
                    />
                    <TablePopover
                        editor={editor}
                        controllers={TABLE_ROW_CONTROLS}
                        triggerIcon={<EllipsisVertical />}
                    />
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button ref={imageTrigger} variant="outline"><ImageIcon /></Button>
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
                        {isContentUploading ? <Loader2 className='animate-spin' /> : <><UploadCloudIcon />Save</>}
                    </Button>
                </TooltipWrapper>
            </div>
        </div>
    );
};