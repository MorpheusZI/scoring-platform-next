'use client'
import { Button } from "@/components/ui/button"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getDocs, getMentees } from "./Server/GetMentees"
import { Prisma, User } from "@prisma/client"
import { ChevronDown, CircleUserRound, Loader2, LogOut, UserRoundX, UsersRound } from "lucide-react"
import Link from "next/link"
import { Select, SelectGroup, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function ListMentee() {
  const [UserData, setUserData] = useState<User | null>(null)
  const [MenteeLists, setMenteeLists] = useState<User[] | undefined>([])
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
    //@ts-ignore
  }, [])

  useEffect(() => {
    if (!UserData) return
    setLoadingList(false)
    getMentees(UserData.email).then((R) => {
      setMenteeLists(R)
      setLoadingList(true)
    })
    //@ts-ignore
  }, [UserData])
  function AdaDokumen(mentee: User): boolean | undefined {
    if (!UserData) return
    const res = getDocs(mentee.UserID, UserData.UserID).then((docs) => {
      const dac = docs[0]
      if (!dac) {
        return false
      }
      if (dac.memberContent === "" || !dac.memberContent || !dac.memberHTML) {
        return true
      }
      return true
    })
  }
  return (
    <div className="flex flex-col">
      <div className="heder flex w-full items-center justify-between py-5 px-10 border-b border-b-black ">
        <div className="flex flex-col">
          <p className="text-3xl font-semibold">List Anggota</p>
          <p>Hello {UserData?.username}</p>
        </div>
        <div className="flex items-center gap-4">
          <CircleUserRound className=" w-8 h-8" />
          <p>Hello! {UserData?.username}</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="p-2"
              >
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex w-fit items-start flex-col gap-2 ">
                <Button variant="link" asChild>
                  <Link className="hover:text-purple-300" href={`/OneOnOne/${UserData?.username}`}>
                    <div className="flex gap-2 items-center">
                      <UsersRound />
                      <p>Switch to team member</p>
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
                <Button className="w-fit" onClick={() => handleMulaiInteraksi(Mentee)}>Mulai Interaksi</Button>
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
