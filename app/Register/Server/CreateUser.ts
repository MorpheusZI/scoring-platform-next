'use server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export type UserServe = {
  username: string,
  password: string,
  email: string,
}

export const createUser = async (user: UserServe) => {
  const userRes = await prisma.user.create({
    data: {
      email: user.email,
      password: user.password,
      username: user.username,
    },
  })
  return userRes
}
