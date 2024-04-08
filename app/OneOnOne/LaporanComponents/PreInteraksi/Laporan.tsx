'use client'
import '../LaporStyles.css'
import React, { useState, useEffect } from "react"
// tipTap imports
import { useEditor, Editor, EditorContent, JSONContent } from '@tiptap/react';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'

//component imports
import ToolBar from "../../../Rcomponents/Toolbar";
import { getManagers, updateUserManager } from '../../Server/ambilData';

// lucide/shadcn imports
import { Sparkles } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { DropdownMenuGroup, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from "@/components/ui/button";
import { User } from '@prisma/client';
import { Select, SelectValue, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/components/ui/select';
import { redirect } from 'next/navigation';
import { BikinDocument } from '../../Server/BikinDocument';
import { Subtopics } from '../../Server/Topics';

type LaporanProps = {
  handleKomitmenDatatoAI?: (KomitmenDataArr: KomitmenData[]) => void
  User: User | null;
  FuncCaller: boolean;
}

type KomitmenData = {
  Judul: string | undefined;
  Isi: string | undefined;
};

export type EditorTextandHTML = {
  Content: string | undefined,
  HTML: string | undefined
}

type newArr = {
  IsiContent: string | undefined;
  BelongsTo: number | undefined;
}

export default function Laporan({ handleKomitmenDatatoAI, User, FuncCaller }: LaporanProps) {
  const [DataArr, setDataArr] = useState<Array<KomitmenData>>([]);
  const [IsiArr, setIsiArr] = useState<newArr[]>([])

  const [Managers, setManager] = useState<User[]>([])
  useEffect(() => {
    const Userdata = localStorage.getItem('UserStore')
    if (!Userdata) {
      return redirect('/Login')
    }
    getManagers().then(managerz => {
      setManager(managerz)
    })
  }, [])

  useEffect(() => {
    getHTMLandContent()
  }, [FuncCaller])
  function handleSelectManagerChange(val: string) {
    if (User) {
      const res = updateUserManager(User.email, val).then((res) => res)
      if (!res) {
        console.log('nope')
      }
    }
  }
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
    ],
    editorProps: {
      attributes: {
        class: "w-full px-3 py-4 text-black outline-none"
      }
    },
  })

  function getHTMLandContent() {
    if (aditor?.getText() === undefined || aditor.getHTML() === undefined) return
    const ReturnObject: EditorTextandHTML = {
      HTML: aditor?.getHTML(),
      Content: aditor?.getText()
    }
    const res = BikinDocument(ReturnObject, User?.UserID, "KomitmenBawahan").then(r => console.log(r, "succes"))
    return ReturnObject
  }


  const $Isi = aditor?.$nodes('paragraph')
  console.log($Isi)
  const isi = $Isi?.map(($task, index) => {
    return $task.textContent
  })

  const $Judul = aditor?.$nodes('taskList')
  const aw = $Judul?.map(($task, indexa) => {
    if (DataArr[indexa]) {
      DataArr[indexa].Judul = $task.textContent
      DataArr[indexa].Isi = isi?.join(' ')
    } else {
      setDataArr([...DataArr, { Judul: $task.textContent, Isi: isi?.join(' ') }])
    }
    return {
      task: $task.textContent,
      index: indexa,
    }
  })

  useEffect(() => {
    console.log(DataArr)
  }, [$Judul, $Isi])

  const filteredManagers = Managers.filter((m) => m.email !== User?.email)
  return (
    <div id="LaporanWrap" className="h-fit">
      <ToolBar editor={aditor} />
      <div className="editor-container">
        <div className="flex flex-col gap-6 px-7 py-6">
          <h1 className="text-2xl">Laporan </h1>
          <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
            <h1>Pilih Manager laporan ini</h1>
            <div className="w-fit">
              <Select onValueChange={value => handleSelectManagerChange(value)}>
                <SelectTrigger className="gap-5">
                  <SelectValue placeholder="Pilih manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {filteredManagers.map((manager, index) => {
                      return <SelectItem value={manager.email} key={index}>{manager.username}</SelectItem>
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
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
            <h1>Overview Topik</h1>
            <div className="w-fit">
              <Select disabled>
                <SelectTrigger className="gap-5">
                  <SelectValue placeholder="Regular 1on1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectContent>ahay</SelectContent>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <ul className="list-inside ">
              {Subtopics.map((SubTopic) => {
                return <li className="list-disc">{SubTopic.SubTopicTitle}</li>
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { KomitmenData }
