'use server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUser(UserID: number) {
  const User = await prisma.user.findUnique({
    where: {
      UserID: UserID
    }
  })
  return User
}

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

export async function updateUserManager(userEmail: string, managerP: string) {
  const userUpdated = await prisma.user.update({
    where: {
      email: userEmail,
    },
    data: {
      manager: managerP
    }
  })
  return userUpdated
}

