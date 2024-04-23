'use client'
import { useState, useEffect, useMemo } from 'react'
import Sidebar from '../../LaporanComponents/Interaksi/SideBarReview'
import Laporan from '../../LaporanComponents/Interaksi/LaporanReview'
import { redirect } from 'next/navigation'
import { User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { SummaryReq, vertexAISummarizer } from '../../Server/ambilData'
import { BikinInterDocument, InteraksiContents, UpdateInterDocument } from '../../Server/BikinDocument'
import { getDocByDocID, getDocs } from '@/app/ListMentee/Server/GetMentees'
import { ExcelData, WriteToExcel } from '../../Server/Gsheet'
import { Check, Loader } from 'lucide-react'
export default function Home() {
  const [UserData, setUserData] = useState<User | null>()
  const [DocID, setDocID] = useState<number | undefined>()
  const [Mentee, setMentee] = useState<User | null>()

  const [SummaryCall, setSummaryCall] = useState(false)
  const [SummaryText, setSummaryText] = useState<string | undefined>()

  const [SaveCall, setSaveCall] = useState<boolean>(false)
  const [SavingStatus, setSavingStatus] = useState("nill")
  const { toast } = useToast()

  useEffect(() => {
    const MenteeData = sessionStorage.getItem('MenteeData')
    const MenteeDat = MenteeData ? JSON.parse(MenteeData) : null
    setMentee(MenteeDat)
    // @ts-ignore
  }, []
  )
  const renderSave = useMemo(() => {
    switch (SavingStatus) {
      case "nill":
        return <Button onClick={() => setSaveCall(!SaveCall)}>Simpan</Button>
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
        break;
    }
  }, [SavingStatus])
  const setSummaryTextOnDocIDChange = useMemo(() => {
    if (!DocID) return
    getDocByDocID(DocID).then((doc) => {
      if (!doc?.Summary) return
      setSummaryText(doc?.Summary)
    })
  }, [DocID])

  function SummarizeText(SummaryRez: SummaryReq) {
    const AIres = vertexAISummarizer(SummaryRez).then(res => setSummaryText(res))
  }

  function handleSavenSummary(Interaksi: InteraksiContents, SummaryReq: SummaryReq) {
    setSavingStatus("Saving")
    if (!Mentee) return
    if (!UserData) return
    if (!Interaksi.Komitmen_Manager_Content) return
    const ExcelDat: ExcelData = {
      member: Mentee.username,
      manager: UserData.username,
      komitmen_atasan: Interaksi.Komitmen_Manager_Content,
      komitmen_member: Interaksi.Komitmen_Member_Content,
    }

    if (!SummaryText) {
      setSavingStatus("Saving")
      const AIres = vertexAISummarizer(SummaryReq).then((Summary) => {
        setSummaryText(Summary)
        getDocs(Mentee?.UserID, UserData?.UserID).then((doc) => {
          const newInteraksi: InteraksiContents = { ...Interaksi, Summary: Summary }
          const newExcData: ExcelData = { ...ExcelDat, summary: Summary }
          if (!doc[doc.length - 1].managerContent || doc[doc.length - 1].managerContent === null) {
            const dac = doc[doc.length - 1]
            UpdateInterDocument(newInteraksi, UserData, Mentee, dac.DocID).then(() => {
              WriteToExcel(newExcData).then(() => setSavingStatus("Saved"))
            })
          } else {
            BikinInterDocument(newInteraksi, UserData, Mentee).then(() => {
              WriteToExcel(newExcData).then(() => setSavingStatus("Saved"))
            }
            )
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
            WriteToExcel(newExcData).then(() => setSavingStatus("Saved"))
          })
        } else {
          BikinInterDocument(newInteraksi, UserData, Mentee).then(() => {
            WriteToExcel(newExcData).then(() => setSavingStatus("Saved"))
          })
        }
      })
      console.log("eh udah ada summary cog astaga")
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
