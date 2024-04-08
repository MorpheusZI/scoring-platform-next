import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex w-full h-[100vh] justify-center items-center">
      <Loader2 className="w-12 animate-spin" />
      <h1 className="text-4xl ">Loading</h1>
    </div>
  )
}
