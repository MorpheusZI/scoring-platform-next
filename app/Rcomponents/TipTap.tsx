'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Editor } from '@tiptap/react'
//
// import { Collaboration } from '@tiptap/extension-collaboration'
// import * as Y from 'yjs'
// import { TiptapCollabProvider } from '@hocuspocus/provider'
import { useEffect, useState } from 'react'
type TipTapProps = {
  editor: Editor
}

const TipTap = ({ editor }: TipTapProps) => {
  // const ydoc = new Y.Doc()
  // const provider = new TiptapCollabProvider({
  //   name: "scoring-platform-next",
  //   appId: '7mezzgmy',
  //   token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTA4Njc5MDQsIm5iZiI6MTcxMDg2NzkwNCwiZXhwIjoxNzEwOTU0MzA0LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiI3bWV6emdteSJ9.5mEe6n4KpYSaP58RLtDXCRjI78VjxXauAWLbPnI82f8',
  //   document: ydoc
  // })
  return (
    <div>
      <EditorContent editor={editor} />
    </div>

  )
}
export default TipTap
