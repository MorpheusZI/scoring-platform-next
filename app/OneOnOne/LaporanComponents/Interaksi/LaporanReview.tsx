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

// lucide/shadcn imports
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from "@/components/ui/button";
import { Document, User } from '@prisma/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AmbilPreDocument, BikinDocument, BikinInterDocument, InteraksiContents, MinteraksiContents, UpdateInterDocument } from '../../Server/BikinDocument';
import { SummaryReq, getManagers, vertexAISummarizer } from '../../Server/ambilData';
import { ExcelData, WriteToExcel } from '../../Server/Gsheet';
import { getDocByDocID, getDocs } from '@/app/ListMentee/Server/GetMentees';
import { preinit } from 'react-dom';

type LaporanProps = {
  User: User | null;
  CallSummary: boolean;
  SummaryFuncToSideBar: (aiResp: string | undefined) => void;
  CurrentDocID: number | undefined;
}

export default function Laporan({ User, CallSummary, SummaryFuncToSideBar, CurrentDocID }: LaporanProps) {
  const [ActiveEditor, setActiveEditor] = useState<Editor | null>(null)
  const [Mentee, setMentee] = useState<User | null>()
  useEffect(() => {
    const MenteeData = sessionStorage.getItem('MenteeData')
    const MenteeDat = MenteeData ? JSON.parse(MenteeData) : null
    setMentee(MenteeDat)
    // @ts-ignore
  }, [])
  useEffect(() => {
    if (!CurrentDocID) return
    getDocByDocID(CurrentDocID).then((Doc) => {
      if (!Doc) return
      PreInteraksiEditor?.commands.setContent(Doc.memberHTML)
      KomitmenAtasanEditor?.commands.setContent(Doc.managerHTML)
      Catatan?.commands.setContent(Doc.Catatan)
    })
  }, [Mentee, User, CurrentDocID])
  useEffect(() => {
    if (!Mentee) return
    if (!User) return
    AmbilPreDocument(Mentee.UserID, User.UserID).then(Doc => {
      console.log(Doc?.memberHTML)
      if (!Doc) return
      PreInteraksiEditor?.commands.setContent(Doc?.memberHTML)
    })
    // @ts-ignore
  }, [Mentee, User])

  const customTaskList = TaskList.extend({
    addKeyboardShortcuts() {
      return {
        'Mod-k': () => this.editor.commands.toggleTaskList(),
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
        TaskItem,
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === "taskItem") {
              return "Tab untuk mendeskripsikan Komitmen"
            }
            if (type) {
              return "Tulis Catatan"
            }
            return "CTRL+K Untuk Membuat Komitmen"
          },
          emptyEditorClass: "first:before:h-0 first:before:text-gray-400 first:before:content-[attr(data-placeholder)] first:before:float-left",
          showOnlyCurrent: false,
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

  const memoSaveExcel = (ExcDat: ExcelData) => {
    WriteToExcel(ExcDat).then(r => console.log("yup"))
  }

  function handleSave() {
    if (!User) return
    if (!Mentee) return
    const DataSummary: SummaryReq = {
      KomitmenAtasan: KomitmenAtasanEditor?.getText(),
      KomitmenBawahan: PreInteraksiEditor?.getText(),
      Catatan: Catatan?.getText(),
      NamaManager: User.username,
      NamaMentee: Mentee.username
    }
    const ExcelData: ExcelData = {
      member: Mentee.username,
      manager: User.username,
      created_at: new Date(),
      komitmen_member: PreInteraksiEditor?.getText(),
      komitmen_atasan: KomitmenAtasanEditor?.getText()
    }

    const aiSummary = vertexAISummarizer(DataSummary).then((res) => {
      SummaryFuncToSideBar(res)
      const InterData: InteraksiContents = {
        Komitmen_Manager_Content: KomitmenAtasanEditor?.getText(),
        Komitmen_Manager_HTML: KomitmenAtasanEditor?.getHTML(),
        Catatan: Catatan?.getHTML(),
        Summary: res
      }
      const MinterData: MinteraksiContents = {
        memberContent: PreInteraksiEditor?.getText(),
        memberHTML: PreInteraksiEditor?.getHTML(),
        managerHTML: KomitmenAtasanEditor?.getHTML(),
        managerContent: KomitmenAtasanEditor?.getText(),
        Summary: res,
        Catatan: Catatan?.getHTML()
      }
      memoSaveExcel({ ...ExcelData, summary: res })
      getDocs(Mentee.UserID, User.UserID).then(Docs => Docs.find((doc) => doc.memberID === Mentee.UserID && doc.managerID === User.UserID)).then(doc => {
        if (doc?.managerContent) {
          BikinInterDocument(MinterData, User, Mentee)
        } else {
          UpdateInterDocument(InterData, User, Mentee, doc?.DocID)
        }
        console.log("udah woi")
      })
    })
  }

  useEffect(() => {
    handleSave()
  }, [CallSummary])

  return (
    <div id="LaporanWrap" className="h-fit relative">
      <div className="sticky top-0 z-10">
        <ToolBar editor={ActiveEditor} />
      </div>
      <div className="editor-container">
        <div className="flex flex-col gap-6 px-7 py-6">
          <h1 className="text-2xl">Laporan </h1>
          <div className="flex flex-col gap-5">
            <Accordion type="single" collapsible defaultValue="KomitmenBawahan">
              <AccordionItem value="KomitmenBawahan" className="px-7 border-b-transparent border-l-2 border-l-gray-200">
                <AccordionTrigger>
                  <h1 className="text-xl font-semibold">Komitmen Bawahan</h1>
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

