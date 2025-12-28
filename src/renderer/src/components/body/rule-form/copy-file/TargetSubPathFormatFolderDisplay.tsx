import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@renderer/components/ui/card'
import { X } from 'lucide-react'

const fileName = 'TargetSubPathFormatItem.tsx'
const area = 'rule-form'

export function TargetSubPathFormatFolderDisplay({
  folder,
  removeItem
}: {
  folder: string
  removeItem: (id: string) => void
}): React.ReactElement {
  const funcName = 'TargetSubPathFormatFolderDisplay'
  log.rend(funcName, fileName, area)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: folder
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="flex flex-row justify-between items-center gap-1 py-2 pl-3 pr-2 m-1"
    >
      <div {...attributes} {...listeners} className="cursor-grab select-none font-semibold">
        {folder}
      </div>

      <button
        type="button"
        className="cursor-pointer text-red-600 hover:text-red-400"
        onClick={(e) => {
          e.stopPropagation()
          removeItem(folder)
        }}
      >
        <X />
      </button>
    </Card>
  )
}
