'use server'
import { GC_Credentials } from "@/app/verser/vertexai";
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from "google-auth-library";

export type ExcelData = {
  member?: string,
  manager?: string,
  created_at?: Date,
  summary?: string,
  komitmen_member?: string | null,
  komitmen_atasan?: string,
}

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
]
const jwt = new JWT({
  email: process.env.GC_SA_CLIENT_EMAIL,
  key: process.env.GC_SA_PRIVATE_KEY,
  scopes: SCOPES
});
const docid = "1gSfRYEM_RmQc33KsVWmWNA1NsaHDgnSGKTqdHDVwMis"

export async function WriteToExcel(ExcelData: ExcelData) {
  if (!jwt) return
  if (!ExcelData.member) return
  if (!ExcelData.manager) return
  if (!ExcelData.summary) return
  if (!ExcelData.komitmen_atasan) return
  if (!ExcelData.komitmen_member) return
  const doc = new GoogleSpreadsheet(docid, jwt)
  await doc.loadInfo()

  const sheet = doc.sheetsByIndex[1]
  const rows = await sheet.getRows()
  const addedRow = await sheet.addRow({
    user: ExcelData.member,
    manager: ExcelData.manager,
    created_at: new Date(),
    summary: ExcelData.summary,
    komitmen_member: ExcelData.komitmen_member,
    komitmen_atasan: ExcelData.komitmen_atasan,
  })
  return addedRow.rowNumber.toString
}

