'use client'
import { Button } from "@/components/ui/button"
import { User } from "@prisma/client"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function ListMentee({ params }: { params: { Team: string } }) {
  const [UserData, setUserData] = useState<User | null>(null)
  useEffect(() => {
    const Userdata = localStorage.getItem('UserStore')
    const res = setUserData(Userdata ? JSON.parse(Userdata) : null)
    if (!Userdata) {
      return redirect('/Login')
    }
    if (UserData?.Position === 'AnggotaTim') {
      return redirect('/Login')
    }
  }, [])
  return (
    <div className="flex flex-col">
      <div className="heder flex w-full items-center justify-between py-5 px-10 border-b border-b-black ">
        <div className="flex flex-col">
          <p className="text-3xl font-semibold">List Anggota</p>
          <p>Tim: {UserData?.Team}</p>
        </div>
        <Button>Keluar</Button>
      </div>
    </div>
  )
}
