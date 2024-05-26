'use server'
import { EditorTextandHTML, InteraksiContents } from '@/lib/types'
import { Document, Prisma, PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()

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
  return DocumentMade
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
export async function UpdateInterDocument(Document: InteraksiContents, manager: User, mentee: User, DocID: number) {
  const DocumentInterUpdated = await prisma.document.update({
    where: {
      DocID: DocID,
      memberID: mentee.UserID,
      managerID: manager.UserID,
    },
    data: {
      memberHTML: Document.Komitmen_Member_HTML,
      memberContent: Document.Komitmen_Member_Content,
      managerHTML: Document.Komitmen_Manager_HTML,
      managerContent: Document.Komitmen_Manager_Content,
      Summary: Document.Summary,
      created_at: new Date().toISOString(),
      Catatan: Document.Catatan,
    }
  })
}
export async function BikinInterDocument(Document: InteraksiContents, manager: User, mentee: User) {
  const DocumentInterUpdated = await prisma.document.create({
    data: {
      memberID: mentee.UserID,
      managerID: manager.UserID,
      memberHTML: Document.Komitmen_Member_HTML,
      memberContent: Document.Komitmen_Member_Content,
      managerHTML: Document.Komitmen_Manager_HTML,
      managerContent: Document.Komitmen_Manager_Content,
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


export async function getDocs(MenteeID: number, ManID: number) {
  const docs = await prisma.document.findMany({
    where: {
      memberID: MenteeID,
      managerID: ManID
    }
  })
  return docs
}
export async function getADocs(MenteeID: number) {
  const docz = await prisma.document.findMany({
    where: {
      memberID: MenteeID
    }
  })
  return docz
}
export async function getDocByDocID(DocID: number) {
  const doc = await prisma.document.findUnique({
    where: {
      DocID: DocID
    }
  })
  return doc
}
