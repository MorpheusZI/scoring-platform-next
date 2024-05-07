'use client'
import '../LaporStyles.css'
import React, { useState, useEffect, useMemo } from "react"
// tipTap imports
import { useEditor, Editor, EditorContent, JSONContent, EditorOptions } from '@tiptap/react';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'

//component imports
import ToolBar from "../../../Rcomponents/Toolbar";
import { getManagers, updateUserManager } from '../../Server/ambilData';

// lucide/shadcn imports
import { Check, ChevronsUpDown, CircleAlert, Sparkles } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { DropdownMenuGroup, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from "@/components/ui/button";
import { Document, User } from '@prisma/client';
import { Select, SelectValue, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/components/ui/select';
import { AmbilPreDocument, BikinDocument, UpdatePreDocument, getUser } from '../../Server/BikinDocument';
import { Subtopics } from '../../Server/Topics';
import { redirect, useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { getDocs } from '@/app/ListMentee/Server/GetMentees';
import { LoadingState } from '../../[RoomName]/page';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandList, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

type LaporanProps = {
  handleKomitmenDatatoAI?: (KomDataArr: KomitmenData[] | undefined) => void
  User: User | null;
  FuncCaller?: boolean;
  UserUpdater?: () => void;
  handleSavingStatus?: (Status: LoadingState) => void
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
  // -- State --
  const [Managers, setManager] = useState<User[]>([])
  const [DisabledAI, setDisabledAI] = useState(false)
  const [prevEditorContentCheck, setprevEditorContentCheck] = useState<string | undefined>("")
  const [DocumentCheck, setDocumentCheck] = useState<Document | undefined>()
  const [ActiveEditor, setActiveEditor] = useState<Editor | null>(null)
  const [Loaded, setLoaded] = useState(false)
  const [Open, setOpen] = useState(false)

  // -- UseEffects --
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
      const doc = docs.sort((a, b) => {
        return b.DocID - a.DocID
      })
      const dac = doc[0]
      if (!dac) return
      aditor?.commands.setContent(dac.memberHTML)
      // editor2?.commands.setContent(dac.memberHTML2)
      // editor3?.commands.setContent(dac.memberHTML3)
      setDocumentCheck(dac)
      setLoaded(!Loaded)
    })
    //@ts-ignore
  }, [User, Managers])

  useEffect(() => {
    getHTMLandContent()
    //@ts-ignore
  }, [FuncCaller])

  useEffect(() => {
    const json = aditor?.getHTML()
    if (!json) return
    const res = parseContent(json)
    if (!res) {
      return
    }
    aditor?.commands.setContent(res)
    //@ts-ignore
  }, [Loaded, Managers, User])

  const filteredManagers = Managers.filter((m) => m.email !== User?.email)

  // -- Functions -- 
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
        const res = BikinDocument(ReturnObject, /* editor2?.getHTML(), editor3?.getHTML(), */ User, manag).then(r => {
          handleSavingStatus("Saved")
          setDocumentCheck(r)
        })
        return
      }
      const res = UpdatePreDocument(ReturnObject,/*  editor2?.getHTML(), editor3?.getHTML(), */ User.UserID, DocumentCheck?.DocID).then(r => {
        handleSavingStatus("Saved")
        setDocumentCheck(r)
      })
      return
    } else {
      const res = BikinDocument(ReturnObject,/*  editor2?.getHTML(), editor3?.getHTML(), */ User, manag).then(r => {
        handleSavingStatus("Saved")
        setDocumentCheck(r)
      })
    }
    return ReturnObject
  }

  function parseContent(content: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const taskListItems = doc.querySelectorAll('ul[data-type="taskList"]');
    let filteredContent = '';
    let skipContent = false;

    taskListItems.forEach((item, index) => {
      const isChecked = item.querySelector('li[data-checked="true"]');
      if (isChecked) {
        skipContent = true
      } else {
        skipContent = false
        filteredContent += item.outerHTML
      }
      let nextSibling = item.nextElementSibling;
      while (nextSibling && !nextSibling.hasAttribute('data-type="taskList"')) {
        if (!skipContent) {
          filteredContent += nextSibling.outerHTML;
        }
        nextSibling = nextSibling.nextElementSibling;
      }
    });

    return filteredContent;
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
            aria-expanded={Open}
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
      const manag = Managers.find((man) => man.email === User?.manager)
      return <div className="flex gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              aria-expanded={Open}
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

  const Editoropts: Partial<EditorOptions> | undefined = {
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
          if (node.type.name === "taskList") {
            return "CTRL + K Lagi untuk mendeskripsikan"
          }
          return "(Ctrl + K) untuk menjelaskan situasi secara singkat, lalu (Enter) dan (Tab) untuk menjelaskan tugas, aksi, dan hasil."
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "w-full px-3 py-4 text-black outline-none"
      }
    },
  }

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
          return "(Ctrl + K) untuk menjelaskan situasi secara singkat, lalu (Enter) dan (Tab) untuk menjelaskan tugas, aksi, dan hasil."
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "w-full px-3 py-4 text-black outline-none"
      }
    },
  })
  // const editor2 = useEditor(Editoropts)
  // const editor3 = useEditor(Editoropts)

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
          {/*
          <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
            <h1>Apa yang menjadi kendala goal tersebut belum dapat anda capai?</h1>
            <EditorContent onFocus={() => setActiveEditor(editor2)} editor={editor2} />
          </div>
          <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
            <h1>Apa saja yang kamu butuhkan utk mencapai goals karir itu? dan apakah ada external support dari atasan atau Talentlytica dapat berikan?</h1>
            <EditorContent onFocus={() => setActiveEditor(editor3)} editor={editor3} />
          </div>
          */}
        </div>
      </div>
    </div>
  );
}

export type { KomitmenData }
