'use server'
import { GC_Credentials } from "@/app/verser/vertexai";
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from "google-auth-library";

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
]
const jwt = new JWT({
  email: process.env.GC_SA_CLIENT_EMAIL,
  key: process.env.GC_SA_PRIVATE_KEY,
  scopes: SCOPES
});
const docid = "1gSfRYEM_RmQc33KsVWmWNA1NsaHDgnSGKTqdHDVwMis"

export async function WriteToExcel() {
  if (!jwt) return
  const doc = new GoogleSpreadsheet(docid, jwt)
  await doc.loadInfo()
}

