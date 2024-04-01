'use server'
import { Document, Prisma, PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()

export type DocumentServe = {
  DocumentID: string,
  updated_at: Date,
  created_at: Date,
  OwnerUserID: number | null,
}

type BikinDocument = {
  Document: DocumentServe,
  UserID: number;
}


export async function BikinDocument({ Document, UserID }: BikinDocument) {
  try {
    const res = await prisma.document.create({
      data: {
        DocumentID: Document.DocumentID,
        updated_at: Document.updated_at,
        created_at: Document.created_at,
        OwnerUserID: UserID,
      }
    })
    return res
  } catch (error) {
    return "error cuy"
  }
}

export async function AmbilDocument(UserID: number) {
  try {
    const res = await prisma.document.findFirst({
      where: {
        OwnerUserID: UserID
      }
    })
  } catch (error) {

  }
}
