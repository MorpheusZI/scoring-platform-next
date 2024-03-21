'use client'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Underline,
  Undo,
  Redo,
  ArrowUpDown,
  Quote,
} from 'lucide-react'
import { Editor } from '@tiptap/react'
import { Toggle } from '../../components/ui/toggle'

type ToolBarProps = {
  editor: Editor | null,
}
export default function ToolBar({ editor }: ToolBarProps) {
  return (
    <div className="flex w-full p-2 rounded-t border-b-2 border-black bg-gray-200">
      <div className="flex w-fit pe-1 border-r-2 border-black">
        <Toggle
          size="sm"
          pressed={editor?.isActive('heading', { level: 2 })}
          onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading1 />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("bold")}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("underline")}
          onPressedChange={() => editor?.commands.toggleUnderline()}
        >
          <Underline />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("italic")}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("strike")}
          onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough />
        </Toggle>
      </div>
      <div className="flex w-fit items-center px-2 border-r-2 border-black">
        <Toggle
          size="sm"
          pressed={editor?.isActive("blockquote")}
          onPressedChange={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("orderedList")}
          onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor?.isActive("bulletList")}
          onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List />
        </Toggle>
        <Toggle
          size="sm"
          disabled={!editor?.can().splitListItem('listItem')}
          onPressedChange={() => editor?.chain().focus().sinkListItem('listItem').run()}
        >
          <ArrowUpDown />
        </Toggle>
      </div>
    </div>
  )
}
