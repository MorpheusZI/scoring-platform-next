'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { Underline as lineUnder } from '@tiptap/extension-underline'
import { StarterKit } from '@tiptap/starter-kit'
import { Editor } from '@tiptap/react'
import Placeholder from '@tiptap/extension-placeholder'
//
// import { Collaboration } from '@tiptap/extension-collaboration'
// import * as Y from 'yjs'
// import { TiptapCollabProvider } from '@hocuspocus/provider'
//
import ToolBar from './Toolbar'
import { useEffect, useState } from 'react'

const TipTap = ({ onEditorReady }: { onEditorReady: (editor: Editor | null) => void }) => {
  // const ydoc = new Y.Doc()
  // const provider = new TiptapCollabProvider({
  //   name: "scoring-platform-next",
  //   appId: '7mezzgmy',
  //   token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTA4Njc5MDQsIm5iZiI6MTcxMDg2NzkwNCwiZXhwIjoxNzEwOTU0MzA0LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiI3bWV6emdteSJ9.5mEe6n4KpYSaP58RLtDXCRjI78VjxXauAWLbPnI82f8',
  //   document: ydoc
  // })


  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: "ml-3 px-6 border-l-2 border-gray-400"
          }
        },
        bulletList: {
          HTMLAttributes: {
            class: "mx-6 px-2 list-disc list-outside "
          }
        }, orderedList: {
          HTMLAttributes: {
            class: "mx-7 list-decimal list-outside "
          }
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'text-4xl'
          }
        },
      }),
      lineUnder,
      Placeholder.configure({
        placeholder: "- Deskripsikan bagamaina situasi,cara anda melakukan dan hasilnya...",
        emptyEditorClass: "first:before:h-0 first:before:text-gray-400 first:before:content-[attr(data-placeholder)] first:before:float-left"
      })
      // Collaboration.configure({
      //   document: ydoc
      // })
    ],
    editorProps: {
      attributes: {
        class: "flex flex-col px-3 py-4 text-black border border-gray-400 rounded outline-none "
      }
    },
  })


  useEffect(() => {
    onEditorReady(editor)
  }, [editor, onEditorReady])
  return (
    <div>
      <EditorContent editor={editor} />
    </div>

  )
}
export default TipTap
