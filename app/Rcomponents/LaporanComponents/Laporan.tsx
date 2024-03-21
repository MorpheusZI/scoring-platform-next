'use client'

import { useEffect, useState } from "react"
import { Editor } from '@tiptap/react'
import TipTap from "../TipTap"
import ToolBar from "../Toolbar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface LaporanProps {
  onUpdateHeaders?: (newHeaders: string[]) => void;
  clickedHeader?: string
}

export default function Laporan({ onUpdateHeaders, clickedHeader }: LaporanProps) {
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null)

  useEffect(() => {
    const heders = document.querySelectorAll('#heading')
    const headingtext = Array.from(heders).map(h => h.innerHTML)
    onUpdateHeaders ? onUpdateHeaders(headingtext) : console.log("ayayay")
  }, [])

  useEffect(() => {
    const heders = document.querySelectorAll('#heading')
    const headingtext = Array.from(heders).map(h => h.innerHTML)
    const headingElement = Array.from(heders)
    const LaporanWrap = document.getElementById('LaporanWrap')
    headingtext.map((he) => {
      if (he === clickedHeader) {
        let foundheader = headingElement.find(h => h.innerHTML === he)
        let ParentofHeader = foundheader?.parentNode as Element
        let pp = ParentofHeader.parentNode as Element
        pp.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
        pp.classList.toggle("bg-cyan-500")
        setTimeout(() => {
          pp.classList.remove('bg-cyan-500')
        }, 200)
      }
    })
    clickedHeader = ''
  }, [clickedHeader])

  function handleEditorReady(editor: Editor | null) {
    setEditorInstance(editor)
  }

  return (
    <div id="LaporanWrap" className="h-[200vh]">
      <ToolBar editor={editorInstance} />
      <div className="flex flex-col gap-6 px-7 py-6">
        <h1 className="text-2xl">Laporan</h1>
        <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
          <h1>Ceritakan bagaimana berjalannya komitmenmu dalam 2 minggu terakhir.</h1>
          <div className="flex flex-col gap-3 p-3 rounded-lg transition-all duration-500 ease-out">
            <div className="flex gap-2 items-center">
              <Checkbox id="id1" />
              <Label className="text-md" htmlFor="id1" id="heading">Mempelajari vertex AI</Label>
            </div>
            <TipTap onEditorReady={handleEditorReady} />
          </div>
          <div className="flex flex-col gap-3 p-3 rounded-lg transition-all duration-500 ease-out">
            <div className="flex gap-2 items-center">
              <Checkbox id="id1" />
              <Label className="text-md" htmlFor="id1" id="heading">Ahay</Label>
            </div>
            <TipTap onEditorReady={handleEditorReady} />
          </div>
        </div>
      </div>
    </div>
  )
}
