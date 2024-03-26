'use client'
import { useState, useEffect } from 'react'
import HeadingOneOnOne from './LaporanComponents/HeadingOOO'
import Sidebar from './LaporanComponents/SideBar'
import Laporan, { KomitmenData } from './LaporanComponents/Laporan'
export default function Home() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [clickedHeader, setClickedHeader] = useState<string>()
  const [KomitmenDatArr, setKomitmenDataArr] = useState<KomitmenData[]>([])
  const [KomitmenChange, setKomitmenChange] = useState<boolean>(false)
  useEffect(() => {
    setKomitmenChange(!KomitmenChange)
  }, [])
  const handleKomitmenData = (KomDataArr: KomitmenData[]) => {
    console.log(KomDataArr, "ini dari page")
    setKomitmenDataArr(KomDataArr)
    setKomitmenChange(!KomitmenChange)
  };


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
        <div className="w-[70%] border-r-2 border-r-black h-[85vh] overflow-y-scroll ">
          <Laporan handleKomitmenDatatoAI={handleKomitmenData} />
        </div>
        <div className="w-[30%] border-r-2 border-r-black">
          <Sidebar KomitmenChange={KomitmenChange} KomitmenDataArr={KomitmenDatArr} />
        </div>
      </div>
    </div>
  );
}
