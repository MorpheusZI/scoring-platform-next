'use server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient
export async function getMentees(managerz: string | undefined) {
  if (!managerz) return
  const Menteez = await prisma.user.findMany({
    where: {
      manager: managerz
    },
    include: {
      Documents: true
    }
  })
  return Menteez
}
