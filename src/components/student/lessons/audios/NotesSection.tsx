'use client';

import { useState, useCallback } from 'react';
import { AlignLeft, Bold, Italic, Underline, List, AlignJustify } from 'lucide-react';

interface NotesSectionProps {
    lessonId: string;
}

type FormatType = 'bold' | 'italic' | 'underline' | 'insertUnorderedList' | 'justifyFull';

interface ToolbarButton {
    label: string;
    command: FormatType;
    icon: React.ReactNode;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
    { label: 'In đậm', command: 'bold', icon: <Bold className="w-4 h-4" /> },
    { label: 'In nghiêng', command: 'italic', icon: <Italic className="w-4 h-4" /> },
    { label: 'Gạch chân', command: 'underline', icon: <Underline className="w-4 h-4" /> },
    { label: 'Danh sách', command: 'insertUnorderedList', icon: <List className="w-4 h-4" /> },
    { label: 'Căn đều hai bên', command: 'justifyFull', icon: <AlignJustify className="w-4 h-4" /> },
];

export function NotesSection({ lessonId }: NotesSectionProps) {
    const [isFocused, setIsFocused] = useState(false);

    const execFormat = useCallback((command: FormatType) => {
        document.execCommand(command, false);
    }, []);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {/* Section header */}
            <div className="flex items-center gap-2 mb-4">
                <AlignLeft className="w-5 h-5 text-[#f07b32]" strokeWidth={2.5} />
                <h2 className="font-bold text-gray-800 text-base">Ghi chú của bạn</h2>
            </div>

            {/* Editor wrapper */}
            <div
                className={`border rounded-xl overflow-hidden transition-colors ${isFocused ? 'border-[#f07b32] ring-2 ring-orange-100' : 'border-gray-200'
                    }`}
            >
                {/* Toolbar */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50/50">
                    {TOOLBAR_BUTTONS.map((btn) => (
                        <button
                            key={btn.command}
                            type="button"
                            title={btn.label}
                            onMouseDown={(e) => {
                                e.preventDefault(); // Keep focus in editor
                                execFormat(btn.command);
                            }}
                            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            {btn.icon}
                        </button>
                    ))}
                </div>

                {/* Editable area */}
                <div
                    contentEditable
                    suppressContentEditableWarning
                    data-placeholder="Nhập ghi chú của bạn vào đây..."
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
            min-h-[160px] p-4 text-sm text-gray-700 outline-none leading-relaxed
            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2
            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2
            before:content-[attr(data-placeholder)] before:text-gray-400 before:pointer-events-none
            [&:not(:empty)]:before:hidden
          `}
                />
            </div>
        </div>
    );
}
