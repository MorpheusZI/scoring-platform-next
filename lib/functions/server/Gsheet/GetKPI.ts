"use server"
import { User } from "@prisma/client";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
]
const jwt = new JWT({
  email: process.env.GC_SA_CLIENT_EMAIL,
  key: process.env.GC_SA_PRIVATE_KEY,
  scopes: SCOPES
});
type KPIRows = {
  Name: string;
  Metric: string;
  Value: string;
  Target: string;
  Achievement?: string;
}

export type MetricObject = {
  Metric: string;
  Value: string;
  Target: string;
  Achievement: string;
}

const docid = "1bzk0xONr9Cw7vFn-eXzQEkI4fNziV5I8Ta6uBWdaUhg"

export async function GetKPI(Mentee?: string) {
  if (!Mentee) return
  const menteeName: string = Mentee.substring(0, 4)
  const doc = new GoogleSpreadsheet(docid, jwt)
  await doc.loadInfo()

  const sheet = doc.sheetsByIndex[0]
  const rows = await sheet.getRows<KPIRows>()

  const filteredRows = rows.filter((r) => {
    const name: string = r.get("Name")
    return name.toLowerCase().includes(menteeName.toLowerCase())
  })
  const Rowz = filteredRows.map((row) => {
    const MetricObj: MetricObject = {
      Metric: row.get("Metric"),
      Value: row.get("Value"),
      Target: row.get("Target"),
      Achievement: row.get("Achievement"),
    }
    return MetricObj
  })

  return Rowz
}

