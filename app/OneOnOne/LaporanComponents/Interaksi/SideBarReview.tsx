'use client'
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CalendarClock, History, Loader2, Sparkles, TableProperties } from 'lucide-react';
import { Subtopics } from '../../Server/Topics';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Document, User } from '@prisma/client';
import { getDocs } from '@/app/ListMentee/Server/GetMentees';

export type SideBarRevProps = {
  aiResp: string | undefined
  SummaryCall?: () => void;
  UpdateDocHistory: boolean
  User: User | undefined | null
  ChangeDocID?: (DocID: number | undefined) => void
  CurrentDocID?: number
}

export default function Sidebar({ CurrentDocID, aiResp, SummaryCall, User, UpdateDocHistory, ChangeDocID }: SideBarRevProps) {
  const [PickedTopics, setPickedTopics] = useState<Array<string>>([])
  const [isExpanded, setIsExpanded] = useState(false);
  const [Mentee, setMentee] = useState<User | null>()
  const [HistoricalDocs, setHistoricalDocs] = useState<Document[] | null | undefined>()
  const [ChangedTabs, setChangedTabs] = useState(true)

  useEffect(() => {
    const MenteeData = sessionStorage.getItem('MenteeData')
    const MenteeDat = MenteeData ? JSON.parse(MenteeData) : null
    setMentee(MenteeDat)
    // @ts-ignore
  }, [])
  useEffect(() => {
    if (!Mentee) return
    if (!User) return
    const docs = getDocs(Mentee?.UserID, User?.UserID).then(docs => {
      const hisdocs = docs.filter((doc) => doc.memberID === Mentee.UserID && doc.managerID === User.UserID)
      setHistoricalDocs(hisdocs)
    })
  }, [Mentee, User, SummaryCall])

  const displayedSummary = aiResp ? (isExpanded ? aiResp : aiResp.substring(0, 100) + '...') : (
    "AI Summarizer"
  );

  const handleReadMore = () => setIsExpanded(!isExpanded);
  const renderSeeMore = () => {
    if (!aiResp) return
    return <span className="text-xs px-4 text-purple-400 hover:cursor-pointer" onClick={handleReadMore}>{!isExpanded ? "Selengkapnya" : "Read less"}</span>
  }

  const renderedGuides = PickedTopics.map((topic, index) => {
    const findSubtopics = Subtopics.find((subtopic) => subtopic.SubTopicTitle === topic)
    const guides = findSubtopics?.Guides
    return (
      <div key={index} className="p-4 text-sm bg-black text-white rounded-xl mb-2">
        <p className="font-semibold mb-4 text-center">{findSubtopics?.SubTopicTitle}</p>
        <ul className="list-disc list-inside">
          {guides?.map((guide) => (
            <li key={index} className="mb-4">{guide.SubtopicGuide}</li>
          ))}
        </ul>
      </div>
    )
  })

  function CountKomitmen(Komitmen: string | null) {
    const regex = new RegExp("<ul[^>]*>", "g")
    const matches = Komitmen?.match(regex)
    return matches ? matches?.length : "0"
  }
  function handleDocIDchange(docId: number, CurrentDocID: number | undefined) {
    if (!ChangeDocID) return
    ChangeDocID(docId)
    if (CurrentDocID === docId) {
      ChangeDocID(undefined)
      return
    }
  }
  const renderHistory = useMemo(() => {
    const bruh = HistoricalDocs?.map((doc, index) => {
      if (!doc.Summary && !doc.managerContent && !doc.Catatan) return
      const CurrentDocClass = CurrentDocID === doc.DocID ? "border-2 border-purple-500 shadow-lg shadow-purple-300" : ""
      return <div key={index} onClick={() => handleDocIDchange(doc.DocID, CurrentDocID)} className={`flex w-full flex-col gap-3 p-4 bg-white border-2 border-black rounded ${CurrentDocClass} hover:border-purple-500 hover:cursor-pointer`}>
        <div className="flex gap-2 text-sm items-center">
          <CalendarClock className="w-6 h-6" />
          <p>{doc.created_at.toLocaleDateString()} <span className="ml-2">{doc.created_at.toLocaleTimeString()}</span></p>
        </div>
        <p>{doc.Summary?.substring(0, 100) + "..."}</p>
        <div className="flex text-sm gap-2 items-center">
          <p className="px-3 py-[1.5px] rounded-xl border-2 border-gray-500">{CountKomitmen(doc.memberHTML)}</p>
          <p>Total Komitmen</p>
        </div>
      </div>
    })
    return bruh
    //@ts-ignore
  }, [HistoricalDocs, aiResp, UpdateDocHistory, CurrentDocID])
  return (
    <Tabs className="flex w-full justify-start bg-gray-100 h-[85vh] overflow-y-auto" defaultValue="main">
      <TabsContent value="main" className="w-full h-fit ">
        <div className="flex w-full flex-col px-5 py-4 gap-5 ">
          <div className="sommary flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <h1 className="text-lg ">Summary</h1>
              <Button onClick={SummaryCall} variant="outline" className="w-fit py-0"><Sparkles /></Button>
            </div>
            <div>
              <p>{displayedSummary}
                {renderSeeMore()}
              </p>
            </div>

          </div>
          <hr className="border-2 border-gray-300 rounded" />
          <div className="gaide flex flex-col gap-2">
            <h1 className="text-lg">Guide</h1>
            <ToggleGroup type="multiple" onValueChange={(v) => setPickedTopics(v)} className="grid grid-cols-2 text-xs">
              {Subtopics.map((Topic, index) => {
                return <ToggleGroupItem key={index} className="h-fit px-3 py-2 rounded-xl hover:bg-purple-500 hover:text-white text-xs bg-white data-[state=on]:bg-black data-[state=on]:text-white" value={Array.from(Topic.SubTopicTitle).join('')}>{Topic.SubTopicTitle}</ToggleGroupItem>
              })}
            </ToggleGroup>
          </div>
          {renderedGuides}
        </div>
      </TabsContent>
      <TabsContent value="History" className="w-full h-fit">
        <div className="flex w-full gap-4 flex-col items-center p-5">
          <h1 className=" text-xl  self-start">LOG 1on1</h1>
          {renderHistory}
        </div>
      </TabsContent>
      <TabsList className="flex h-full flex-col p-3 justify-start bg-gray-200 gap-2">
        <TabsTrigger value="main"><TableProperties /></TabsTrigger>
        <TabsTrigger value="History"><History /></TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
