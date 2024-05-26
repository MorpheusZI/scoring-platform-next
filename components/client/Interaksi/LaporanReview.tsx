import '../EditorStyles.css'
import React, { useState, useEffect, useMemo } from "react"

// tipTap imports
import { useEditor, Editor, EditorContent, EditorOptions, mergeAttributes } from '@tiptap/react';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'

//components
import ToolBar from "@/components/client/utils/Toolbar";

//functions 
import { getDocByDocID, getDocs } from '@/lib/functions/server/Database/DocumentFunctions';

//types
import { SummaryReq, LaporanRevProps, InteraksiContents } from '@/lib/types';
import { User } from '@prisma/client';

// ui imports
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/components/ui/use-toast';

export default function Laporan({ User, CallSummary, CallSave, SummaryFunc, SaveFunc, CurrentDocID }: LaporanRevProps) {
  const [ActiveEditor, setActiveEditor] = useState<Editor | null>(null)
  const [Mentee, setMentee] = useState<User | null>()
  const { toast } = useToast()

  useEffect(() => {
    const MenteeData = sessionStorage.getItem('MenteeData')
    const MenteeDat = MenteeData ? JSON.parse(MenteeData) : null
    setMentee(MenteeDat)
    // @ts-ignore
  }, [])

  useEffect(() => {
    if (!User) return
    if (!Mentee) return
    if (!CurrentDocID || CurrentDocID === null || CurrentDocID == undefined) {
      console.log(CurrentDocID)
      PreInteraksiEditor?.commands.setContent("")
      KomitmenAtasanEditor?.commands.setContent("")
      Catatan?.commands.setContent("")
      getDocs(Mentee.UserID, User.UserID).then((docs) => {
        const dac = docs.sort((a, b) => { return b.DocID - a.DocID })
        const doc = dac.find(doc => doc.managerContent === null)
        if (!doc) return
        PreInteraksiEditor?.commands.setContent(doc.memberHTML)
      })
      return
    }
    getDocByDocID(CurrentDocID).then((Doc) => {
      if (!Doc) return
      PreInteraksiEditor?.commands.setContent(Doc.memberHTML)
      KomitmenAtasanEditor?.commands.setContent(Doc.managerHTML)
      Catatan?.commands.setContent(Doc.Catatan)
    })
    // @ts-ignore
  }, [Mentee, User, CurrentDocID])

  const customTaskList = TaskList.extend({
    // renderHTML({ HTMLAttributes }) {
    //   return [
    //     'ul',
    //     mergeAttributes(this.options.HTMLAttributes, HTMLAttributes,
    //       { 'data-type': this.name }),
    //     ['div', 0],
    //     [
    //       'select',
    //       mergeAttributes(this.options.HTMLAttributes, {
    //         style: "margin:12px;padding-block:5px;padding-inline:3px;background-color:transparent;border-radius:5px;border:2px purple solid;"
    //       }),
    //       [
    //         'option', { value: "bawahan", label: "Komitmen Bawahan" }
    //       ],
    //       [
    //         'option', { value: "atasan", label: "Komitmen Atasan" }
    //       ],
    //     ],
    //   ]
    // },
    addKeyboardShortcuts() {
      return {
        'Mod-k': () => this.editor.commands.toggleTaskList(),
        'Tab': () => this.editor.commands.toggleTaskList(),
      }
    },
  })

  const editorOptions = (type?: string) => {
    const editor: Partial<EditorOptions> | undefined = {
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
        TaskItem.configure({
          HTMLAttributes: {
            style: "margin-top:1rem"
          }
        }),
        Placeholder.configure({
          includeChildren: true,
          considerAnyAsEmpty: true,
          placeholder: () => {
            if (type) {
              return "Tulis Catatan"
            }
            return "(Ctrl + K) untuk menjelaskan situasi secara singkat, lalu (Enter) dan (Tab) untuk menjelaskan tugas, aksi, dan hasil."
          },
        }),
      ],
      editorProps: {
        attributes: {
          class: "w-full py-4 text-black outline-none",
        }
      },
    }
    return editor
  }
  const PreInteraksiEditor = useEditor(editorOptions())
  const KomitmenAtasanEditor = useEditor(editorOptions())
  const Catatan = useEditor(editorOptions("catatan"))

  const setSummaryReq = useMemo(() => {
    if (!User) return
    if (!Mentee) return
    if (!KomitmenAtasanEditor?.getText() || KomitmenAtasanEditor.getText() === "") {
      return
    }
    const DataSummary: SummaryReq = {
      KomitmenAtasan: KomitmenAtasanEditor?.getText(),
      KomitmenBawahan: PreInteraksiEditor?.getText(),
      Catatan: Catatan?.getText(),
      NamaManager: User.username,
      NamaMentee: Mentee.username
    }
    SummaryFunc(DataSummary)
    // @ts-ignore
  }, [CallSummary])

  useEffect(() => {
    saveInteraksiDoc()
    // @ts-ignore
  }, [CallSave])

  function saveInteraksiDoc() {
    if (!User) return
    if (!Mentee) return
    if (!KomitmenAtasanEditor?.getText() || KomitmenAtasanEditor.getText() === "") {
      toast({
        title: "Belum Lengkap!",
        description: "Anda belum mengisi komitmen Atasan",
        variant: "destructive",
        duration: 3000
      })
      return
    }
    const DataSummary: SummaryReq = {
      KomitmenAtasan: KomitmenAtasanEditor?.getText(),
      KomitmenBawahan: PreInteraksiEditor?.getText(),
      Catatan: Catatan?.getText(),
      NamaManager: User.username,
      NamaMentee: Mentee.username
    }
    const SaveData: InteraksiContents = {
      Komitmen_Member_HTML: PreInteraksiEditor?.getHTML(),
      Komitmen_Member_Content: PreInteraksiEditor?.getText(),
      Komitmen_Manager_HTML: KomitmenAtasanEditor?.getHTML(),
      Komitmen_Manager_Content: KomitmenAtasanEditor?.getText(),
      Catatan: Catatan?.getHTML()
    }
    SaveFunc(SaveData, DataSummary)
  }

  return (
    <div id="LaporanWrap" className="h-fit relative">
      <div className="sticky top-0 z-10">
        <ToolBar editor={ActiveEditor} />
      </div>
      <div className="editor-container">
        <div className="flex flex-col gap-6 px-7 py-6">
          <h1 className="text-2xl">Laporan</h1>
          <div className="flex flex-col gap-5">
            <Accordion type="single" collapsible defaultValue="KomitmenBawahan">
              <AccordionItem value="KomitmenBawahan" className="px-7 border-b-transparent border-l-2 border-l-gray-200">
                <AccordionTrigger>
                  <h1 className="text-xl font-semibold">Komitmen Member</h1>
                </AccordionTrigger>
                <AccordionContent>
                  <EditorContent onFocus={() => setActiveEditor(PreInteraksiEditor)} editor={PreInteraksiEditor} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="KomitmenAtasan" className="px-7 border-b-transparent border-l-2 border-l-gray-200">
                <AccordionTrigger>
                  <h1 className="text-xl font-semibold">Komitmen Atasan</h1>
                </AccordionTrigger>
                <AccordionContent>
                  <EditorContent onFocus={() => setActiveEditor(KomitmenAtasanEditor)} editor={KomitmenAtasanEditor} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
              <AccordionItem value="KomitmenAtasan" className="px-7 border-b-transparent border-l-2 border-l-gray-200">
                <AccordionTrigger>
                  <h1 className="text-xl font-semibold">Catatan Lain</h1>
                </AccordionTrigger>
                <AccordionContent>
                  <EditorContent onFocus={() => setActiveEditor(Catatan)} editor={Catatan} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

