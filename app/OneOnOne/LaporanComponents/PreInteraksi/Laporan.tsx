'use client'
import '../LaporStyles.css'
import React, { useState, useEffect, useMemo } from "react"
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
import { BikinDocument } from '../../Server/BikinDocument';
import { Subtopics } from '../../Server/Topics';
import { redirect } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

type LaporanProps = {
  handleKomitmenDatatoAI?: (KomDataArr: KomitmenData[] | undefined) => void
  User: User | null;
  FuncCaller?: boolean;
  handleSavingStatus?: (Status: string) => void
}

type KomitmenData = {
  Judul: string | undefined;
  Isi: string | undefined;
};

export type EditorTextandHTML = {
  Content: string | undefined,
  HTML: string | undefined
}

export default function Laporan({ handleKomitmenDatatoAI, User, FuncCaller, handleSavingStatus }: LaporanProps) {
  const [Managers, setManager] = useState<User[]>([])

  const [DisabledAI, setDisabledAI] = useState(false)
  const [prevEditorContentCheck, setprevEditorContentCheck] = useState<string | undefined>("")

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
      const managerusername = Managers.find((m) => m.email === val)
      const res = updateUserManager(User.email, val).then((res) =>
        toast({
          title: "Manager terpilih!",
          description: `Manager Untuk laporan ini: ${managerusername?.username}`
        })
      )
      if (!res) {
        console.log('nope')
      }
    }
  }

  const getDefaultManagerValue = useMemo(() => {
    if (!Managers && !User) return
    const manag = Managers.find((m) => m.email === User?.manager)
    return manag
  }, [Managers, User])

  const customTaskList = TaskList.extend({
    addKeyboardShortcuts() {
      return {
        'Mod-k': () => this.editor.commands.toggleTaskList(),
      }
    },
  })

  const aditor = useEditor({
    onUpdate: () => {
      if (prevEditorContentCheck === aditor?.getText()) {
        setDisabledAI(true)
      } else {
        setDisabledAI(false)
      }
    },
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: "pl-5 px-3 border-l-2 border-gray-400"
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
        placeholder: ({ editor, node }) => {
          if (node.type.name === "listItem") {
            return "this is a taskList"
          }
          return "This an empty node"
        },
        considerAnyAsEmpty: true,
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
    if (!handleSavingStatus) return
    handleSavingStatus("Saving")
    const ReturnObject: EditorTextandHTML = {
      HTML: aditor?.getHTML(),
      Content: aditor?.getText()
    }
    const res = BikinDocument(ReturnObject, User?.UserID, "KomitmenBawahan").then(r => handleSavingStatus("Saved"))
    return ReturnObject
  }

  const $Isi = aditor?.$nodes('paragraph')
  const $Judul = aditor?.$nodes('taskList')
  const isiList = ($Isi || []).map(($el) => {
    return {
      content: $el.textContent,
      pos: $el.pos
    }
  })


  const dataList: KomitmenData[] | undefined = useMemo(() => $Judul?.map(($el, i) => {
    const pos = $el.pos;
    const posNext = i < ($Judul.length - 1) ? $Judul[i + 1].pos : 0;
    return {
      Judul: $el.textContent,
      Isi: isiList.filter((d) => posNext > 0 ? (d.pos > pos && d.pos < posNext) : (d.pos > pos)).map((d) => d.content).join(' '),
    };
  }), [$Judul, isiList])

  const handleAIassist = () => {
    if (!handleKomitmenDatatoAI) return
    handleKomitmenDatatoAI(dataList)
    setDisabledAI(true)
    setprevEditorContentCheck(aditor?.getText())

  }
  const filteredManagers = Managers.filter((m) => m.email !== User?.email)

  return (
    <div id="LaporanWrap" className="h-fit relative">
      <div className="sticky top-0 z-10">
        <ToolBar editor={aditor} />
      </div>
      <div className="editor-container">
        <div className="flex flex-col gap-6 px-7 py-6">
          <h1 className="text-2xl">Laporan</h1>
          <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
            <h1>Pilih manager untuk laporan ini</h1>
            <div className="w-fit">
              {getDefaultManagerValue !== undefined ?
                <Select defaultValue={getDefaultManagerValue?.email} onValueChange={value => handleSelectManagerChange(value)}>
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
                </Select> : <Select onValueChange={value => handleSelectManagerChange(value)}>
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
              }
            </div>
          </div>
          <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
            <h1>Ceritakan bagaimana berjalannya komitmenmu dalam 2 minggu terakhir.</h1>
            <EditorContent editor={aditor} />
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 self-end">
                <Button
                  disabled={DisabledAI}
                  onClick={() => {
                    handleAIassist()
                  }
                  }
                  className="w-fit gap-3 self-end">
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
              {Subtopics.map((SubTopic, index) => {
                return <li key={index} className="list-disc">{SubTopic.SubTopicTitle}</li>
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { KomitmenData }
