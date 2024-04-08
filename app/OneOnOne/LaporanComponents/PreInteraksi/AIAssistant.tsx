import { Button } from "@/components/ui/button";
import { useEffect } from 'react'
import { BotMessageSquare, LoaderCircle } from "lucide-react";
import { useState } from "react"

import { KomitmenData } from '../PreInteraksi/Laporan'
import { AIResponse, NestedObject, testingdata } from "../../Server/ambilData";
export type AiAssistProps = {
  KomitmenDataArr: KomitmenData[]
  KomitmenChange: boolean
}

export default function AiAssist({ KomitmenDataArr, KomitmenChange }: AiAssistProps) {
  const [AIResState, setAIResState] = useState<string>("null")
  const [AIRes, setAIRes] = useState<any>([])

  useEffect(() => {
    const Komitmendat: KomitmenData = {
      Judul: "Mempelajari Vertex AI",
      Isi: "Saya melakukan komitmen ini dengan cara mengakses course dari Google. Saya mendapat knowledge baru dalam pengembangan product ke depan, yaitu memanfaatkan AI dalam proses. Saya merasa senang karena bisa mempelajari AI, sesuatu yang saya awalnya rasa ini sulit, ternyata bisa dipelajari."
    }
    if (KomitmenDataArr.length !== 0) {
      setAIResState("loading");
      testingdata([Komitmendat]).then(res => {
        setAIRes(res);
        setAIResState("fullfilled");
        console.log(AIRes)
      }).catch(error => {
        console.error("Error fetching AI data:", error);
        setAIResState("null");
      });
    }
  }, [KomitmenChange]);

  function loadingState() {

    switch (AIResState) {
      case "null":
        return <div className="flex flex-col items-center py-10 border-2 bg-white rounded-xl border-gray-300 ">
          <div className="flex flex-col gap-5 items-center">
            <h1 className="text-lg">AI STAR Checker</h1>
            <BotMessageSquare className="w-16 h-16" />
          </div>
        </div>
        break;

      case "loading":
        return <div className="flex justify-evenly py-5 items-center ">
          <LoaderCircle className="w-16 h-16 animate-spin" />
          <p className="text-lg">AI sedang memasak ...</p>
        </div>
        break;
      case "fullfilled":
        return AIRes.map((res: AIResponse, index: number) => {
          return <div key={index} className="flex flex-col p-5 gap-7 border-2 bg-white rounded-xl border-gray-300 ">
            <h1 className="text-md font-semibold">{res.Judul}</h1>
            <div className="flex text-sm justify-between gap-2">
              <p>{res.Situasi.Kualitas}</p>
              <p className="font-semibold">Situasi:</p>
              <p>{res.Situasi.Komentar}</p>
            </div>
            <div className="flex text-sm justify-between gap-2">
              <p>{res.Tugas.Kualitas}</p>
              <p className="font-semibold">Tugas: </p>
              <p>{res.Tugas.Komentar}</p>
            </div>
            <div className="flex text-sm justify-between gap-2">
              <p>{res.Aksi.Kualitas}</p>
              <p className="font-semibold">Aksi: </p>
              <p>{res.Aksi.Komentar}</p>
            </div>
            <div className="flex text-sm justify-between gap-2">
              <p>{res.Hasil.Kualitas}</p>
              <p className="font-semibold">Hasil: </p>
              <p>{res.Hasil.Komentar}</p>
            </div>
          </div>
        })

        break;

    }
  }
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg">AI Assistance</h1>
      {loadingState()}
    </div>
  )
}
