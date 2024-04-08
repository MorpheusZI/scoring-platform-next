'use client'
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { History, Loader2, TableProperties } from 'lucide-react';
import { Subtopics } from '../../Server/Topics';
import { useState } from 'react';

export type SideBarRevProps = {
  aiResp: string | undefined
  SummaryCall: boolean
}

export default function Sidebar({ aiResp, SummaryCall }: SideBarRevProps) {
  const [PickedTopics, setPickedTopics] = useState<Array<string>>([])

  const renderedGuides = PickedTopics.map((topic) => {
    const findSubtopics = Subtopics.find((subtopic) => subtopic.SubTopicTitle === topic)
    const guides = findSubtopics?.Guides
    return (
      <div className="p-4 text-sm bg-black text-white rounded-xl mb-2">
        <p className="font-semibold mb-4 text-center">{findSubtopics?.SubTopicTitle}</p>
        <ul className="list-disc list-inside">
          {guides?.map((guide, index) => (
            <li key={index} className="mb-4">{guide.SubtopicGuide}</li>
          ))}
        </ul>
      </div>
    )
  })

  return (
    <Tabs className="flex w-full justify-start bg-gray-100 h-[85vh] overflow-y-auto" defaultValue="main">
      <TabsContent value="main" className="w-full h-fit ">
        <div className="flex w-full flex-col px-5 py-4 gap-5 ">
          <div className="sommary flex flex-col gap-3">
            <h1 className="text-lg ">Summary </h1>
            {aiResp ? <p className="text-sm">{aiResp}</p> : <p className="text-sm">Summary akan muncul setalah Interaksi selesai</p>}
          </div>
          <div className="aoutline flex flex-col gap-3">
            <h1 className="text-lg ">Outlines</h1>
          </div>
          <hr className="border-2 border-gray-300 rounded" />
          <div className="gaide flex flex-col gap-2">
            <h1 className="text-lg">Guide</h1>
            <ToggleGroup type="multiple" onValueChange={(v) => setPickedTopics(v)} className="grid grid-cols-2 text-xs">
              {Subtopics.map((Topic, index) => {
                return <ToggleGroupItem key={index} className="h-fit px-3 py-2 rounded-xl text-xs bg-white data-[state=on]:bg-black data-[state=on]:text-white" value={Array.from(Topic.SubTopicTitle).join('')}>{Topic.SubTopicTitle}</ToggleGroupItem>
              })}
            </ToggleGroup>
          </div>
          {renderedGuides}
        </div>
      </TabsContent>
      <TabsList className="flex h-full flex-col p-3 justify-start bg-gray-200 gap-2">
        <TabsTrigger value="main"><TableProperties /></TabsTrigger>
        <TabsTrigger value="History"><History /></TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
