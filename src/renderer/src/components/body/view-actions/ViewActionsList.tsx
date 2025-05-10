import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Separator } from '@renderer/components/ui/separator'
import { CopyPaths } from '@shared/types/ruleTypes'

const fileName: string = 'ViewActionsList.tsx'
const area: string = 'view-actions'

export function ActionList({ title, actions }: { title: string; actions: string[] }) {
  const funcName: string = 'ActionList'
  log.rend(funcName, fileName, area)

  return (
    <div className="p-4 border rounded-xl shadow-sm h-full">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {actions.length > 0 ? (
        <ScrollArea className="h-[calc(100%-30px)]">
          {actions.map((item, index) => (
            <div key={index} className="flex flex-col break-all text-sm">
              <Separator className="my-2" />
              {item}
            </div>
          ))}
        </ScrollArea>
      ) : (
        <div className="h-[calc(100%-30px)] flex items-center justify-center">
          <p className="text-gray-500 text-center">No pending actions</p>
        </div>
      )}
    </div>
  )
}

export function ActionCopyList({ title, actions }: { title: string; actions: CopyPaths[] }) {
  const funcName: string = 'ActionCopyList'
  log.rend(funcName, fileName, area)

  return (
    <div className="p-4 border rounded-xl shadow-sm h-full">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {actions.length > 0 ? (
        <ScrollArea className="h-[calc(100%-30px)]">
          {actions.map((item, index) => (
            <div key={index} className="">
              <Separator className="my-2" />
              <div className="flex flex-col">
                <div className="flex flex-row items-center mb-2">
                  <div className="font-bold mr-3">From</div>
                  <div className="break-all text-sm">{item.from}</div>
                </div>

                <div className="flex flex-row items-center">
                  <div className="font-bold mr-8">To</div>
                  <div className="break-all text-sm">{item.to}</div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      ) : (
        <div className="h-[calc(100%-30px)] flex items-center justify-center">
          <p className="text-gray-500 text-center">No pending actions</p>
        </div>
      )}
    </div>
  )
}
