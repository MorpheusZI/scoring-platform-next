'use server'
import { Prisma, PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()

export const checkUser = async (emailp: string, passwordp: string) => {
  const useres = await prisma.user.findFirst({
    where: {
      email: emailp,
      password: passwordp
    },
    include: {
      Documents: true
    }
  })
  return useres
}
