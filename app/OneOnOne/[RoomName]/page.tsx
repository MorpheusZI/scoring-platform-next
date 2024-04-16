'use client'
import { useState, useEffect, Suspense } from 'react'
import Sidebar from "../LaporanComponents/PreInteraksi/Sidebar"
import Laporan, { EditorTextandHTML, KomitmenData } from '../LaporanComponents/PreInteraksi/Laporan'
import { redirect } from 'next/navigation'
import { User } from '@prisma/client'
import Loading from './loading'
import { Button } from '@/components/ui/button'
import { Check, CircleUser, Loader } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'
export default function Home() {
  const [KomitmenDatArr, setKomitmenDataArr] = useState<KomitmenData[] | undefined>([])
  const [KomitmenChange, setKomitmenChange] = useState<boolean>(false)

  const [HTMLContentCall, setHTMLContentCall] = useState<boolean>(false)
  const [SaveStatus, setSaveStatus] = useState<string>("nill")

  const [UserData, setUserData] = useState<User | null>()


  useEffect(() => {
    setKomitmenChange(!KomitmenChange)
  }, [])

  useEffect(() => {
    const Userdata = localStorage.getItem('UserStore')
    const res = setUserData(Userdata ? JSON.parse(Userdata) : null)
    if (!Userdata) {
      return redirect('/Login')
    }
  }, [])

  const handleKomitmenData = (KomDataArr: KomitmenData[] | undefined) => {
    setKomitmenDataArr(KomDataArr)
    setKomitmenChange(!KomitmenChange)
  };

  const handleSaveKomitmenData = () => {
    setHTMLContentCall(!HTMLContentCall)
  }

  const RenderSave = () => {
    switch (SaveStatus) {
      case "nill":
        return <Button onClick={handleSaveKomitmenData}>Simpan Penilaian</Button>
        break;
      case "Saving":
        return <div className="px-16 py-2 rounded-lg bg-black">
          <Loader className="text-white animate-spin" />
        </div>
        break;
      case "Saved":
        toast({
          title: "Komitmen telah disimpan!"
        })
        setTimeout(() => {
          setSaveStatus("nill")
        }, 2000);
        return <div className="px-16 py-2 rounded-lg bg-black">
          <Check className="text-white" />
        </div>
        break;
      default:
        return <Button onClick={handleSaveKomitmenData}>Simpan Penilaian</Button>
        break;
    }
  }

  return (
    <div className="flex flex-col h-[100vh] overflow-hidden">
      <div className="flex w-full justify-between items-center px-7 py-5 border-b-2 border-black">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Pre-Interaksi</h1>
          <p className="text-sm">Project IDP Product Designer</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="hover:text-purple-300" variant="link">
            <Link href={`/ListMentee`}>
              <div className="flex gap-2">
                <CircleUser />
                <p>Switch to Manager</p>
              </div>
            </Link>
          </Button>
          {RenderSave()}
        </div>
      </div>
      <div className="flex">
        <div className="w-[70%] border-r-2 border-r-black h-[85vh] overflow-y-scroll ">
          <Laporan
            handleSavingStatus={(Status: string) => { setSaveStatus(Status) }}
            FuncCaller={HTMLContentCall}
            User={UserData ? UserData : null}
            handleKomitmenDatatoAI={handleKomitmenData}
          />
        </div>
        <div className="w-[30%] border-r-2 border-r-black">
          <Sidebar KomitmenChange={KomitmenChange} KomitmenDataArr={KomitmenDatArr} />
        </div>
      </div>
    </div>
  );
}
