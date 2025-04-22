import { Button } from '@/components/ui/button';
import { useNoteStore } from '@/stores/useNoteStore';
import { Copy, CopyCheck, Download, Pencil, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import parse from 'html-react-parser';
import NoteSkeleton from '@/components/sekeletons/NoteSkeleton';
import { useNavigate } from 'react-router-dom';
import hljs from 'highlight.js';
import { createRoot } from 'react-dom/client';
import { toast } from 'sonner';
import katex from 'katex'
import 'katex/dist/katex.min.css';


import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

function ImageViewer({ defaultIndex, images = [], closeImageViewer }) {
    const downloadImage = () => {

    }
    return (
        <div className='z-50 fixed top-0 left-0 w-full h-full bg-background'>
            <Carousel className="relative w-full  h-full max-w-screen-md m-auto" defaultIndex={defaultIndex} onSelect={(index) => { console.count(index) }}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 left-1 z-10"
                    onClick={closeImageViewer}
                ><X /></Button>

                <CarouselContent>
                    {images.map((src, index) => (
                        <CarouselItem key={index} className="overflow-hidden h-svh">
                            <img className='h-full w-full object-contain' src={src} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
            </Carousel>
        </div>
    )

}


const NotePage = () => {
    const { id } = useParams();
    const { getNoteContent, isContentLoading, noteNotFound, setNoteNotFound } = useNoteStore();
    const [content, setContent] = useState('');
    const [imageOpen, setImageOpen] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                let noteContent = await getNoteContent(id);
                setContent(noteContent || '');
            }
        };

        fetchData();
    }, [id, getNoteContent]);

    useEffect(() => {
        // Apply syntax highlighting after content is rendered
        if (content) {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });

            // Render KaTeX
            document.querySelectorAll('span[data-latex]').forEach((element) => {
                try {
                    const latex = element.getAttribute('data-latex');
                    const isBlock = element.getAttribute('data-display') === 'yes';
                    katex.render(latex, element, {
                        displayMode: isBlock,
                        throwOnError: false,
                    });
                } catch (error) {
                    console.error('KaTeX render error:', error);
                }
            });



            // Add header with copy button to each pre tag
            document.querySelectorAll('pre').forEach((pre) => {
                if (!pre.querySelector('.pre-header')) {
                    const codeElement = pre.querySelector('code');
                    const languageClass = Array.from(codeElement.classList).find(cls => cls.startsWith('language-'));
                    const language = languageClass ? languageClass.replace('language-', '') : 'unknown';

                    const header = document.createElement('header');
                    header.className = 'pre-header absolute top-0 left-0 w-full bg-[#09090b] rounded-t-md flex items-center justify-between p-2 border border-b-[#27272a]';
                    header.innerHTML = `<span>${language}</span>`;
                    pre.insertBefore(header, pre.firstChild);

                    const buttonContainer = document.createElement('div');
                    header.appendChild(buttonContainer);

                    const CopyButton = () => {
                        const [copied, setCopied] = useState(false);

                        const handleCopy = async () => {
                            const codeContent = codeElement.innerText;
                            await navigator.clipboard.writeText(codeContent);
                            toast.success('Content copied to clipboard!');
                            setCopied(true);
                            setTimeout(() => setCopied(false), 3000);
                        };

                        return (
                            <Button variant="ghost" size="icon" onClick={handleCopy} disabled={copied}>
                                {copied ? <CopyCheck /> : <Copy />}
                            </Button>
                        );
                    };

                    const root = createRoot(buttonContainer);
                    root.render(<CopyButton />);
                }
            });

            // add image interaction
            const images = [...document.querySelectorAll('.tiptap > img')];
            const handleImageClick = (index) => {
                setImageOpen({
                    defaultIndex: index,
                    images: images.map(img => img.src),
                    closeImageViewer: () => setImageOpen(null),
                })
            }
            images.forEach((img, index) => {
                img.addEventListener('click', () => handleImageClick(index));
            })

            return () => {
                images.forEach(img => {
                    img.removeEventListener('click', handleImageClick);
                })
            }
        }
    }, [content]);


    if (isContentLoading) {
        return <NoteSkeleton />
    }

    if (content === '') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <Button
                    onClick={() => navigate(`/note/${id}/editor`)}
                    variant="secondary"
                    size="lg"
                    className="shadow-md bottom-2 right-4 font-bold"
                >
                    <Pencil /> Write
                </Button>
                <img
                    className='size-[200px] mx-auto mt-4 grayscale-[100] opacity-50'
                    src="/empty-note-state.svg"
                    alt=""
                />
                <div>No content</div>
            </div>
        )
    }

    if (noteNotFound) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <img src='/404-not-found.svg' className='p-4 rounded-lg max-w-[500px]'></img>
            </div>
        )
    }
    return (

        <div className={`tiptap ${!content.trim() ? 'empty' : ''}`}>
            <div className='max-w-screen-md m-auto'>
                {imageOpen && <ImageViewer {...imageOpen} />}
                <Button
                    onClick={() => navigate(`editor`)}
                    variant="secondary"
                    className="fixed right-2 top-20 shadow-md z-9 font-bold flex items-center justify-center md:space-x-2 w-10 h-10 md:w-auto md:h-auto"
                >
                    <Pencil />
                    <span className="hidden md:block">Edit</span>
                </Button>
                {parse(content)}
            </div>
        </div>

    )
}

export default NotePage