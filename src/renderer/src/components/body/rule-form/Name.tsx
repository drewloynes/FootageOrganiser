import { Input } from '@renderer/components/ui/input'
import { StoreRule } from '@shared/types/ruleTypes'
import { Control, Controller } from 'react-hook-form'

type RuleNameType = {
  control: Control<StoreRule>
}

export const RuleName = ({ control }: RuleNameType) => {
  return (
    <div>
      <Controller
        name="name"
        control={control}
        render={({ field }) => <Input placeholder="Rule Name" {...field} className="text-black" />}
      />
    </div>
  )
}
