import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import React from 'react'
import { Button } from '../ui/button'

export const TablePopover = ({ editor, controllers, triggerIcon }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    {triggerIcon}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-popover border border-input rounded-lg  p-1 w-min" align="start">
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
}

