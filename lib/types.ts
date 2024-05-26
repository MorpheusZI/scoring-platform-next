import { User } from "@prisma/client";

export type LoadingState = "nill" | "Saved" | "Saving"

export interface SummaryReq {
  KomitmenAtasan: string | undefined;
  KomitmenBawahan: string | undefined;
  Catatan: string | undefined;
  NamaManager: string | undefined;
  NamaMentee: string | undefined;
}

export interface NestedObject {
  text: string;
  Kualitas: string;
  Komentar: string;
}

export type AiAssistProps = {
  KomitmenDataArr: KomitmenData[]
  KomitmenChange: boolean
}

export type AIResState = "null" | "err" | "loading" | "fullfilled"


export type InteraksiContents = {
  Komitmen_Member_HTML: string | undefined,
  Komitmen_Member_Content: string | undefined,
  Komitmen_Manager_Content: string | undefined,
  Komitmen_Manager_HTML: string | undefined,
  Catatan: string | undefined,
  Summary?: string
}

export interface AIResponse {
  Situasi: NestedObject;
  Tugas: NestedObject;
  Aksi: NestedObject;
  Hasil: NestedObject;
  Judul?: string;
}

export type LaporanProps = {
  handleKomitmenDatatoAI?: (KomDataArr: KomitmenData[] | undefined) => void
  User: User | null;
  FuncCaller?: boolean;
  UserUpdater?: () => void;
  handleSavingStatus?: (Status: LoadingState) => void
}

export type KomitmenData = {
  Judul: string | undefined;
  Isi: string | undefined;
};

export type EditorTextandHTML = {
  Content: string | undefined,
  HTML: string | undefined
}


export type LaporanRevProps = {
  User: User | null;
  CallSummary: boolean;
  CallSave: boolean | undefined;
  SummaryFunc: (SummaryRez: SummaryReq) => void
  SaveFunc: (Interaksi: InteraksiContents, SummaryReq: SummaryReq) => void
  CurrentDocID: number | undefined;
}

export type SideBarRevProps = {
  aiResp: string | undefined
  SummaryCall?: () => void;
  UpdateDocHistory: boolean | undefined
  User: User | undefined | null
  ChangeDocID?: (DocID: number | undefined) => void
  CurrentDocID?: number
}
export type returnCountKomitmen = { total: number, done: number }

