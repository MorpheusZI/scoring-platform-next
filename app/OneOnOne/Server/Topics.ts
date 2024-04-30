export type SubtopicGuide = {
  SubtopicGuide: string
}
type SubTopic = {
  SubTopicTitle: string
  Guides: SubtopicGuide[]
}

export const Subtopics: SubTopic[] = [
  // {
  //   SubTopicTitle: "Progress KPI & OKR",
  //   Guides: [
  //     { SubtopicGuide: "Bagaimana progress OKR kamu sampai saat ini?" },
  //     { SubtopicGuide: "Ada progress ke arah lebih baik dari diskusi kita sebelumnya?" },
  //     { SubtopicGuide: "Ada issue yang harus saya ketahui?" },
  //     { SubtopicGuide: "Apakah ada challenge yang membuat kamu going slowly atau harus tertunda" },
  //     { SubtopicGuide: "Critical capabilities apa yang kamu butuhkan untuk mencapai OKR kamu?" },
  //   ]
  // },
  // {
  //   SubTopicTitle: "Support yang dibutuhkan",
  //   Guides: [
  //     { SubtopicGuide: "Solusi jangka pendek apa yang kamu rencanakan?" },
  //     { SubtopicGuide: "Problem terbesar apa yang kita hadapi sekarang?" },
  //     { SubtopicGuide: "Support apa yang kamu butuhkan dalam rencana ini" },
  //     { SubtopicGuide: "Apa yang menjadi fokus kerja kamu selama 2 minggu kedepan?" },
  //   ]
  // },
  // {
  //   SubTopicTitle: "Recognition / Penghargaan",
  //   Guides: [
  //     { SubtopicGuide: "Saya lihat kamu agak struggle dalam hal X, bagaimana menurut kamu" },
  //     { SubtopicGuide: "Saya appreciate initiative kamu dalam project X" },
  //     { SubtopicGuide: "What works and what doesn’t work?" },
  //   ]
  // },
  // {
  //   SubTopicTitle: "Adjustment KPI & OKR",
  //   Guides: [
  //     { SubtopicGuide: "Apakah ada OKR yang perlu kita revisi kembali dari hasil diskusi hari ini?" },
  //   ]
  // },
  // {
  //   SubTopicTitle: "Relationship",
  //   Guides: [
  //     { SubtopicGuide: "Ada hal atau ketidakcocokan dari cara kita bekerja bersama selama ini?" },
  //     { SubtopicGuide: "Apakah perlu kita adakan conversation lain selain 1-on-1?" },
  //   ]
  // },
  // {
  //   SubTopicTitle: "Personal Development",
  //   Guides: [
  //     { SubtopicGuide: "Kegiatan apa yang biasa dilakukan dalam waktu luang?" },
  //     { SubtopicGuide: "Dari skala 1 sampai 10, dimana 1 yang paling unhappy dan 10 yang paling happy, seberapa happy kamu bekerja disini" },
  //     { SubtopicGuide: "Ada ketertarikan untuk mengeksplor keahlian lain?" },
  //   ]
  // },
  {
    SubTopicTitle: "Pembuka",
    Guides: [
      { SubtopicGuide: "Bagaimana kabarmu hari ini?" },
      { SubtopicGuide: "Apa yang ingin kamu capai dalam 6 bulan ke depan?" },
      { SubtopicGuide: "Apa yang paling kamu sukai dari pekerjaanmu saat ini?" },
      { SubtopicGuide: "Apa yang ingin kamu pelajari lebih lanjut?" },
      { SubtopicGuide: "Apa yang membuatmu termotivasi?" },
      { SubtopicGuide: "Apa tantangan terbesar yang kamu hadapi?" },
      { SubtopicGuide: "Bagaimana saya dapat membantu kamu mencapai tujuanmu?" },
    ]
  },
  {
    SubTopicTitle: "Menggali Aspirasi",
    Guides: [
      { SubtopicGuide: "Apa yang ingin kamu capai dalam 5 tahun ke depan?" },
      { SubtopicGuide: "Apa mimpi karirmu?" },
      { SubtopicGuide: "Apa yang ingin kamu capai di luar pekerjaan?" },
      { SubtopicGuide: "Apa yang kamu sukai dan tidak sukai dari pekerjaanmu saat ini?" },
      { SubtopicGuide: "Apa yang membuatmu merasa puas dalam pekerjaan?" },
      { SubtopicGuide: "Apa yang ingin kamu ubah dari pekerjaanmu saat ini?" },
      { SubtopicGuide: "Apa yang kamu butuhkan dari saya untuk membantu kamu mencapai tujuanmu?" },
    ]
  },
  {
    SubTopicTitle: "Membangun hubungan",
    Guides: [
      { SubtopicGuide: "Apa yang kamu sukai dari bekerja di tim ini?" }
    ]
  }
]
