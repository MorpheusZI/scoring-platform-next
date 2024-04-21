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
import { CircleAlert, Sparkles } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { DropdownMenuGroup, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from "@/components/ui/button";
import { Document, User } from '@prisma/client';
import { Select, SelectValue, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/components/ui/select';
import { AmbilPreDocument, BikinDocument, UpdatePreDocument, getUser } from '../../Server/BikinDocument';
import { Subtopics } from '../../Server/Topics';
import { redirect } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { getDocs } from '@/app/ListMentee/Server/GetMentees';

type LaporanProps = {
  handleKomitmenDatatoAI?: (KomDataArr: KomitmenData[] | undefined) => void
  User: User | null;
  FuncCaller?: boolean;
  UserUpdater?: () => void;
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

export default function Laporan({ handleKomitmenDatatoAI, User, FuncCaller, handleSavingStatus, UserUpdater }: LaporanProps) {
  const [Managers, setManager] = useState<User[]>([])

  const [DisabledAI, setDisabledAI] = useState(false)
  const [prevEditorContentCheck, setprevEditorContentCheck] = useState<string | undefined>("")
  const [PreDocumetCheck, setPreDocumetCheck] = useState<Document | undefined | null>()

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
    if (!User) return
    if (!Managers) return
    const manag = Managers.find((man) => man.email === User.manager)
    if (!manag) return
    getDocs(User.UserID, manag.UserID).then((docs) => {
      const doc = docs[0]
      aditor?.commands.setContent(doc.memberHTML)
    })
  }, [User, Managers])

  useEffect(() => {
    getHTMLandContent()
  }, [FuncCaller])

  function handleSelectManagerChange(val: string) {
    if (!UserUpdater) return
    if (User) {
      UserUpdater()
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
  const customTaskList = TaskList.extend({
    addKeyboardShortcuts() {
      return {
        'Mod-k': () => this.editor.commands.toggleTaskList(),
        'Tab': () => this.editor.commands.toggleTaskList(),
      }
    },
  })

  const aditor = useEditor({
    onUpdate: ({ editor }) => {
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
        showOnlyCurrent: false,
        placeholder: ({ editor, node }) => {
          if (editor?.can().splitListItem('taskList')) {
            return "CTRL + K Lagi untuk mendeskripsikan"
          }
          return "(Ctrl + K) untuk komitmen baru, (Enter) lalu (Backspace) untuk deskripsi komitmen"
        },
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
    if (!User) return
    if (!handleSavingStatus) return
    handleSavingStatus("Saving")
    const Uzer = getUser(User.UserID).then((Uxer) => Uxer)
    const ReturnObject: EditorTextandHTML = {
      HTML: aditor?.getHTML(),
      Content: aditor?.getText()
    }
    const manag = Managers.find((man) => man.email === User.manager)
    const res = BikinDocument(ReturnObject, User, manag).then(r => {
      handleSavingStatus("Saved")
    })
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
    if (dataList?.length === 0) return
    if (dataList && dataList?.filter((m) => m.Isi === undefined || m.Isi === "" || m.Isi === null).length > 0) {
      toast({
        title: "Belum lengkap!",
        description: "Ada beberapa komitmen yang belum di deskripsikan",
        variant: "destructive",
        duration: 1000,
      })
      return
    }
    handleKomitmenDatatoAI(dataList)
    setDisabledAI(true)
    setprevEditorContentCheck(aditor?.getText())

  }
  const filteredManagers = Managers.filter((m) => m.email !== User?.email)
  const renderManagerSelect = useMemo(() => {
    if (User?.manager) {
      return <Select value={User?.manager} onValueChange={value => handleSelectManagerChange(value)}>
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
    } else {
      return <div className="flex gap-4 items-center">
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
        <CircleAlert className="w-7 h-7 text-red-500" />
      </div>
    }
  }, [User])

  return (
    <div id="LaporanWrap" className="h-fit relative">
      <div className="sticky top-0 z-10">
        <ToolBar editor={aditor} />
      </div>
      <div className="editor-container">
        <div className="flex flex-col gap-6 px-7 py-6">
          <h1 className="text-2xl">Laporan</h1>
          <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
            <div className="flex gap-2">
              <h1>Pilih manager untuk laporan ini</h1>
            </div>
            <div className="w-fit">
              {renderManagerSelect}
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
        </div>
      </div>
    </div>
  );
}

export type { KomitmenData }
