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
  return redirect("/Login")
}
