'use server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient

export async function getMentees(managerz: string | undefined) {
  if (!managerz) return
  const Menteez = await prisma.user.findMany({
    where: {
      manager: managerz
    },
  })
  return Menteez
}

export async function getAllUsers() {
  const Users = await prisma.user.findMany()
  return Users
}

export async function getDocs(MenteeID: number, ManID: number) {
  const docs = await prisma.document.findMany({
    where: {
      memberID: MenteeID,
      managerID: ManID
    }
  })
  return docs
}
export async function getDocByDocID(DocID: number) {
  const doc = await prisma.document.findUnique({
    where: {
      DocID: DocID
    }
  })
  return doc
}
