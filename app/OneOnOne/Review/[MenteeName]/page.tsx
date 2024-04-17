'use client'
import { useState, useEffect } from 'react'
import Sidebar from '../../LaporanComponents/Interaksi/SideBarReview'
import Laporan from '../../LaporanComponents/Interaksi/LaporanReview'
import { redirect } from 'next/navigation'
import { User } from '@prisma/client'
import { KomitmenData } from '../../LaporanComponents/PreInteraksi/Laporan'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
export default function Home({ params }: { params: { RoomName: string } }) {
  const [UserData, setUserData] = useState<User | null>()
  const [SummaryCall, setSummaryCall] = useState(false)
  const [SumarryText, setSummaryText] = useState<string | undefined>()
  const { toast } = useToast()

  function handleSumarry(aiResp: string | undefined) {
    setSummaryText(aiResp)
    toast({
      title: "Tersimpan!",
      description: "Interaksi anda sudah disimpan",
      duration: 2000
    })
  }

  useEffect(() => {
    const Userdata = localStorage.getItem('UserStore')
    const res = setUserData(Userdata ? JSON.parse(Userdata) : null)
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
          <Button onClick={() => setSummaryCall(!SummaryCall)}>Simpan</Button>
        </div>
      </div>
      <div className="flex">
        <div className="w-[70%] border-r-2 border-r-black h-[85vh] overflow-y-auto ">
          <Laporan User={UserData ? UserData : null} CallSummary={SummaryCall} SummaryFuncToSideBar={handleSumarry} />
        </div>
        <div className="w-[30%] border-r-2 border-r-black">
          <Sidebar aiResp={SumarryText} SummaryCall={SummaryCall} />
        </div>
      </div>
    </div>
  );
}
