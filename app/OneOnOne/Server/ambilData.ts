'use server'
import { PrismaClient } from '@prisma/client'
import { GenerateContentRequest, GenerativeModel, } from "@google-cloud/vertexai"
import { KomitmenData } from "../LaporanComponents/PreInteraksi/Laporan"
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { genModel } from "@/app/verser/vertexai"
import { model } from '@/app/verser/GoogleAI'
const prisma = new PrismaClient()

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

function parseAIResponse(response: string, judul: string = ""): AIResponse {
  const mainKeys: (keyof AIResponse)[] = ["Situasi", "Tugas", "Aksi", "Hasil"];
  const obj: AIResponse = {
    Situasi: { text: "", Kualitas: "", Komentar: "" },
    Tugas: { text: "", Kualitas: "", Komentar: "" },
    Aksi: { text: "", Kualitas: "", Komentar: "" },
    Hasil: { text: "", Kualitas: "", Komentar: "" },
    Judul: judul,
  };

  mainKeys.forEach((key, index) => {
    const nextLimit = index === 3 ? "" : `.*? ${mainKeys[index + 1]}`;
    const regexText = new RegExp(`.*?${key}:.*?\\s*["']([^"']*)["']`, "s");
    const regexKualitas = new RegExp(`.*?${key}:.*?Status:\\s*["']([^"']*)["']`, "s");
    const regexDeskripsi = new RegExp(`.*?${key}:.*?Deskripsi:\\s*["']([^"']*)["']`, "s");

    if (key !== "Judul") {
      const matchText = regexText.exec(response);
      const matchKualitas = regexKualitas.exec(response);
      const matchDeskripsi = regexDeskripsi.exec(response);
      obj[key] = {
        text: matchText ? matchText[1] : "",
        Kualitas: matchKualitas ? matchKualitas[1] : "",
        Komentar: matchDeskripsi ? matchDeskripsi[1] : ""
      };
    }
  });
  return obj;
}
export async function vertexAISummarizer({ KomitmenAtasan, KomitmenBawahan, Catatan, NamaMentee, NamaManager }: SummaryReq) {
  const summarryReq: GenerateContentRequest = {
    contents: [{ role: "user", parts: [{ text: `data:{KomitmenManager: ${KomitmenAtasan},KomitmenKaryawan: ${KomitmenBawahan},Catatan: ${Catatan}, NamaAtasan: ${NamaManager},NamaKaryawan: ${NamaMentee}}. prompt = Dari hasil komitmen atasan, komitmen bawahan, dan catatan, buatkan summary hanya dalam 1 paragraf makismal 5 Kalimat. Notes: Catatan dimiliki oleh Atasan` }] }]
  }
  const vresponseStream = await genModel.generateContentStream(summarryReq)
  const response = await vresponseStream.response

  const fulltextResponse = response.candidates[0].content.parts[0].text
  return fulltextResponse

}

async function vertexAIStarChecker({ Judul, Isi }: KomitmenData) {
  const generationConfig = {
    temperature: 1,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
    { text: "Anda adalah AI Assistant untuk mengevaluasi inputan komitmen karyawan dan memberi saran perbaikan yang konsisten.\nEvaluasi pemenuhan status (Lengkap / Belum Lengkap / Tidak Ada) pada STAR (Situation, Task, Action, Result) dari inputan komitmen. Jangan sertakan karakter lain (seperti '*', dan lainnya) selain yang ada di prompt.\n\nJawab Dengan mengikuti template seperti berikut: \n{Kriteria} : \"{Kalimat dari isi input yang memenuhi Kriteria}\".  Status: { Status dari pemenuhan Kriteria tersebut (\"Lengkap\" | \"Belum Lengkap\" | \"Tidak Ada\") }. Deskripsi: \" {Deskripsi mengapa anda beri Status tersebut} \"" },
    { text: "input: Mempelajari Vertex AI\n\nSaya melakukan komitmen ini dengan mengakses course dari Google. Hasilnya adalah saya mendapat knowledge baru dalam pengembangan product ke depan, yaitu memanfaatkan AI dalam proses. Saya merasa senang karena bisa mempelajari AI, sesuatu yang saya awalnya rasa ini sulit, ternyata bisa dipelajari. Saya merasa senang karena bisa mempelajari AI, sesuatu yang saya awalnya rasa ini sulit, ternyata bisa dipelajari." },
    { text: "output: Situasi: \"Saya melakukan komitmen ini dengan mengakses course dari Google.\"\nStatus: \"Lengkap\"\nDeskripsi: \"Situasinya dijelaskan dengan jelas dan memadai.\"\nSaran Perbaikan: \"{}\"\n\nTugas: \"Hasilnya adalah saya mendapat knowledge baru dalam pengembangan product ke depan, yaitu memanfaatkan AI dalam proses.\"\nStatus: \"Lengkap\"\nDeskripsi: \"Tugas yang ingin dicapai diuraikan dengan baik.\"\nSaran Perbaikan: \"{}\"\n\nAksi: \"Saya merasa senang karena bisa mempelajari AI, sesuatu yang saya awalnya rasa ini sulit, ternyata bisa dipelajari.\"\nStatus: \"Belum Lengkap\"\nDeskripsi: \"Meskipun menunjukkan keberhasilan, tetapi lebih baik jika lebih konkret tentang langkah-langkah yang diambil dalam kursus tersebut.\"\nSaran Perbaikan: \"{}\"\n\nHasil: \"Saya merasa senang karena bisa mempelajari AI, sesuatu yang saya awalnya rasa ini sulit, ternyata bisa dipelajari.\"\nStatus: \"Belum Lengkap\"\nDeskripsi: \"Meskipun menyatakan kepuasan, hasil konkret dari pembelajaran (misalnya proyek yang berhasil diselesaikan) akan membuatnya lebih kuat.\"\nSaran Perbaikan: \"{}\"" },
    { text: `input: ${Judul}\n${Isi}` },
    { text: "output: " },
  ];

  const genAIRes = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig, safetySettings
  })

  const AIResponse = await genAIRes.response
  const AIResponseText = AIResponse.text()
  const cobaObj = AIResponseText ? parseAIResponse(AIResponseText, Judul) : null;
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
