'use server'
import { Document, Prisma, PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()

type EditorTextandHTML = {
  Content: string | undefined,
  HTML: string | undefined
}

export type InteraksiContents = {
  Komitmen_Manager_Content: string | undefined,
  Komitmen_Manager_HTML: string | undefined,
  Catatan: string | undefined,
  Summary?: string
}

export async function BikinDocument(Document: EditorTextandHTML, Uzer: User | undefined, manager: User | undefined) {
  console.log("\n\n", Document, Uzer, manager)
  const DocumentMade = await prisma.document.create({
    data: {
      memberID: Uzer?.UserID,
      managerID: manager?.UserID,
      memberHTML: Document.HTML,
      memberContent: Document.Content,
      created_at: new Date().toISOString(),
    }
  })
  return DocumentMade
}

export async function UpdatePreDocument(Document: EditorTextandHTML, UserID: number | undefined) {
  const DocumentUpdated = await prisma.document.update({
    where: {
      memberID: UserID,
    },
    data: {
      memberHTML: Document.HTML,
      memberContent: Document.Content
    }
  })
  return DocumentUpdated
}
export async function UpdateInterDocument(Document: InteraksiContents, manager: User, mentee: User) {
  const DocumentInterUpdated = await prisma.document.update({
    where: {
      memberID: mentee.UserID,
      managerID: manager.UserID,
    },
    data: {
      managerHTML: Document.Komitmen_Manager_HTML,
      managerContent: Document.Komitmen_Manager_Content,
      Summary: Document.Summary,
      created_at: new Date().toISOString(),
      Catatan: Document.Catatan,
    }
  })
}

export async function AmbilPreDocument(UserID: number, manID: number) {
  const Document = await prisma.document.findUnique({
    where: {
      memberID: UserID,
      managerID: manID
    },
  })
  return Document
}
