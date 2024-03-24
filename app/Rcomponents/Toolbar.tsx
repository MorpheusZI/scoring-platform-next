'use client'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ArrowUpDown,
  ListOrdered,
  Underline,
  Quote,
} from 'lucide-react'
import { Editor } from '@tiptap/react'
import { Toggle } from '../../components/ui/toggle'
import { useEffect } from 'react'

type ToolBarProps = {
  editor: Editor | null,
  onToolbarClick?: (command: string) => void
}
export default function ToolBar({ editor, onToolbarClick }: ToolBarProps) {
  return (
    <div className="flex w-full p-2 border-b-2 border-black bg-gray-100">
      <div className="flex w-fit pe-1 border-r-2 border-black">
        <Toggle
          size="sm"
          pressed={editor?.isActive("bold")}
          onPressedChange={() => { onToolbarClick ? onToolbarClick('toggleBold') : console.log('nope') }}
        >
          <Bold />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("underline")}
          onPressedChange={() => { onToolbarClick ? onToolbarClick('toggleUnderline') : console.log('nope') }}
        >
          <Underline />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("italic")}
          onPressedChange={() => { onToolbarClick ? onToolbarClick('toggleItalic') : console.log('nope') }}
        >
          <Italic />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("strike")}
          onPressedChange={() => { onToolbarClick ? onToolbarClick('toggleStrike') : console.log('nope') }}
        >
          <Strikethrough />
        </Toggle>
      </div>
      <div className="flex w-fit items-center px-2 border-r-2 border-black">
        <Toggle
          size="sm"
          pressed={editor?.isActive("blockquote")}
          onPressedChange={() => { onToolbarClick ? onToolbarClick('toggleBlockquote') : console.log('nope') }}
        >
          <Quote />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("orderedList")}
          onPressedChange={() => { onToolbarClick ? onToolbarClick('toggleOrderedList') : console.log('nope') }}
        >
          <ListOrdered />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("bulletList")}
          onPressedChange={() => { onToolbarClick ? onToolbarClick('toggleBulletList') : console.log('nope') }}
        >
          <List />
        </Toggle>
        <Toggle
          size="sm"
          disabled={!editor?.can().splitListItem('listItem')}
          onPressedChange={() => { onToolbarClick ? onToolbarClick("Sink") : console.log('nope') }}
        >
          <ArrowUpDown />
        </Toggle>
      </div>
    </div>
  )
}
