'use server'
import { PositionEnum, Prisma, PrismaClient, TeamEnum, User } from '@prisma/client'
export interface response {
  user: User | null
  message?: string
}
const prisma = new PrismaClient()
export type UserServe = {
  username: string,
  password: string,
  email: string,
  Team: TeamEnum,
  Position: PositionEnum,
}

export const createUser = async (user: UserServe) => {
  const useres = await prisma.user.create({
    data: {
      username: user.username,
      password: user.password,
      email: user.email,
      Team: user.Team,
      Position: user.Position
    },
    include: {
      Documents: true
    }
  })

  return useres
}
