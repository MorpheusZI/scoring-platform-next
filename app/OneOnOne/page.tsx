'use client'
import { useState } from 'react'
import HeadingOneOnOne from '../Rcomponents/LaporanComponents/HeadingOOO'
import Laporan from '../Rcomponents/LaporanComponents/Laporan';
import Sidebar from '../Rcomponents/LaporanComponents/SideBar';

export default function Home() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [clickedHeader, setClickedHeader] = useState<string>()

  const updateHeaders = (newHeaders: string[]) => {
    setHeaders(newHeaders);
  };

  const updateClickedHeader = (cHeader: string) => {
    setClickedHeader(cHeader)
  }

  return (
    <div className="flex flex-col h-[100vh] overflow-hidden">
      <HeadingOneOnOne />
      <div className="flex">
        <div className="w-[70%] border-r-2 border-r-black h-[100vh] overflow-y-scroll ">
          <Laporan onUpdateHeaders={updateHeaders} clickedHeader={clickedHeader} />
        </div>
        <div className="w-[30%] border-r-2 border-r-black">
          <Sidebar Outlines={headers} clickedOutline={updateClickedHeader} />
        </div>
      </div>
    </div>
  );
}
