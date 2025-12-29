'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import YoutubeExtension from '@tiptap/extension-youtube'
import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Youtube } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCallback } from 'react' // Dùng useCallback để tối ưu

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const supabase = createClient()

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      YoutubeExtension.configure({ controls: false }),
      ImageExtension.configure({ inline: true }),
    ],
    content: content,
    editorProps: {
      attributes: {
        // Class 'prose' này cần plugin @tailwindcss/typography để hoạt động
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Hàm xử lý upload ảnh (Đã fix lỗi any)
  const addImage = useCallback(() => {
    if (!editor) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    // Xử lý sự kiện change
    input.onchange = async (e: Event) => {
      // 1. Ép kiểu target về HTMLInputElement để truy cập .files
      const target = e.target as HTMLInputElement
      
      if (!target.files || target.files.length === 0) return

      const file = target.files[0]
      const fileName = `${Date.now()}-${file.name}`

      // 2. Upload lên Supabase
      const { data, error } = await supabase.storage
        .from('lesson-images') // Đảm bảo bucket này đã được tạo và public
        .upload(fileName, file)

      if (error) {
        console.error('Error uploading image:', error)
        alert('Lỗi upload ảnh')
        return
      }

      if (data) {
        // 3. Lấy URL public
        const { data: publicUrlData } = supabase.storage
          .from('lesson-images')
          .getPublicUrl(fileName)
        
        // 4. Chèn ảnh vào Editor
        editor.chain().focus().setImage({ src: publicUrlData.publicUrl }).run()
      }
    }

    input.click()
  }, [editor, supabase.storage])

  const addYoutube = useCallback(() => {
    if (!editor) return

    const url = window.prompt('Nhập link YouTube video:')
    if (url) {
      editor.commands.setYoutubeVideo({ src: url })
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1 flex-wrap sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          className={editor.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          className={editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          className={editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          className={editor.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-slate-300 mx-2 self-center" />
        
        <Button variant="ghost" size="sm" onClick={addImage} title="Chèn ảnh">
          <ImageIcon className="w-4 h-4 text-slate-500" />
        </Button>
        <Button variant="ghost" size="sm" onClick={addYoutube} title="Chèn Video Youtube">
          <Youtube className="w-4 h-4 text-slate-500" />
        </Button>
      </div>
      
      {/* Editor Content Area */}
      <div className="max-h-[500px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}