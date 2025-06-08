import React, { useRef, useState } from 'react';
import { Check, ChevronsUpDown, CodeSquare, Copy, CopyCheck, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';

export default ({ node: { attrs: { language: defaultLanguage } }, updateAttributes, extension }) => {
  const languages = extension.options.lowlight.listLanguages();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultLanguage);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef(null);

  const handleCopy = async ()=>{
    const codeContent = codeRef.current.textContent;
    await navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(()=>setCopied(false), 3000);
  }

  return (
    <NodeViewWrapper className="code-block">
      <header className='bg-[#09090b] rounded-t-2xl absolute left-0 top-0 w-full flex items-center justify-between py-2 px-4 border border-b-[#27272a]'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="min-w-32 justify-between"
              contentEditable={false}
            >
              {value
                ? languages.find((language) => language === value)
                : "Select Language..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search language..." className="h-9" />
              <CommandList>
                <CommandEmpty>No language found.</CommandEmpty>
                <CommandGroup>
                  {languages.map((lang, index) => (
                    <CommandItem
                      key={index}
                      value={lang}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        updateAttributes({ language: currentValue });
                        setOpen(false);
                      }}
                    >
                      {lang}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === lang ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className='flex gap-2'>
          <Button variant="ghost" size="sm" disabled={copied} onClick={handleCopy}>
            {copied ? <CopyCheck/>  : <Copy/>}
            <span>Copy</span>
          </Button>
        </div>

      </header>

      <pre ref={codeRef}>
        <NodeViewContent as="code"/>
      </pre>
    </NodeViewWrapper>
  );
};

