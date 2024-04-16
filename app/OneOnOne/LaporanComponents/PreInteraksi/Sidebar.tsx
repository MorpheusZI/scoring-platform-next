import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableProperties, History } from "lucide-react";
import { KomitmenData } from "./Laporan";
import AiAssist from "./AIAssistant";

interface SideBarProps {
  KomitmenDataArr: KomitmenData[] | undefined
  KomitmenChange: boolean
}

export default function Sidebar({ KomitmenDataArr, KomitmenChange }: SideBarProps) {
  if (!KomitmenDataArr) return <p>loading</p>
  return (
    <Tabs className="flex w-full h-[85vh] justify-start bg-gray-200 overflow-y-auto" defaultValue="main">
      <TabsContent value="main" className="w-full h-fit ">
        <AiAssist KomitmenDataArr={KomitmenDataArr} KomitmenChange={KomitmenChange} />
      </TabsContent>
      <TabsList className="flex h-full flex-col p-3 gap-5 justify-start bg-gray-200 rounded-none" >
        <TabsTrigger value="main"><TableProperties /></TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

