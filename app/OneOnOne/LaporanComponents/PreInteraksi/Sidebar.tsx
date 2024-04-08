import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableProperties, History } from "lucide-react";
import { KomitmenData } from "./Laporan";

interface SideBarProps {
  KomitmenDataArr: KomitmenData[]
  KomitmenChange: boolean
}

export default function Sidebar({ KomitmenDataArr, KomitmenChange }: SideBarProps) {

  return (
    <Tabs className="flex w-full justify-start bg-gray-100 h-[90vh] overflow-y-auto" defaultValue="main">
      <TabsContent value="main" className="w-full h-fit ">
        <div className="flex w-full flex-col px-5 py-4 gap-5 ">
          <div className="sommary flex flex-col gap-3">
            <h1 className="text-lg ">Summary</h1>
          </div>
          <div className="aoutline flex flex-col gap-3">
            <h1 className="text-lg ">Outlines</h1>
          </div>
          <hr className="border-2 border-gray-300 rounded" />
          <div className="gaide flex flex-col gap-2">
            <h1 className="text-lg">Guide</h1>
          </div>
        </div>
      </TabsContent>
      <TabsList className="flex h-full flex-col p-3 justify-start bg-gray-200 gap-2">
        <TabsTrigger value="main"><TableProperties /></TabsTrigger>
        <TabsTrigger value="History"><History /></TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

