'use server'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from "google-auth-library";

export type ExcelData = {
  user?: string,
  manager?: string,
  created_at?: Date,
  summary?: string,
  komitmen_member?: string | null,
  komitmen_atasan?: string,
  Jumlah_Komitmen: number
  Jumlah_Komitmen_Selesai?: number
}
interface ExcelRows extends ExcelData {
  Jumlah_Semua_Session: number
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
  if (!ExcelData) return

  const doc = new GoogleSpreadsheet(docid, jwt)
  await doc.loadInfo()

  const sheet = doc.sheetsByIndex[1]
  const rows = await sheet.getRows<ExcelRows>()

  const filteredRows = rows.filter((row, indx) => row.get('user') === ExcelData.user && row.get('manager') === ExcelData.manager).map((row) => row.toObject())
  const LastRow = filteredRows[filteredRows.length - 1]
  if (LastRow) {
    const Jumlah_Semua_Session = LastRow.Jumlah_Semua_Session ? LastRow.Jumlah_Semua_Session : ExcelData.Jumlah_Komitmen
    const All_Session = parseInt(Jumlah_Semua_Session.toString()) + parseInt(ExcelData.Jumlah_Komitmen.toString())
    const addedRow = await sheet.addRow({
      user: ExcelData.user || "",
      manager: ExcelData.manager || "",
      created_at: new Date(),
      summary: ExcelData.summary || "",
      komitmen_member: ExcelData.komitmen_member || "",
      komitmen_atasan: ExcelData.komitmen_atasan || "",
      Jumlah_Komitmen_Selesai: ExcelData.Jumlah_Komitmen_Selesai || 0,
      Jumlah_Komitmen: ExcelData.Jumlah_Komitmen || 0,
      Jumlah_Semua_Session: All_Session
    })
  } else {
    const addedRow = await sheet.addRow({
      user: ExcelData.user || "",
      manager: ExcelData.manager || "",
      created_at: new Date(),
      summary: ExcelData.summary || "",
      komitmen_member: ExcelData.komitmen_member || "",
      komitmen_atasan: ExcelData.komitmen_atasan || "",
      Jumlah_Komitmen_Selesai: ExcelData.Jumlah_Komitmen_Selesai || 0,
      Jumlah_Komitmen: ExcelData.Jumlah_Komitmen || 0,
      Jumlah_Semua_Session: ExcelData.Jumlah_Komitmen || 0
    })
  }

}
