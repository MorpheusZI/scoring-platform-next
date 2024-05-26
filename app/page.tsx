'use client'
import { redirect } from "next/navigation";
import { useEffect, } from "react";

export default function Home() {
  useEffect(() => {
    const Userdata = localStorage.getItem('UserStore')
    const res = Userdata ? JSON.parse(Userdata) : null
    if (!Userdata) {
      return redirect('/Login')
    }
    return redirect(`/PreInteraksi/${res.username}`)
  }, [])
}
