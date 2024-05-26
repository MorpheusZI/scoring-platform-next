import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex w-full h-[100vh] bg-black justify-center items-center">
      <Loader2 className="w-12" />
      <h1 className="text-4xl text-white">Loading</h1>
    </div>
  )
}
