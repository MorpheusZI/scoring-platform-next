'use client'
import { Button } from "@/components/ui/button"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { getAllUsers, getDocs, getMentees } from "./Server/GetMentees"
import { Prisma, User } from "@prisma/client"
import { ChevronDown, CircleUserRound, Ellipsis, Loader2, LogOut, Search, UserRoundX, UsersRound, X } from "lucide-react"
import Link from "next/link"
import { Select, SelectGroup, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Mentee extends User {
  ready?: boolean
}

export default function ListMentee() {
  const [UserData, setUserData] = useState<User | null>(null)
  const [MenteeLists, setMenteeLists] = useState<User[] | undefined>([])
  const [NewMenteeLists, setNewMenteeLists] = useState<Mentee[] | undefined>([])
  const [AllUsers, setAllUsers] = useState<User[] | undefined>()
  const [SearchTerm, setSearchTerm] = useState("")
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
    if (UserData.email === "super@hr.com") {
      console.log("lah")
      setLoadingList(false)
      getAllUsers().then((Uzers) => {
        setLoadingList(true)
        setAllUsers(Uzers)
        console.log(AllUsers)
      })
    } else {
      console.log("goblog")
      setLoadingList(false)
      getMentees(UserData.email).then((R) => {
        setMenteeLists(R)
        console.log(R, "hello")
        setLoadingList(true)
      })

    }
    //@ts-ignore
  }, [UserData])
  useEffect(() => {
    console.log(MenteeLists)

    return
  }, [MenteeLists])

  const renderComp = useMemo(() => {
    if (!UserData) return
    if (!MenteeLists) return
    if (UserData.email === "super@hr.com") {
      console.log(UserData.email)
      const FilteredUsers = AllUsers?.filter((User) =>
        User.email !== "super@hr.com" &&
        User.username.toLowerCase().includes(SearchTerm.toLowerCase()))
      return FilteredUsers?.map((Uzer, index) => (
        <div key={index} className="grid items-center w-full grid-cols-3 py-2 px-5 gap-1 border-2 border-black">
          <p className="col-span-2">{Uzer.username}</p>
          <Button className="w-fit" onClick={() => handleMulaiInteraksi(Uzer)}>Mulai Interaksi</Button>
        </div>
      ))
    } else {
      console.log("hello")
      const FilteredMentees = MenteeLists?.filter((Mentee) =>
        Mentee.username.toLowerCase().includes(SearchTerm.toLowerCase()))
      return FilteredMentees.map((Mentee, index) => {
        return <div key={index} className="grid items-center w-full grid-cols-3 py-2 px-5 gap-1 border-2 border-black">
          <p className="col-span-2">{Mentee.username}</p>
          <Button className="w-fit" onClick={() => handleMulaiInteraksi(Mentee)}>Mulai Interaksi</Button>
        </div>
      })
    }
  }, [SearchTerm, UserData, MenteeLists, AllUsers])

  return (
    <div className="flex flex-col">
      <div className="heder flex w-full items-center justify-between py-5 px-10 border-b border-b-black ">
        <p className="text-3xl font-semibold">List Anggota</p>
        <div className="flex items-center gap-4">
          <CircleUserRound className=" w-8 h-8" />
          <p>Hello! {UserData?.username}</p>
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
      <div className="flex w-full px-10 py-5 flex-col justify-center items-center">
        <div className="flex w-full flex-col rounded-xl border-2-black">
          <div className="grid w-full items-center grid-cols-3 py-2 px-5 text-xl rounded-t-xl border-2 border-black ">
            <div className="flex gap-5 items-center col-span-2">
              <p>Nama Member</p>
              <Popover>
                <PopoverTrigger>
                  <div className="flex gap-3 p-2 bg-black rounded-lg hover:bg-primary/90">
                    <Search className="text-white" />
                  </div>
                </PopoverTrigger>
                <PopoverContent side="right">
                  <div className="flex items-center gap-3 px-1">
                    <X className="text-red-500 hover:cursor-pointer" onClick={() => {
                      setSearchTerm("")
                    }} />
                    <input onChange={(e) => {
                      setSearchTerm(e.target.value)
                    }} value={SearchTerm} className="p-2 pl-0 outline-none" placeholder="Cari Anggota..." />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <p className="col-span-1">Action</p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto border-b-2 border-b-black rounded-b-lg" >
            {renderComp}
          </div>
        </div>
      </div>
    </div>
  )
}
