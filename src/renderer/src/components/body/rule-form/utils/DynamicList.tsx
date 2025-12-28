import { Button } from '@renderer/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { StoreRule } from '@shared-all/types/ruleTypes'
import { useState } from 'react'
import { Control, FieldPath } from 'react-hook-form'

const fileName = 'DynamicList.tsx'
const area = 'rule-form'

export function DynamicList({
  control,
  name,
  label
}: {
  control: Control<StoreRule>
  name: FieldPath<StoreRule>
  label: string
}): React.ReactElement {
  const funcName = 'DynamicList'
  log.rend(funcName, fileName, area)

  const [newItem, setNewItem] = useState('')

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        if (!Array.isArray(field.value) || !field.value.every((item) => typeof item === 'string')) {
          return <div />
        }

        const value: string[] = field.value || []
        const onChange = field.onChange

        const addToList = (): void => {
          log.cond('Add item to list', funcName, fileName, area)
          const trimmed = newItem.trim()
          if (trimmed) {
            log.cond('Item not empty', funcName, fileName, area)
            onChange([...value, trimmed])
            setNewItem('')
          }
        }

        const removeFromList = (index: number): void => {
          log.cond('Remove item from list', funcName, fileName, area)
          const updated = value.filter((_: string, i: number) => i !== index)
          onChange(updated)
        }

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="e.g. 'footage-1' or 'footage-*'"
                  />
                  <Button type="button" className="cursor-pointer" onClick={addToList}>
                    Add
                  </Button>
                </div>

                {value.map((item: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input value={item} readOnly className="flex-1 cursor-default" />
                    <Button
                      type="button"
                      className="cursor-pointer bg-red-700  hover:bg-red-600 text-white hover:text-white"
                      variant="outline"
                      onClick={() => removeFromList(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
