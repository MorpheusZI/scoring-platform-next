import Link from "next/link";

export default function HeadingOneOnOne() {
  return (
    <div className="flex w-full justify-between items-center px-7 py-5 border-b-2 border-black">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Laporan 1on1</h1>
        <p className="text-sm">Project IDP Product Designer</p>
      </div>
      <Link href="/" replace={true}>
        Simpan Penilaian
      </Link>
    </div>
  )
}
