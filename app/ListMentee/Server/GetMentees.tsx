'use server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient
export async function getMentees(manager: string | undefined) {
  if (!manager) return
  const Menteez = await prisma.user.findMany({
    where: {
      manager: manager
    },
    include: {
      Documents: true
    }
  })
  return Menteez
}
