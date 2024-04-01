'use client'
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  useEffect(() => {
    const Userdata = localStorage.getItem('UserStore')
    const res = Userdata ? JSON.parse(Userdata) : null
    if (!Userdata) {
      return redirect('/Login')
    }
    return redirect(`/ListMentee/${res.Team}`)
  }, [])
}
