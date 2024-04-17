'use server'
import { Document, Prisma, PrismaClient, User, DocumentType } from '@prisma/client'
const prisma = new PrismaClient()

type EditorTextandHTML = {
  Content: string | undefined,
  HTML: string | undefined
}

export async function BikinDocument(Document: EditorTextandHTML, UserID: number | undefined, Doctype: DocumentType) {
  const DocumentMade = await prisma.document.create({
    data: {
      DocContent: Document.Content,
      DocHTML: Document.HTML,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      DocType: Doctype,
      OwnerUserID: UserID,
    }
  })
  console.log(JSON.parse(JSON.stringify(DocumentMade)))
  return DocumentMade
}

export async function AmbilPreDocument(UserID: number) {
  const Document = await prisma.document.findMany({
    where: {
      OwnerUserID: UserID,
      DocType: "KomitmenBawahan"
    },
    include: {
      user: true
    }
  })
  return Document[Document.length - 1]
}
