/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, SelectContent, SelectItem, SelectTrigger } from '@renderer/components/ui/select'
import { Control, Controller, FieldValues } from 'react-hook-form'

type RuleTypeType = {
  control: Control<FieldValues, any>
}

export const RuleType = ({ control }: RuleTypeType) => {
  return (
    <div>
      <Controller
        name="ruleType"
        control={control}
        defaultValue={'Copy File'}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="text-black">{field.value}</SelectTrigger>
            <SelectContent className="text-black">
              <SelectItem className="text-black" value="Copy File">
                Copy File
              </SelectItem>
              <SelectItem className="text-black" value="Mirror">
                Mirror
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  )
}
