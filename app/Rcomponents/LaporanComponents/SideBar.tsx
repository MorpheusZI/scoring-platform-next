type SideBarProps = {
  Outlines?: string[],
  clickedOutline?: (cHeader: string) => void,
}
export default function Sidebar({ Outlines, clickedOutline }: SideBarProps) {
  return (
    <div className="flex h-full w-full flex-col px-7 py-4 bg-gray-200">
      <div className="aoutline flex flex-col gap-3">
        <h1 className="text-lg font-semibold">Outlines</h1>
        <ol className="list-inside list-disc">
          {Outlines?.map((header, index) => {
            return <li key={index} className="hover:underline hover:cursor-pointer" onClick={() => { clickedOutline ? clickedOutline(header) : console.log('nopeheaders') }}>{header}</li>
          })}
        </ol>

      </div>
    </div>
  )
}
