import AiAssist from "./AIAssistant";

export default function Sidebar() {
  return (
    <div className="flex h-full w-full flex-col px-7 py-4 gap-5 bg-gray-100">
      <div className="aoutline flex flex-col gap-3">
        <h1 className="text-lg ">Outlines</h1>
      </div>
      <hr className="border-2 border-gray-300 rounded" />
      <AiAssist />
    </div>
  )
}
