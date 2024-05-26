'use client'
import { useState, useEffect, useMemo } from 'react'
import Sidebar, { CountKomitmen } from '@/components/client/Interaksi/SideBarReview'
import Laporan from '@/components/client/Interaksi/LaporanReview'
import { redirect } from 'next/navigation'
import { User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { GoogleAISummarizer } from '@/lib/functions/server/AI/AIFunctions'
import { BikinInterDocument, UpdateInterDocument } from '@/lib/functions/server/Database/DocumentFunctions'
import { SummaryReq, InteraksiContents } from "@/lib/types"
import { getDocByDocID, getDocs } from '@/lib/functions/server/Database/DocumentFunctions'
import { ExcelData, WriteToExcel } from '@/lib/functions/server/Gsheet/SaveInteraksi'
import { Check, Loader, Save } from 'lucide-react'

type savingStatus = "nill" | "Saving" | "Saved"

export default function Home() {
  const [UserData, setUserData] = useState<User | null>()
  const [DocID, setDocID] = useState<number | undefined>()
  const [Mentee, setMentee] = useState<User | null>()

  const [SummaryCall, setSummaryCall] = useState(false)
  const [SummaryText, setSummaryText] = useState<string | undefined>()

  const [SaveCall, setSaveCall] = useState<boolean>(false)
  const [SavingStatus, setSavingStatus] = useState<savingStatus>("nill")
  const { toast } = useToast()

  useEffect(() => {
    const MenteeData = sessionStorage.getItem('MenteeData')
    const MenteeDat = MenteeData ? JSON.parse(MenteeData) : null
    setMentee(MenteeDat)
    // @ts-ignore
  }, [])

  const renderSave = useMemo(() => {
    switch (SavingStatus) {
      case "nill":
        return <Button onClick={() => {
          setSaveCall(paveCall => !paveCall)
        }}>Simpan</Button>
        break;
      case "Saving":
        return <div className="px-16 py-2 rounded-lg bg-black">
          <Loader className="text-white animate-spin" />
        </div>
        break;
      case "Saved":
        toast({
          title: "Document Tersimpan!",
          description: `1 ON 1 Interaksi Telah Disimpan, ${new Date().toLocaleDateString()}`,
          duration: 1000,
        })
        setTimeout(() => {
          setSavingStatus("nill")
        }, 2000);
        return <div className="px-16 py-2 rounded-lg bg-black">
          <Check className="text-white" />
        </div>
      default:
        return <Button onClick={() => {
          setSaveCall(paveCall => !paveCall)
        }}>Simpan</Button>
        break;
    }
    //@ts-ignore
  }, [SavingStatus])

  const setSummaryTextOnDocIDChange = useMemo(() => {
    if (!DocID) {
      setSummaryText(undefined)
      return
    }
    getDocByDocID(DocID).then((doc) => {
      if (!doc?.Summary) return
      setSummaryText(doc?.Summary)
    })
  }, [DocID])

  function SummarizeText(SummaryRez: SummaryReq) {
    const AIres = GoogleAISummarizer(SummaryRez).then(res => setSummaryText(res))
  }

  function handleSavenSummary(Interaksi: InteraksiContents, SummaryReq: SummaryReq) {
    setSavingStatus("Saving")
    if (!Mentee) return
    if (!UserData) return
    const { total, done } = CountKomitmen(Interaksi.Komitmen_Member_HTML || "")
    const ExcelDat: ExcelData = {
      user: Mentee.username,
      manager: UserData.username,
      komitmen_atasan: Interaksi.Komitmen_Manager_Content,
      komitmen_member: Interaksi.Komitmen_Member_Content,
      Jumlah_Komitmen: total,
      Jumlah_Komitmen_Selesai: done,
    }

    if (!SummaryText) {
      setSavingStatus("Saving")
      const AIres = GoogleAISummarizer(SummaryReq).then((Summary) => {
        setSummaryText(Summary)
        getDocs(Mentee?.UserID, UserData?.UserID).then((doc) => {
          const newInteraksi: InteraksiContents = { ...Interaksi, Summary: Summary }
          const newExcData: ExcelData = { ...ExcelDat, summary: Summary }
          if (!doc[doc.length - 1].managerContent || doc[doc.length - 1].managerContent === null) {
            const dac = doc[doc.length - 1]
            UpdateInterDocument(newInteraksi, UserData, Mentee, dac.DocID).then(() => {
              WriteToExcel(newExcData).finally(() => setSavingStatus("Saved"))
            })
          } else {
            WriteToExcel(newExcData).finally(() => setSavingStatus("Saved"))
            BikinInterDocument(newInteraksi, UserData, Mentee).then(() => {
              WriteToExcel(newExcData).finally(() => setSavingStatus("Saved"))
            })
          }
        })
      })
    } else {
      setSavingStatus("Saving")
      const Doz = getDocs(Mentee?.UserID, UserData?.UserID).then((doc) => {
        const newInteraksi: InteraksiContents = { ...Interaksi, Summary: SummaryText }
        const newExcData: ExcelData = { ...ExcelDat, summary: SummaryText }
        if (!doc[doc.length - 1].managerContent || doc[doc.length - 1].managerContent === null) {
          const dac = doc[doc.length - 1]
          UpdateInterDocument(newInteraksi, UserData, Mentee, dac.DocID).then(() => {
            WriteToExcel(newExcData).finally(() => setSavingStatus("Saved"))
          })
        } else {
          BikinInterDocument(newInteraksi, UserData, Mentee).then(() => {
            WriteToExcel(newExcData).finally(() => setSavingStatus("Saved"))
          })
        }
      })
    }
  }

  function handleChangeDoc(DocID: number | undefined) {
    setDocID(DocID)
  }

  useEffect(() => {
    const Userdata = localStorage.getItem('UserStore')
    const UserJSON: User = (Userdata ? JSON.parse(Userdata) : null)
    const User = setUserData(UserJSON)
    if (!Userdata) {
      return redirect('/Login')
    }
  }, [])

  return (
    <div className="flex flex-col h-[100vh] overflow-hidden">
      <div className="flex w-full justify-between items-center px-7 py-5 border-b-2 border-black">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Interaksi</h1>
          <p className="text-sm">Project IDP Product Designer</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="link">
            <Link className="hover:text-purple-400" href={"/ListMentee"}>Kembali</Link>
          </Button>
          {renderSave}
        </div>
      </div>
      <div className="flex">
        <div className="w-[70%] border-r-2 border-r-black h-[85vh] overflow-y-auto ">
          <Laporan CurrentDocID={DocID} User={UserData ? UserData : null} CallSave={SaveCall} SaveFunc={handleSavenSummary} CallSummary={SummaryCall} SummaryFunc={SummarizeText} />
        </div>
        <div className="w-[30%] border-r-2 border-r-black">
          <Sidebar CurrentDocID={DocID} ChangeDocID={handleChangeDoc} User={UserData} aiResp={SummaryText} UpdateDocHistory={SaveCall} SummaryCall={() => setSummaryCall(!SummaryCall)} />
        </div>
      </div>
    </div>
  );
}
