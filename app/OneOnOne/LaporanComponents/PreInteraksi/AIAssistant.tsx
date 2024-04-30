import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from 'react'
import { BotMessageSquare, CheckCircleIcon, CircleX, Lightbulb, LoaderCircle } from "lucide-react";
import { useState } from "react"

import { KomitmenData } from '../PreInteraksi/Laporan'
import { AIResponse, NestedObject, testingdata } from "../../Server/ambilData";
export type AiAssistProps = {
  KomitmenDataArr: KomitmenData[]
  KomitmenChange: boolean
}
type AIResState = "null" | "err2" | "loading" | "fullfilled"

export default function AiAssist({ KomitmenDataArr, KomitmenChange, }: AiAssistProps) {
  const [AIResState, setAIResState] = useState<AIResState>("null")
  const [AIRes, setAIRes] = useState<(AIResponse | null)[]>([])

  useEffect(() => {
    AIStarCheck()
    //@ts-ignore
  }, [KomitmenChange]);

  function AIStarCheck() {
    if (KomitmenDataArr.length !== 0 && AIRes !== null) {
      setAIResState("loading");
      testingdata(KomitmenDataArr).then(res => {
        setAIRes(res);
        setAIResState("fullfilled");
      }).catch(error => {
        setAIResState("null");
      });
    }
  }

  useEffect(() => {
    if (!AIRes) return
    const theresAnEmptyObjectOmg = AIRes.filter((AI) => AI?.Situasi.Komentar === "" && AI.Tugas.Komentar === "" && AI.Aksi.Komentar === "" && AI.Hasil.Komentar === "")
    if (theresAnEmptyObjectOmg.length > 0) {
      testingdata(KomitmenDataArr).then(res => {
        setAIRes(res)
        setAIResState("fullfilled")
      })
      setAIResState("err2")
    }
    // @ts-ignore
  }, [AIRes])

  function CheckPercentage(percent: string | undefined) {
    if (!percent) return
    const numberz = parseInt(percent.replace("%", ""))
    if (numberz === 0) {
      return <p><CircleX className="text-red-400" /></p>
    } else if (numberz === 100) {
      return <p ><CheckCircleIcon className="text-green-400" /></p>
    } else {
      return <p className="py-1"><Lightbulb className=" text-yellow-300" /></p>
    }
    return <p>hi</p>
  }


  function renderValues(values: NestedObject | undefined, key: string) {
    if (values?.Komentar === "") {
      return <div key={key} className="flex gap-3 text-sm">
        <CircleX className="h-8 w-8 text-red-500" />
        <p className="text-red-500"> AI tidak menemukan kalimat yang memenuhi kriteria {key}</p>
      </div>
    }
    if (key === "Judul") return
    return <div key={key} className="flex gap-2 text-sm">
      {CheckPercentage(values?.Kualitas)}
      <p><span className="font-semibold">{key}</span>: {values?.Komentar}</p>
    </div>
  }

  const loadingState = useMemo(() => {
    switch (AIResState) {
      case "null":
        return <div className="flex flex-col items-center py-10 border-2 bg-white rounded-xl border-gray-300 text-black ">
          <div className="flex flex-col gap-5 items-center">
            <h1 className="text-lg">AI STAR Checker</h1>
            <BotMessageSquare className="w-10 h-10" />
          </div>
        </div>
        break;

      case "loading":
        return <div className="flex justify-evenly py-5 items-center text-black ">
          <LoaderCircle className="w-12 h-12 animate-spin" />
          <p>AI sedang memasak ...</p>
        </div>
        break;
      case "err2":
        return <div className="flex flex-col py-5 items-center text-black">
          <p className="text-sm">Menghadapi error dari AI.</p>
          <Button onClick={AIStarCheck}>Coba Ulang</Button>
        </div>
        break;
      case "fullfilled":
        return AIRes.map((res, index: number) => {
          return <div key={index} className="flex flex-col p-5 gap-7 border-2 bg-white rounded-xl border-gray-300 text-black">
            <h1 className="text-md text-center border-b-2 border-b-black pb-4 font-semibold">{res?.Judul}</h1>
            {res ?
              Object.entries(res).map(([k, v]) => {
                const value = v as NestedObject
                return renderValues(value, k)
              })
              : null}
          </div>
        })
        break;
    }
    //@ts-ignore
  }, [KomitmenChange, AIResState])

  return (
    <div className="flex flex-col px-2 py-5 gap-3">
      <h1 className="text-lg  px-3">AI Assistance</h1>
      {loadingState ? loadingState : null}
    </div>
  )
}
