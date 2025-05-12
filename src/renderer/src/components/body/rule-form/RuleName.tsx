import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { StoreRule } from '@shared-all/types/ruleTypes'
import { Control } from 'react-hook-form'

const fileName: string = 'RuleName.tsx'
const area: string = 'rule-form'

export function RuleName({ control }: { control: Control<StoreRule> }) {
  const funcName: string = 'RuleName'
  log.rend(funcName, fileName, area)

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="text-xs ml-4">Name</FormLabel>
          <FormControl>
            <Input placeholder="Rule Name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default RuleName
