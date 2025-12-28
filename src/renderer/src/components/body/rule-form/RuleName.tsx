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

const fileName = 'RuleName.tsx'
const area = 'rule-form'

export function RuleName({ control }: { control: Control<StoreRule> }): React.ReactElement {
  const funcName = 'RuleName'
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
