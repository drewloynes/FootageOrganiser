/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Control, FieldValues, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CopyFormatItem } from './CopyFormatItem' // Custom sortable component
import { log } from 'console'

const options = ['Year', 'Month', 'Day', 'Volume Name', 'File Format', 'Custom']

type CopyFormatType = {
  control: Control<FieldValues, any>
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
}

export default function CopyFormat({ control, setValue, watch }: CopyFormatType) {
  const copyFormat = watch('copyFormat') || []

  const addItem = (item: string) => {
    if (!copyFormat.includes(item)) {
      setValue('copyFormat', [...copyFormat, item])
    }
  }

  const removeItem = (item: string) => {
    const updatedList = copyFormat.filter((i) => i !== item)
    console.log('remove item running')
    setValue('copyFormat', updatedList, { shouldValidate: true, shouldDirty: true })
    console.log(copyFormat)
  }

  // Handle drag end
  const onDragEnd = (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = copyFormat.indexOf(active.id)
    const newIndex = copyFormat.indexOf(over.id)

    setValue('copyFormat', arrayMove(copyFormat, oldIndex, newIndex)) // Reorder list
  }

  return (
    <div>
      {/* Available Items */}
      <div className="flex flex-wrap gap-2">
        {options
          .filter((item) => !copyFormat.includes(item))
          .map((item) => (
            <Button key={item} variant="outline" onClick={() => addItem(item)}>
              Add {item}
            </Button>
          ))}
      </div>

      {/* Ordered List (Draggable) */}
      <Controller
        name="copyFormat"
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={field.value || []} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {(field.value || []).map((item) => (
                  <CopyFormatItem key={item} id={item} removeItem={() => removeItem(item)} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      />
    </div>
  )
}
