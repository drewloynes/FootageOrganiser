import { Select, SelectContent, SelectItem, SelectTrigger } from '@renderer/components/ui/select'
import { RULE_TYPE, StoreRule } from '@shared/types/ruleTypes'
import { Control, Controller } from 'react-hook-form'

type RuleTypeType = {
  control: Control<StoreRule>
}

export const RuleType = ({ control }: RuleTypeType) => {
  return (
    <div>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="text-black">{field.value}</SelectTrigger>
            <SelectContent className="text-black">
              <SelectItem className="text-black" value={RULE_TYPE.COPYFILE}>
                Copy File
              </SelectItem>
              <SelectItem className="text-black" value={RULE_TYPE.MIRROR}>
                Mirror
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  )
}
