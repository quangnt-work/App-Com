'use client';

import { useState, useCallback, useRef } from 'react';
import {
    Bold, Italic, Underline, List, ListOrdered,
    Download, PenLine, ChevronDown
} from 'lucide-react';
import { saveAs } from 'file-saver';

interface DocNotesSectionProps {
    lessonTitle: string;
}

type FormatType = 'bold' | 'italic' | 'underline' | 'insertUnorderedList' | 'insertOrderedList' | 'formatBlock';

interface ToolbarButton {
    label: string;
    command: FormatType;
    icon: React.ReactNode;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
    { label: 'In đậm', command: 'bold', icon: <Bold className="w-4 h-4" /> },
    { label: 'In nghiêng', command: 'italic', icon: <Italic className="w-4 h-4" /> },
    { label: 'Gạch chân', command: 'underline', icon: <Underline className="w-4 h-4" /> },
    { label: 'Danh sách chấm', command: 'insertUnorderedList', icon: <List className="w-4 h-4" /> },
    { label: 'Danh sách số', command: 'insertOrderedList', icon: <ListOrdered className="w-4 h-4" /> },
];

export function DocNotesSection({ lessonTitle }: DocNotesSectionProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    const execFormat = useCallback((command: FormatType, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    }, []);

    const handleExportDocx = useCallback(() => {
        if (!editorRef.current) return;
        const contentHtml = editorRef.current.innerHTML;

        // Build Word-compatible HTML
        const htmlToExport = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Ghi chú - ${lessonTitle}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; padding: 20px; }
          h1 { font-size: 24pt; font-weight: bold; margin-bottom: 12pt; }
          h2 { font-size: 18pt; font-weight: bold; margin-bottom: 10pt; }
          p { margin-bottom: 10pt; }
          ul, ol { margin-left: 20pt; margin-bottom: 10pt; }
          li { margin-bottom: 5pt; }
        </style>
      </head>
      <body>
        <h1>Ghi chú: ${lessonTitle}</h1>
        <hr>
        ${contentHtml}
      </body>
      </html>
    `;

        // Save as .doc which MS Word handles perfectly with HTML content
        const blob = new Blob(['\ufeff', htmlToExport], {
            type: 'application/msword;charset=utf-8'
        });

        // safe filename
        const safeTitle = lessonTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        saveAs(blob, `ghi_chu_${safeTitle}.doc`);
    }, [lessonTitle]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 p-6 pb-4">
                <PenLine className="w-5 h-5 text-[#f07b32]" strokeWidth={2.5} />
                <h2 className="font-bold text-gray-800 text-base">Ghi chú</h2>
            </div>

            <div className="px-6 pb-6 space-y-4 text-sm">
                {/* Editor Container */}
                <div
                    className={`border rounded-xl bg-slate-50/50 transition-colors flex flex-col ${isFocused ? 'border-[#f07b32] ring-2 ring-orange-100' : 'border-gray-200'
                        }`}
                >
                    {/* Toolbar */}
                    <div className="flex items-center flex-wrap gap-1.5 px-3 py-2 border-b border-gray-100 bg-white rounded-t-xl">
                        {/* Basic formats */}
                        {TOOLBAR_BUTTONS.map((btn) => (
                            <button
                                key={btn.command}
                                type="button"
                                title={btn.label}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    execFormat(btn.command);
                                }}
                                className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors shrink-0"
                            >
                                {btn.icon}
                            </button>
                        ))}

                        <div className="w-px h-5 bg-gray-200 mx-1 shrink-0" />

                        {/* Headings dropdown */}
                        <div className="relative shrink-0">
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setShowHeadingMenu(!showHeadingMenu);
                                }}
                                onBlur={() => setShowHeadingMenu(false)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors text-xs font-medium"
                            >
                                Bình thường
                                <ChevronDown className="w-3.5 h-3.5" />
                            </button>

                            {showHeadingMenu && (
                                <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 shadow-lg rounded-lg py-1 z-10">
                                    <button
                                        onMouseDown={(e) => { e.preventDefault(); execFormat('formatBlock', 'P'); setShowHeadingMenu(false); }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-xs"
                                    >
                                        Bình thường
                                    </button>
                                    <button
                                        onMouseDown={(e) => { e.preventDefault(); execFormat('formatBlock', 'H1'); setShowHeadingMenu(false); }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-900 font-bold text-base"
                                    >
                                        Tiêu đề 1
                                    </button>
                                    <button
                                        onMouseDown={(e) => { e.preventDefault(); execFormat('formatBlock', 'H2'); setShowHeadingMenu(false); }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-800 font-semibold text-sm"
                                    >
                                        Tiêu đề 2
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Editable Area */}
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="Nhập ghi chú của bạn vào đây trong khi xem video..."
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`
              min-h-[200px] p-5 text-gray-700 outline-none leading-relaxed bg-white rounded-b-xl
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2
              [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-1
              [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-1
              before:content-[attr(data-placeholder)] before:text-gray-400 before:pointer-events-none
              [&:not(:empty)]:before:hidden
            `}
                    />
                </div>

                {/* Action Row */}
                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleExportDocx}
                        className="flex items-center gap-2 bg-[#f07b32] hover:bg-[#e06c25] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-orange-200 shrink-0"
                    >
                        <Download className="w-4 h-4" />
                        Xuất ghi chú
                    </button>
                </div>
            </div>
        </div>
    );
}
