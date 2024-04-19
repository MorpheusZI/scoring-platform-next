import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableProperties, History } from "lucide-react";
import { KomitmenData } from "./Laporan";
import AiAssist from "./AIAssistant";
import { Select, SelectContent, SelectGroup, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Subtopics } from "../../Server/Topics"

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
        <div className="flex flex-col gap-5 px-7 py-3 border-l-2 border-gray-400 ">
          <h1>Overview Topik</h1>
          <div className="w-fit">
            <Select disabled>
              <SelectTrigger className="gap-5">
                <SelectValue placeholder="Regular 1on1" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectContent>ahay</SelectContent>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <ul className="list-inside ">
            {Subtopics.map((SubTopic, index) => {
              return <li key={index} className="list-disc">{SubTopic.SubTopicTitle}</li>
            })}
          </ul>
        </div>
      </TabsContent>
      <TabsList className="flex h-full flex-col p-3 gap-5 justify-start bg-gray-200 rounded-none" >
        <TabsTrigger value="main"><TableProperties /></TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

