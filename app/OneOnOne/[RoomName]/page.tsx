'use client'
import { useState, useEffect, Suspense } from 'react'
import Sidebar from "../LaporanComponents/PreInteraksi/Sidebar"
import { EditorTextandHTML, KomitmenData } from '../LaporanComponents/PreInteraksi/Laporan'
import Laporan from '../LaporanComponents/PreInteraksi/Laporan'
import { redirect, useRouter } from 'next/navigation'
import { User } from '@prisma/client'
import Loading from './loading'
import { Button } from '@/components/ui/button'
import { Check, Ellipsis, Loader, LogOut, SquareUser } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'
import { getUser } from '../Server/BikinDocument'
import { Select, SelectContent, SelectGroup, SelectTrigger } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type LoadingState = "nill" | "Saved" | "Saving"

export default function Home() {
  const router = useRouter()
  const [KomitmenDatArr, setKomitmenDataArr] = useState<KomitmenData[] | undefined>([])
  const [KomitmenChange, setKomitmenChange] = useState<boolean>(false)

  const [HTMLContentCall, setHTMLContentCall] = useState<boolean>(false)
  const [SaveStatus, setSaveStatus] = useState<LoadingState>("nill")
  const [UserUpdate, setUserUpdate] = useState<boolean>(false)

  const [UserData, setUserData] = useState<User | null>()


  useEffect(() => {
    setKomitmenChange(!KomitmenChange)
    //@ts-ignore
  }, [])

  function handleLogout() {
    localStorage.removeItem('UserStore')
    router.push('/Login')
  }
  useEffect(() => {
    const Userdata = localStorage.getItem('UserStore')
    if (!Userdata) {
      return redirect('/Login')
    }
    const UserJSON: User = Userdata ? JSON.parse(Userdata) : null
    const User = getUser(UserJSON.UserID).then(Uzer => {
      setUserData(Uzer)
    })
  }, [UserUpdate])

  const handleKomitmenData = (KomDataArr: KomitmenData[] | undefined) => {
    setKomitmenDataArr(KomDataArr)
    setKomitmenChange(!KomitmenChange)
  };

  const handleUserUpdate = () => {
    setUserUpdate(!UserUpdate)
  }

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
          title: "Komitmen telah disimpan!",
          duration: 2000
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
        <div className="flex gap-5">
          {RenderSave()}
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="p-2"
                >
                  <Ellipsis />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex w-fit items-start flex-col gap-2 ">
                  <Button variant="link" asChild>
                    <Link className="hover:text-purple-300" href={`/ListMentee`}>
                      <div className="flex gap-2 items-center">
                        <SquareUser />
                        <p>Switch to manager</p>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="link" asChild onClick={handleLogout}>
                    <div className="flex hover:text-purple-300 hover:cursor-pointer gap-2 items-center">
                      <LogOut />
                      <p>Keluar</p>
                    </div>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-[70%] border-r-2 border-r-black h-[85vh] overflow-y-scroll ">
          <Laporan
            handleSavingStatus={(Status: LoadingState) => { setSaveStatus(Status) }}
            FuncCaller={HTMLContentCall}
            User={UserData ? UserData : null}
            handleKomitmenDatatoAI={handleKomitmenData}
            UserUpdater={handleUserUpdate}
          />
        </div>
        <div className="w-[30%] border-r-2 border-r-black">
          <Sidebar KomitmenChange={KomitmenChange} KomitmenDataArr={KomitmenDatArr} />
        </div>
      </div>
    </div>
  );
}
