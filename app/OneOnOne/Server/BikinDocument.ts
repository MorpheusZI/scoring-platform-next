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

export type MinteraksiContents = {
  memberHTML?: string,
  memberContent?: string,
  managerHTML?: string,
  managerContent?: string,
  Summary?: string,
  Catatan?: string,
}

export async function BikinDocument(Document: EditorTextandHTML, Uzer: User | undefined, manager: User | undefined) {
  const DocumentMade = await prisma.document.create({
    data: {
      memberID: Uzer?.UserID,
      managerID: manager?.UserID,
      memberHTML: Document.HTML,
      memberContent: Document.Content,
      created_at: new Date().toISOString(),
    }
  })
}

export async function UpdatePreDocument(Document: EditorTextandHTML, UserID: number | undefined, DocID: number) {
  const DocumentUpdated = await prisma.document.update({
    where: {
      DocID: DocID,
      memberID: UserID,
    },
    data: {
      memberHTML: Document.HTML,
      memberContent: Document.Content
    }
  })
  return DocumentUpdated
}
export async function UpdateInterDocument(Document: InteraksiContents, manager: User, mentee: User, DocID?: number) {
  const DocumentInterUpdated = await prisma.document.update({
    where: {
      DocID: DocID,
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
export async function BikinInterDocument(Document: MinteraksiContents, manager: User, mentee: User) {
  const DocumentInterUpdated = await prisma.document.create({
    data: {
      memberID: mentee.UserID,
      managerID: manager.UserID,
      memberHTML: Document.memberHTML,
      memberContent: Document.memberContent,
      managerHTML: Document.managerHTML,
      managerContent: Document.managerContent,
      Summary: Document.Summary,
      created_at: new Date().toISOString(),
      Catatan: Document.Catatan,
    }
  })
}
export async function AmbilPreDocument(UserID: number, manID: number) {
  const Document = await prisma.document.findFirst({
    where: {
      memberID: UserID,
      managerID: manID
    },
  })
  return Document
}
