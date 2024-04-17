'use client'
import { Button } from "@/components/ui/button"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getMentees } from "./Server/GetMentees"
import { Prisma, User } from "@prisma/client"
import { Loader2, UsersRound } from "lucide-react"
import Link from "next/link"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Mentee = {
  UserID: number;
  username: string;
  password: string;
  email: string;
  manager: string | null;
  Documents: {
    DocID: number;
    DocumentID: string;
    DocContent: string | null;
    updated_at: Date;
    created_at: Date;
    OwnerUserID: number | null;
  }[];
};


export default function ListMentee() {
  const [UserData, setUserData] = useState<User | null>(null)
  const [MenteeLists, setMenteeLists] = useState<Mentee[] | undefined>([])
  const [LoadingList, setLoadingList] = useState(true)
  const router = useRouter()

  function handleLogout() {
    localStorage.removeItem('UserStore')
    router.push('/Login')
  }

  function handleMulaiInteraksi(Mentee: User) {
    sessionStorage.setItem('MenteeData', JSON.stringify(Mentee))
    router.push(`/OneOnOne/Review/${Mentee.username}`)
  }

  useEffect(() => {
    const Userdata = localStorage.getItem('UserStore')
    const res = setUserData(Userdata ? JSON.parse(Userdata) : null)
    if (!Userdata) {
      router.push('/Login')
    }
  }, [])

  useEffect(() => {
    setLoadingList(false)
    getMentees(UserData?.email).then((R) => {
      // @ts-ignore
      setMenteeLists(R)
      setLoadingList(true)
    })
  }, [UserData])
  return (
    <div className="flex flex-col">
      <div className="heder flex w-full items-center justify-between py-5 px-10 border-b border-b-black ">
        <div className="flex flex-col">
          <p className="text-3xl font-semibold">List Anggota</p>
          <p>Hello {UserData?.username}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="link" asChild>
            <Link className="hover:text-purple-300" href={`/OneOnOne/${UserData?.username}`}>
              <div className="flex gap-2 items-center">
                <UsersRound />
                <p>Switch to team member</p>
              </div>
            </Link>
          </Button>
          <Button onClick={handleLogout}>Log Off</Button>
        </div>
      </div>
      <div className="flex w-full p-20 flex-col justify-center items-center">
        <div className="flex w-full flex-col rounded-xl border-2-black">
          <div className="grid w-full grid-cols-3 py-2 px-5 text-xl rounded-t-xl border-2 border-black ">
            <p className="col-span-2">Nama Aggota</p>
            <p className="col-span-1">Action</p>
          </div>
          <div >
            {LoadingList && MenteeLists ? MenteeLists.map((Mentee, index) => {
              return <div key={index} className="grid items-center w-full grid-cols-3 py-2 px-5 gap-1 border-2 border-black">
                <p className="col-span-2">{Mentee.username}</p>
                <Button className="w-fit" onClick={() => handleMulaiInteraksi(Mentee)} disabled={Mentee.Documents.length <= 0}>Mulai Interaksi</Button>
              </div>
            }) : <div className="flex py-12 w-full gap-4 items-center justify-center border-2 border-black">
              <Loader2 className="w-12 h-12 animate-spin text-black" />
              <p className="text-lg">Loading</p>
            </div>}
          </div>
        </div>
      </div>
    </div>
  )
}
