'use client'
import { useEditor, Editor, EditorContent, Content, } from '@tiptap/react';
import { Underline as lineUnder } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TipTap from './Rcomponents/TipTap';


export default function Home() {
  const editor = new Editor({
    extensions: [
      StarterKit,
      lineUnder,
      Placeholder
    ],
    editorProps: {
      attributes: {
        class: 'border'
      }
    }
  })
  return (
    <div className="flex flex-col items-center">
      <TipTap editor={editor} />
    </div>
  )
}
