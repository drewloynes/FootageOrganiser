import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@renderer/components/ui/select'
import { RULE_TYPE, StoreRule } from '@shared-all/types/ruleTypes'
import { Control } from 'react-hook-form'

const fileName = 'RuleType.tsx'
const area = 'rule-form'

export function RuleType({ control }: { control: Control<StoreRule> }): React.ReactElement {
  const funcName = 'RuleType'
  log.rend(funcName, fileName, area)

  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem className="mr-10">
          <FormLabel className="text-xs ml-4">Type</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="cursor-pointer">{field.value}</SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value={RULE_TYPE.COPYFILE}>
                  Copy File
                </SelectItem>
                <SelectItem className="cursor-pointer" value={RULE_TYPE.MIRROR}>
                  Mirror
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default RuleType
