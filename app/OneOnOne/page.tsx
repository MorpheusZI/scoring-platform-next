'use client'
import ShortUniqueId from 'short-unique-id'
import { useState, useEffect } from 'react'
import { Document, User } from '@prisma/client'
import { redirect } from 'next/navigation'

export interface UserData {
  User: User,
  Documents: Document[]
}

export default function Home() {
  const [DocUID, setDocUID] = useState<string | null>(null)
  const [UserData, setUserData] = useState<UserData | null>()
  useEffect(() => {
    // const Userdata = localStorage.getItem('UserStore')
    // const res = setUserData(Userdata ? JSON.parse(Userdata) : null)
    // if (!Userdata) {
    //   return redirect('/Login')
    // }
    //
    // if (UserData && UserData?.Documents.length > 0) {
    //   const Docres = AmbilDocument(UserData.User.UserID).then()
    // } else if (UserData && UserData?.Documents.length === 0) {
    //   console.log("hi")
    // }
  }, [])
  return <p></p>
}
