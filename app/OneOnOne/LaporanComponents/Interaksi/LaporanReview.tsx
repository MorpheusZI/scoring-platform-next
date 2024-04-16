import '../LaporStyles.css'
import React, { useState, useEffect } from "react"
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
import { AmbilPreDocument } from '../../Server/BikinDocument';
import { SummaryReq, vertexAISummarizer } from '../../Server/ambilData';

type LaporanProps = {
  User: User | null;
  CallSummary: boolean;
  SummaryFuncToSideBar: (aiResp: string | undefined) => void;
}

export default function Laporan({ User, CallSummary, SummaryFuncToSideBar }: LaporanProps) {
  const [ActiveEditor, setActiveEditor] = useState<Editor | null>(null)
  const [Mentee, setMentee] = useState<User | null>()
  const [KomitmenBawahanContent, setKomitmenBawahaContent] = useState<string | null | undefined>(null)

  useEffect(() => {
    const MenteeData = sessionStorage.getItem('MenteeData')
    const MenteeDat = MenteeData ? JSON.parse(MenteeData) : null
    setMentee(MenteeDat)
    // @ts-ignore
  }, [])

  useEffect(() => {
    if (!Mentee) return
    AmbilPreDocument(Mentee.UserID).then(Doc => setKomitmenBawahaContent(Doc?.DocHTML))
    // @ts-ignore
  }, [Mentee])

  const customTaskList = TaskList.extend({
    addKeyboardShortcuts() {
      return {
        'Mod-k': () => this.editor.commands.toggleTaskList(),
      }
    },
  })

  const editorOptions: Partial<EditorOptions> | undefined = {
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
        placeholder: "CTRL+K Untuk menambah komitmen",
        emptyEditorClass: "first:before:h-0 first:before:text-gray-400 first:before:content-[attr(data-placeholder)] first:before:float-left"
      }),
    ],
    editorProps: {
      attributes: {
        class: "w-full py-4 text-black outline-none",
      }
    },
  }

  const PreInteraksiEditor = useEditor(editorOptions)
  useEffect(() => {
    if (!KomitmenBawahanContent) return
    PreInteraksiEditor?.commands.setContent(KomitmenBawahanContent)
    // @ts-ignore
  }, [KomitmenBawahanContent])

  const KomitmenAtasanEditor = useEditor(editorOptions)
  const Catatan = useEditor(editorOptions)

  function handleSummarize() {
    const DataSummary: SummaryReq = {
      KomitmenAtasan: KomitmenAtasanEditor?.getText(),
      KomitmenBawahan: PreInteraksiEditor?.getText(),
      Catatan: Catatan?.getText(),
      NamaManager: User?.username,
      NamaMentee: Mentee?.username
    }

    const aiSummary = vertexAISummarizer(DataSummary).then((res) => SummaryFuncToSideBar(res))
  }

  useEffect(() => {
    if (!KomitmenBawahanContent) return
    handleSummarize()
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

