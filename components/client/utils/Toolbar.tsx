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
  SeparatorVertical,
} from 'lucide-react'
import { Editor } from '@tiptap/react'
import { Toggle } from '@/components/ui/toggle'
import { useEffect } from 'react'

type ToolBarProps = {
  editor: Editor | null,
}
export default function ToolBar({ editor }: ToolBarProps) {
  return (
    <div className="flex w-full p-2 border-b-2 border-black bg-gray-100">
      <div className="flex w-fit pe-1">
        <Toggle
          size="sm"
          pressed={editor?.isActive("bold")}
          onPressedChange={() => { editor?.chain().focus().toggleBold().run() }}
        >
          <Bold />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("underline")}
          onPressedChange={() => { editor?.chain().focus().toggleUnderline().run() }}
        >
          <Underline />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("italic")}
          onPressedChange={() => { editor?.chain().focus().toggleItalic().run() }}
        >
          <Italic />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("strike")}
          onPressedChange={() => { editor?.chain().focus().toggleStrike().run() }}
        >
          <Strikethrough />
        </Toggle>
      </div>
      <div className="flex w-fit items-center px-2 ">
        <Toggle
          size="sm"
          pressed={editor?.isActive("blockquote")}
          onPressedChange={() => { editor?.chain().focus().toggleBlockquote().run() }}
        >
          <Quote />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("orderedList")}
          onPressedChange={() => { editor?.chain().focus().toggleOrderedList().run() }}
        >
          <ListOrdered />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("bulletList")}
          onPressedChange={() => { editor?.chain().focus().toggleBulletList().run() }}
        >
          <List />
        </Toggle>
        <Toggle
          size="sm"
          disabled={!editor?.can().splitListItem('listItem')}
          onPressedChange={() => { }}
        >
          <ArrowUpDown />
        </Toggle>
      </div>
    </div>
  )
}
