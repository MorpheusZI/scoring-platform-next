'use server'
import { GenerateContentRequest, GenerativeModel, } from "@google-cloud/vertexai"
import { KomitmenData } from "../LaporanComponents/Laporan"
import { genModel } from "@/app/verser/vertexai"

type AiresBody = {
  AIres: string,
  AiresNum: number
}

type AIresArr = {
  AiResArr: AiresBody[] | null
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
  Judul: string;
}

function parseAIResponse(response: string, judul: string): AIResponse {
  const mainKeys = ["Situasi", "Tugas", "Aksi", "Hasil"];
  const obj: AIResponse = {
    Situasi: { text: "", Kualitas: "", Komentar: "" },
    Tugas: { text: "", Kualitas: "", Komentar: "" },
    Aksi: { text: "", Kualitas: "", Komentar: "" },
    Hasil: { text: "", Kualitas: "", Komentar: "" },
    Judul: judul,
  };

  mainKeys.forEach((key) => {
    const regex = new RegExp(`${key}\\s?:\\s?["']([^"']*)["'].*?Persentasi Kualitas:\\s?([^%]+%)\\s?-*\\s?Komentar:\\s?["']([^"']+)["']`, "i");
    const match = response.match(regex);
    if (match) {
      // @ts-ignore
      obj[key] = {
        text: match[1] || "",
        Kualitas: match[2],
        Komentar: match[3],
      };
    }
  });

  return obj;
}

async function vertexAIStarChecker({ Judul, Isi }: KomitmenData) {
  const vrequest: GenerateContentRequest = {
    contents: [{ role: "user", parts: [{ text: `data:{ Judul: '${Judul}', Isi: '${Isi}' }. Kriteria:{ 1: Situasi, 2: Tugas, 3:Aksi, 4:Hasil}. prompt: 'Evaluasi persentase kualitas pemenuhan setiap kriteria dalam kalimat-kalimat dari data.' jawab dengan mengikuti template berikut: '{Kriteria}: {text lengkap dari Isi yang memenuhi Kriteria !!DENGAN QUOTES!!} -Persentasi Kualitas: {nomor persentase dengan %} -Komentar:{alasan Persentasi tersebut dengan ringkas dan harus pakai quotes}...' Jangan Memakai asterisks ` },] }]
  }

  const vresponseStream = await genModel.generateContentStream(vrequest)
  const responseText = await vresponseStream.response

  const fulltextResponse = responseText.candidates[0].content.parts[0].text
  const cobaObj = fulltextResponse ? parseAIResponse(fulltextResponse, Judul) : null;

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

  return filteredResults
}


