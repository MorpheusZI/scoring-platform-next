import { Button } from "@/components/ui/button";
import { BotMessageSquare, LoaderCircle } from "lucide-react";
import { useState } from "react"

export default function AiAssist() {
  const [AIResState, setAIResState] = useState<string>("loading")
  function loadingState() {
    switch (AIResState) {
      case "null":
        return <div className="flex flex-col items-center py-10 border-2 bg-white rounded-xl border-gray-300 ">
          <div className="flex flex-col gap-5 items-center">
            <h1 className="text-lg">AI STAR Checker</h1>
            <BotMessageSquare className="w-16 h-16" />
          </div>
        </div>
        break;

      case "loading":
        return <div className="flex justify-evenly py-5 items-center ">
          <LoaderCircle className="w-16 h-16 animate-spin" />
          <p className="text-lg">AI sedang memasak ...</p>
        </div>
        break;

      default:
        break;
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg">AI Assistance</h1>
      {loadingState()}
    </div>
  )
}
