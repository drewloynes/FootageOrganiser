// import { closestCenter, DndContext } from '@dnd-kit/core'
// import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
// import { Button } from '@renderer/components/ui/button'
// import { TARGET_SUB_PATH_FORMAT_OPTIONS } from '@shared/types/copyFileTypes'
// import { StoreRule } from '@shared/types/ruleTypes'
// import { Control, Controller, UseFormSetValue, UseFormWatch } from 'react-hook-form'
// import { CopyFormatItem } from './CopyFormatItem' // Custom sortable component

// type CopyFormatType = {
//   control: Control<StoreRule>
//   setValue: UseFormSetValue<any>
//   watch: UseFormWatch<any>
// }

// export default function CopyFormat({ control, setValue, watch }: CopyFormatType) {
//   const copyFormat = watch('copyFormat') || []

//   const addItem = (item: string) => {
//     if (!copyFormat.includes(item)) {
//       setValue('copyFormat', [...copyFormat, item])
//     }
//   }

//   const removeItem = (item: string) => {
//     const updatedList = copyFormat.filter((i) => i !== item)
//     console.log('remove item running')
//     setValue('copyFormat', updatedList, { shouldValidate: true, shouldDirty: true })
//     console.log(copyFormat)
//   }

//   // Handle drag end
//   const onDragEnd = (event: any) => {
//     const { active, over } = event
//     if (!over || active.id === over.id) return

//     const oldIndex = copyFormat.indexOf(active.id)
//     const newIndex = copyFormat.indexOf(over.id)

//     setValue('copyFormat', arrayMove(copyFormat, oldIndex, newIndex)) // Reorder list
//   }

//   return (
//     <div>
//       {/* Available Items */}
//       <div className="flex flex-wrap gap-2">
//         {Object.values(TARGET_SUB_PATH_FORMAT_OPTIONS)
//           .filter((item) => !copyFormat.includes(item))
//           .map((item) => (
//             <Button key={item} variant="outline" onClick={() => addItem(item)}>
//               Add {item}
//             </Button>
//           ))}
//       </div>

//       {/* Ordered List (Draggable) */}
//       <Controller
//         name=""
//         control={control}
//         defaultValue={[]}
//         render={({ field }) => (
//           <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
//             <SortableContext items={field.value || []} strategy={verticalListSortingStrategy}>
//               <div className="space-y-2">
//                 {(field.value || []).map((item) => (
//                   <CopyFormatItem key={item} id={item} removeItem={() => removeItem(item)} />
//                 ))}
//               </div>
//             </SortableContext>
//           </DndContext>
//         )}
//       />
//     </div>
//   )
// }

import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@renderer/components/ui/button'
import { TARGET_SUB_PATH_FORMAT_OPTIONS } from '@shared/types/copyFileTypes'
import { StoreRule } from '@shared/types/ruleTypes'
import { Control, Controller } from 'react-hook-form'
import { CopyFormatItem } from './CopyFormatItem'

type CopyFormatProps = {
  control: Control<StoreRule>
}

export default function CopyFormat({ control }: CopyFormatProps) {
  const availableOptions = Object.values(TARGET_SUB_PATH_FORMAT_OPTIONS)

  return (
    <Controller<StoreRule>
      name="copyFileOptions.targetSubPathFormat"
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        const selectedItems: TARGET_SUB_PATH_FORMAT_OPTIONS[] =
          (field.value as TARGET_SUB_PATH_FORMAT_OPTIONS[]) || []

        const addItem = (item: TARGET_SUB_PATH_FORMAT_OPTIONS) => {
          if (!selectedItems.includes(item)) {
            field.onChange([...selectedItems, item])
          }
        }

        const removeItem = (item: TARGET_SUB_PATH_FORMAT_OPTIONS) => {
          const updated = selectedItems.filter((i) => i !== item)
          field.onChange(updated)
        }

        const onDragEnd = ({ active, over }: DragEndEvent) => {
          if (!over || active.id === over.id) return

          const oldIndex = selectedItems.indexOf(active.id as TARGET_SUB_PATH_FORMAT_OPTIONS)
          const newIndex = selectedItems.indexOf(over.id as TARGET_SUB_PATH_FORMAT_OPTIONS)

          if (oldIndex !== -1 && newIndex !== -1) {
            field.onChange(arrayMove(selectedItems, oldIndex, newIndex))
          }
        }

        const availableItems = availableOptions.filter((item) => !selectedItems.includes(item))

        return (
          <div>
            {/* Available Items */}
            <div className="flex flex-wrap gap-2 mb-4">
              {availableItems.map((item) => (
                <Button key={item} variant="outline" onClick={() => addItem(item)}>
                  Add {item}
                </Button>
              ))}
            </div>

            {/* Ordered List (Draggable) */}
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={selectedItems} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {selectedItems.map((item) => (
                    <CopyFormatItem key={item} id={item} removeItem={() => removeItem(item)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )
      }}
    />
  )
}
