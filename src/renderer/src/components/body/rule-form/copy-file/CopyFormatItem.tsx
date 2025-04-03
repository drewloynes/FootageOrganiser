import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function CopyFormatItem({
  id,
  removeItem
}: {
  id: string
  removeItem: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <Card ref={setNodeRef} style={style} className="p-2 flex justify-between items-center">
      <div {...attributes} {...listeners} className="flex-1 cursor-grab p-2 select-none">
        {id}
      </div>

      {/* NON-DRAGGABLE Delete Button */}
      <button
        type="button"
        className="cursor-pointer text-red-500 p-1"
        onClick={(e) => {
          e.stopPropagation() // Prevent drag interference
          console.log('X clicked for:', id) // Debugging
          removeItem(id)
        }}
      >
        <X />
      </button>
    </Card>
  )
}
