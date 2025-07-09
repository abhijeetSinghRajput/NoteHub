import React from 'react';
import { Button } from '../ui/button';
import TooltipWrapper from '../TooltipWrapper';
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pilcrow,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Heading
} from 'lucide-react';


export const SelectHeading = ({ editor }) => {
    const headers = [1, 2, 3, 4, 5, 6];

    return (
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
                {headers.map((level, index) => (
                    <TooltipWrapper key={index} message={`Heading ${level}`}>
                        <Button
                            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                            variant={editor.isActive('heading', { level }) ? 'secondary' : 'ghost'}
                        >
                            H{level}
                        </Button>
                    </TooltipWrapper>
                ))}
                <Button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    variant={editor.isActive('paragraph') ? 'secondary' : 'ghost'}
                >
                    <Pilcrow />
                </Button>
            </SelectContent>
        </Select>
    );
};