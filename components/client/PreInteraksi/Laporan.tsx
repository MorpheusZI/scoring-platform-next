'use client'
import '../EditorStyles.css'
import React, { useState, useEffect, useMemo } from "react"

// tipTap imports
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'

//components
import ToolBar from "@/components/client/utils/Toolbar";
import { getAllUsers, updateUserManager } from "@/lib/functions/server/Database/UserFunctions"

// functions
import { GetKPI } from '@/lib/functions/server/Gsheet/GetKPI';
import { getDocs, BikinDocument, UpdatePreDocument } from '@/lib/functions/server/Database/DocumentFunctions';

// types
import { EditorTextandHTML, KomitmenData, LaporanProps } from '@/lib/types';

// ui imports
import { Check, ChevronsUpDown, CircleAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Document, User } from '@prisma/client';
import { redirect } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandList, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

export default function Laporan({ handleKomitmenDatatoAI, User, FuncCaller, handleSavingStatus, UserUpdater }: LaporanProps) {
  // -- State --
  const [Managers, setManager] = useState<User[]>([])
  const [DisabledAI, setDisabledAI] = useState(false)
  const [prevEditorContentCheck, setprevEditorContentCheck] = useState<string | undefined>("")
  const [DocumentCheck, setDocumentCheck] = useState<Document | undefined>()

  // -- UseEffects --
  useEffect(() => {
    const Userdata = localStorage.getItem('UserStore')
    if (!Userdata) {
      return redirect('/Login')
    }
    getAllUsers().then(managerz => {
      setManager(managerz)
    })
  }, [])

  useEffect(() => {
    if (!User) return
    if (!Managers) return
    const manag = Managers.find((man) => man.email === User.manager)
    if (!manag) return
    getDocs(User.UserID, manag.UserID).then((docs) => {
      const doc = docs.sort((a, b) => {
        return b.DocID - a.DocID
      })
      const dac = doc[0]
      if (!dac) return
      aditor?.commands.setContent(dac.memberHTML)
      setDocumentCheck(dac)
    }).finally(() => {
      ParseHTMLContent()
    })
    //@ts-ignore
  }, [User, Managers])

  useEffect(() => {
    getHTMLandContent()
    //@ts-ignore
  }, [FuncCaller])


  // -- Functions -- 
  function ParseHTMLContent() {
    if (!aditor?.getHTML()) return
    const parser = new DOMParser();
    const doc = parser.parseFromString(aditor?.getHTML(), 'text/html');
    const taskListItems = doc.querySelectorAll('ul[data-type="taskList"]');
    let filteredContent = '';
    let skipContent = false;

    taskListItems.forEach((item) => {
      const isChecked = item.querySelector('li[data-checked="true"]');
      if (isChecked) {
        skipContent = true
      } else {
        skipContent = false
        filteredContent += item.outerHTML
      }
      let nextSibling = item.nextElementSibling;
      while (nextSibling && nextSibling.getAttribute('data-type') !== "taskList") {
        if (!skipContent) {
          filteredContent += nextSibling?.outerHTML
        }
        nextSibling = nextSibling.nextElementSibling
      }
    });

    aditor.commands.setContent(filteredContent)
    GetKPI(User?.username).then((Rows) => {
      if (!Rows || Rows.length <= 0) {
        return
      }
      if (aditor.getText().toLowerCase().includes(Rows[0].Metric.toLowerCase())) {
        return
      }
      let KPIStuff = '';
      Rows?.forEach((row) => {
        const String = `<p><b>${row.Metric} telah mencapai ${row.Value} dari ${row.Target} (Achieved: ${row.Achievement})</b></p><p></p>`
        KPIStuff += String
        return String
      })
      filteredContent = `${KPIStuff} ${filteredContent}`
      aditor.commands.setContent(filteredContent)
      return
    })
  }

  function handleSelectManagerChange(val: string) {
    if (!UserUpdater) return
    if (User) {
      UserUpdater()
      const managerusername = Managers.find((m) => m.email === val)
      updateUserManager(User.email, val).then(() =>
        toast({
          title: "Manager terpilih!",
          description: `Manager Untuk laporan ini: ${managerusername?.username}`
        })
      )
    }
  }

  function getHTMLandContent() {
    if (!User) return
    if (!handleSavingStatus) return
    handleSavingStatus("Saving")
    const ReturnObject: EditorTextandHTML = {
      HTML: aditor?.getHTML(),
      Content: aditor?.getText()
    }
    const manag = Managers.find((man) => man.email === User.manager)
    if (DocumentCheck?.managerContent === "" || !DocumentCheck?.managerHTML || !DocumentCheck.managerContent) {
      if (!DocumentCheck?.DocID) {
        BikinDocument(ReturnObject, User, manag).then(r => {
          handleSavingStatus("Saved")
          setDocumentCheck(r)
        })
        return
      }
      UpdatePreDocument(ReturnObject, User.UserID, DocumentCheck?.DocID).then(r => {
        handleSavingStatus("Saved")
        setDocumentCheck(r)
      })
      return
    } else {
      BikinDocument(ReturnObject, User, manag).then(r => {
        handleSavingStatus("Saved")
        setDocumentCheck(r)
      })
    }
    return ReturnObject
  }

  function handleAIassist() {
    if (!handleKomitmenDatatoAI) return
    if (dataList?.length === 0) {
      toast({
        title: "Belum lengkap!",
        description: "Anda Belum menulis komitmen",
        variant: "destructive",
        duration: 2000,
      })
      return
    }
    if (dataList && dataList?.filter((m) => m.Isi === undefined || m.Isi === "" || m.Isi === null).length > 0) {
      toast({
        title: "Belum lengkap!",
        description: "Ada beberapa komitmen yang belum di deskripsikan",
        variant: "destructive",
        duration: 2000,
      })
      return
    }
    handleKomitmenDatatoAI(dataList)
    setDisabledAI(true)
    setprevEditorContentCheck(aditor?.getText())

  }


  const renderManagerSelect = useMemo(() => {
    if (User?.manager) {
      const manag = Managers.find((man) => man.email === User.manager)
      return <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="gap-5"
          >
            {manag?.username}
            <ChevronsUpDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" align="start">
          <Command>
            <CommandInput placeholder="Cari Manager..." />
            <CommandEmpty>Cari Manager...</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {Managers.map((manager, index) => (
                  <CommandItem
                    key={index}
                    value={manager.email}
                    onSelect={(cmanager) => handleSelectManagerChange(cmanager)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        manager.email === User.manager ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {manager.username}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    } else {
      return <div className="flex gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-5"
            >
              <span className="text-muted-foreground">Pilih Manager...</span>
              <ChevronsUpDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" align="start">
            <Command>
              <CommandInput placeholder="Cari Manager..." />
              <CommandEmpty>Cari Manager...</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {Managers.map((manager, index) => (
                    <CommandItem
                      key={index}
                      value={manager.email}
                      onSelect={(cmanager) => handleSelectManagerChange(cmanager)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          manager.email === User?.manager ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {manager.username}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <CircleAlert className="w-7 h-7 text-red-500" />
      </div>
    }
    //@ts-ignore
  }, [User])

  // -- TipTapJS --
  const customTaskList = TaskList.extend({
    addKeyboardShortcuts() {
      return {
        'Mod-k': () => this.editor.commands.toggleTaskList(),
        'Tab': () => this.editor.commands.toggleTaskList(),
        'Shift-Enter': () => this.editor.commands.enter(),
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
      customTaskList,
      TaskItem,
      Placeholder.configure({
        placeholder: () => {
          return "(Ctrl + K) untuk menjelaskan situasi secara singkat, lalu (Enter) dan (Tab) untuk menjelaskan tugas, aksi, dan hasil."
        },
        considerAnyAsEmpty: true,
        includeChildren: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: "w-full px-3 py-4 text-black outline-none"
      }
    },
  })


  const $Isi = aditor?.$nodes('paragraph')
  const $OLItem = aditor?.$nodes('orderedList')
  const $BulletListItem = aditor?.$nodes('bulletList')
  const $blockquoteList = aditor?.$nodes('blockquote')
  const $Judul = aditor?.$nodes('taskList')
  const $bqList = aditor?.$nodes('')
  const bqList = ($blockquoteList || []).map(($el) => {
    return {
      content: $el.textContent,
      pos: $el.pos,
    }
  })
  const BLList = ($BulletListItem || []).map(($el) => {
    return {
      content: $el.textContent,
      pos: $el.pos
    }
  })
  const OLList = ($OLItem || []).map(($el) => {
    return {
      content: $el.textContent,
      pos: $el.pos
    }
  })
  const isiList = ($Isi || []).map(($el) => {
    return {
      content: $el.textContent,
      pos: $el.pos
    }
  })

  const dataList: KomitmenData[] | undefined = useMemo(() => $Judul?.map(($el, i) => {
    const pos = $el.pos;
    const posNext = i < ($Judul.length - 1) ? $Judul[i + 1].pos : 0;
    const isiArr = isiList.filter((d) => posNext > 0 ? (d.pos > pos && d.pos < posNext) : (d.pos > pos)).map((d) => d.content)
    const Blist = BLList.filter((d) => posNext > 0 ? (d.pos > pos && d.pos < posNext) : (d.pos > pos)).map((d) => d.content)
    const Olist = OLList.filter((d) => posNext > 0 ? (d.pos > pos && d.pos < posNext) : (d.pos > pos)).map((d) => d.content)

    const BQList = bqList.filter((d) => posNext > 0 ? (d.pos > pos && d.pos < posNext) : (d.pos > pos)).map((d) => d.content)
    const semuanya = [...Olist, ...Blist, ...isiArr, ...BQList].join(' ')
    return {
      Judul: $el.textContent,
      Isi: semuanya
    };
    //@ts-ignore
  }), [$Judul, isiList])

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
            <h1>Ceritakan bagaimana progress KPI kamu hingga saat ini?</h1>
            <EditorContent editor={aditor} />
            <div className="flex gap-4 self-end">
              <Button
                disabled={DisabledAI}
                onClick={handleAIassist}
                className="w-fit gap-3 self-end">
                <Sparkles />
                <p>Cek Kualitas Deskripsi</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { KomitmenData }
