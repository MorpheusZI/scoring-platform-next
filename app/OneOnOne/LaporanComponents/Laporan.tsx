import './LaporStyles.css'
import React, { useState, useEffect } from "react"
// tipTap imports
import { useEditor, Editor, EditorContent } from '@tiptap/react';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'

//tiptap Collaboration
import { Collaboration } from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@hocuspocus/provider'

//component imports
import ToolBar from "../../Rcomponents/Toolbar";

// lucide/shadcn imports
import { Minus, Plus, Ellipsis, Smile, Frown, Angry, Sparkles } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from "@/components/ui/button";
import { User } from '@prisma/client';

type LaporanProps = {
  handleKomitmenDatatoAI: (KomitmenDataArr: KomitmenData[]) => void
  DocID: string,
  User: User | null;
}

type KomitmenData = {
  Judul: string;
  Isi: string;
};
export default function Laporan({ handleKomitmenDatatoAI, DocID, User }: LaporanProps) {
  const [DataArr, setDataArr] = useState<Array<KomitmenData>>([]);
  const ydoc = new Y.Doc()
  useEffect(() => {
    const provider = new TiptapCollabProvider({
      name: `${User?.Team}/${User?.email}/KomitmenDoc-${DocID}`,
      appId: '7mezzgmy',
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTE4NjM2NjcsIm5iZiI6MTcxMTg2MzY2NywiZXhwIjoxNzExOTUwMDY3LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiI3bWV6emdteSJ9.1XyFaEoHv4wCQL2sphO6jjotalJorDBkPMddNhh3wQ4',
      document: ydoc
    })
    return () => {
      provider.destroy()
    }
  }, [DocID])

  const customTaskList = TaskList.extend({
    addKeyboardShortcuts() {
      return {
        'Mod-k': () => this.editor.commands.toggleTaskList(),
      }
    },
  })

  const aditor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: "ml-5 px-3 border-l-2 border-gray-400"
          },
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

      }),
      Underline,
      customTaskList,
      TaskItem,
      Placeholder.configure({
        placeholder: "Tulislah Komitmen mu...",
        emptyEditorClass: "first:before:h-0 first:before:text-gray-400 first:before:content-[attr(data-placeholder)] first:before:float-left"
      }),
      Collaboration.configure({
        document: ydoc
      })
    ],
    editorProps: {
      attributes: {
        class: "w-full px-3 py-4 text-black outline-none",
      }
    },
  })

  const $Isi = aditor?.$nodes('paragraph')
  const isi = $Isi?.map(($task, index) => {
    console.log(DataArr.length)
    if (DataArr[index]) {
      DataArr[index].Isi = $task.textContent
    } else {
      // Join all collected paragraphs and store them in the Isi property of the previous DataArr element
      const previousIndex = DataArr.length - 1
      if (previousIndex >= 0) {
        DataArr[previousIndex].Isi = $Isi.map((m) => m.textContent).join(' ')
      }
    }
    return {
      task: $task.textContent,
      index: index,
    }
  })
  const $Judul = aditor?.$nodes('taskList')
  const aw = $Judul?.map(($task, index) => {

    if (DataArr[index]) {
      DataArr[index].Judul = $task.textContent

    } else if (!DataArr[index]) {
      setDataArr([...DataArr, { Judul: $task.textContent, Isi: '' }])
    }

    return {
      task: $task.textContent,
      index: index,
    }
  })
  useEffect(() => {
    console.log(DataArr)
  }, [$Isi, $Judul])

  return (
    <div id="LaporanWrap" className="h-fit">
      <ToolBar editor={aditor} />
      <div className="editor-container">
        <div className="flex flex-col gap-6 px-7 py-6">
          <h1 className="text-2xl">Laporan </h1>
          <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
            <h1>Ceritakan bagaimana berjalannya komitmenmu dalam 2 minggu terakhir.</h1>
            <EditorContent editor={aditor} />
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 self-end">
                <Button onClick={() => {
                  console.log(DataArr)
                }} className="w-fit gap-3 self-end">
                  <Sparkles />
                  <p>Cek Kualitas Deskripsi</p>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
            <h1>Bagaimana perasaan kamu 2 minggu terakhir?</h1>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-xl hover:cursor-pointer">
                <Smile className="w-10 h-10" />
                <p className="text-lg">Senang</p>
              </div>
              <div className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-xl hover:cursor-pointer">
                <Frown className="w-10 h-10" />
                <p className="text-lg">Sedih</p>
              </div>
              <div className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-xl hover:cursor-pointer">
                <Angry className="w-10 h-10" />
                <p className="text-lg">Marah</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { KomitmenData }
