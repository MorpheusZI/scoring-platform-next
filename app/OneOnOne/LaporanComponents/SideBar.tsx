import AiAssist from "./AIAssistant";
import { KomitmenData } from '../LaporanComponents/Laporan'
import { useEffect, useState } from "react";
export type SideBarProps = {
  KomitmenDataArr: KomitmenData[]
  KomitmenChange: boolean
}

export default function Sidebar({ KomitmenDataArr, KomitmenChange }: SideBarProps) {

  return (
    <div className="flex h-[90vh] overflow-y-scroll w-full flex-col px-5 py-4 gap-5 bg-gray-100">
      <div className="aoutline flex flex-col gap-3">
        <h1 className="text-lg ">Outlines</h1>
      </div>
      <hr className="border-2 border-gray-300 rounded" />
      <AiAssist KomitmenDataArr={KomitmenDataArr} KomitmenChange={KomitmenChange} />
    </div>
  )
}
