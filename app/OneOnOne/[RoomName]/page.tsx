'use client'
import { useState, useEffect, Suspense } from 'react'
import Sidebar from "../LaporanComponents/PreInteraksi/Sidebar"
import Laporan, { EditorTextandHTML, KomitmenData } from '../LaporanComponents/PreInteraksi/Laporan'
import { redirect } from 'next/navigation'
import { User } from '@prisma/client'
import Loading from './loading'
import { Button } from '@/components/ui/button'
import { CircleUser } from 'lucide-react'
import Link from 'next/link'
export default function Home() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [clickedHeader, setClickedHeader] = useState<string>()
  const [KomitmenDatArr, setKomitmenDataArr] = useState<KomitmenData[]>([])
  const [KomitmenChange, setKomitmenChange] = useState<boolean>(false)
  const [UserData, setUserData] = useState<User | null>()

  const [HTMLContentCall, setHTMLContentCall] = useState<boolean>(false)

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
  const handleKomitmenData = (KomDataArr: KomitmenData[]) => {
    console.log(KomDataArr, "ini dari page")
    //   setKomitmenDataArr(KomDataArr)
    //   setKomitmenChange(!KomitmenChange)
  };


  const updateHeaders = (newHeaders: string[]) => {
    setHeaders(newHeaders);
  };

  const updateClickedHeader = (cHeader: string) => {
    setClickedHeader(cHeader)
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
          <Button onClick={() => setHTMLContentCall(!HTMLContentCall)}>Simpan Penilaian</Button>
        </div>
      </div>
      <div className="flex">
        <div className="w-[70%] border-r-2 border-r-black h-[85vh] overflow-y-scroll ">
          <Laporan FuncCaller={HTMLContentCall} User={UserData ? UserData : null} handleKomitmenDatatoAI={handleKomitmenData} />
        </div>
        <div className="w-[30%] border-r-2 border-r-black">
          <Sidebar KomitmenChange={KomitmenChange} KomitmenDataArr={KomitmenDatArr} />
        </div>
      </div>
    </div>
  );
}
