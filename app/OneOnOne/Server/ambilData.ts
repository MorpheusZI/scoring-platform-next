'use server'
import { PrismaClient } from '@prisma/client'
import { GenerateContentRequest, GenerativeModel, } from "@google-cloud/vertexai"
import { KomitmenData } from "../LaporanComponents/PreInteraksi/Laporan"
import { genModel } from "@/app/verser/vertexai"
const prisma = new PrismaClient()

type AiresBody = {
  AIres: string,
  AiresNum: number
}

type AIresArr = {
  AiResArr: AiresBody[] | null
}

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

export interface AIResponse {
  Situasi: NestedObject;
  Tugas: NestedObject;
  Aksi: NestedObject;
  Hasil: NestedObject;
  Judul?: string;
}

function parseAIResponse(response: string, judul: string | undefined): AIResponse {
  const mainKeys = ["Situasi", "Tugas", "Aksi", "Hasil"];
  const obj: AIResponse = {
    Situasi: { text: "", Kualitas: "", Komentar: "" },
    Tugas: { text: "", Kualitas: "", Komentar: "" },
    Aksi: { text: "", Kualitas: "", Komentar: "" },
    Hasil: { text: "", Kualitas: "", Komentar: "" },
    Judul: judul ? judul : '',
  };

  mainKeys.forEach((key) => {
    const regex = new RegExp(
      `${key}(?:\\s?:\\s?|[*]{0,2})["']([^"']*)["'].*?Persentasi Kualitas:\\s?([^%]+%)\\s?-*\\s?Komentar:\\s?["']([^"']+)["']`,
      "im"
    );
    const match = response.match(regex);
    if (match) {
      //@ts-ignore
      obj[key] = {
        text: match[1] || "",
        Kualitas: match[2],
        Komentar: match[3],
      };
    }
  });

  return obj;
}

export async function vertexAISummarizer({ KomitmenAtasan, KomitmenBawahan, Catatan, NamaMentee, NamaManager }: SummaryReq) {
  const summarryReq: GenerateContentRequest = {
    contents: [{ role: "user", parts: [{ text: `data:{KomitmenAtasan: ${KomitmenAtasan},KomitmenBawahan: ${KomitmenBawahan},Catatan: ${Catatan}, NamaAtasan: ${NamaManager},NamaKaryawan: ${NamaMentee}}. prompt = Dari hasil komitmen atasan, komitmen bawahan, dan catatan, buatkan summary hanya dalam 1 paragraf makismal 5 Kalimat. Notes: Catatan dimiliki oleh Atasan` }] }]
  }
  const vresponseStream = await genModel.generateContentStream(summarryReq)
  const response = await vresponseStream.response

  const fulltextResponse = response.candidates[0].content.parts[0].text
  return fulltextResponse

}

async function vertexAIStarChecker({ Judul, Isi }: KomitmenData) {
  const vrequest: GenerateContentRequest = {
    contents: [{ role: "user", parts: [{ text: `data:{ Judul: '${Judul}', Isi: '${Isi}' }. Kriteria:{ 1: Situasi, 2: Tugas, 3:Aksi, 4:Hasil}. prompt: 'Evaluasi persentase kualitas pemenuhan setiap kriteria dalam kalimat-kalimat dari data.' jawaban tidak boleh memiliki asterisks atau spesial karakter lain, hanya quotes,strip dan % yang diperbolehkan harus menjawab dengan mengikuti template berikut: '{Kriteria}: {text lengkap dari Isi yang memenuhi Kriteria !!DENGAN QUOTES!!} -Persentasi Kualitas: {nomor persentase dengan %} -Komentar:{alasan Persentasi tersebut dengan ringkas dan harus pakai quotes}...' ` },] }]
  }

  const vresponseStream = await genModel.generateContent(vrequest)
  const responseText = await vresponseStream.response

  const fulltextResponse = responseText.candidates[0].content.parts[0].text
  const cobaObj = fulltextResponse ? parseAIResponse(fulltextResponse, Judul) : null;
  console.log("\n\n\n", fulltextResponse, "anjing")

  return cobaObj;
}

export async function testingdata(KomitmenDataArr: KomitmenData[]) {
  const promises = KomitmenDataArr.map(async (KomitmenData, index) => {
    const airestext = await vertexAIStarChecker(KomitmenData);
    if (airestext) {
      return airestext
    }
    return null;
  });

  const results = await Promise.all(promises);

  const filteredResults = results.filter(result => result !== null);
  console.log(filteredResults, "aduhh")

  return filteredResults
}

export async function getManagers() {
  const managers = await prisma.user.findMany()
  return managers
}

export async function updateUserManager(userEmail: string, managerP: string) {
  const userUpdated = await prisma.user.update({
    where: {
      email: userEmail,
    },
    data: {
      manager: managerP
    }
  })
  return userUpdated
}
