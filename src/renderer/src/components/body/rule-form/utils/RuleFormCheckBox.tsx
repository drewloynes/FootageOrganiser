import { Checkbox } from '@renderer/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { StoreRule } from '@shared-all/types/ruleTypes'
import { Control } from 'react-hook-form'

const fileName = 'RuleFormCheckBox.tsx'
const area = 'rule-form'

export function RuleFormCheckBox({
  control,
  fieldName,
  label = '',
  tooltip = '',
  className = ''
}: {
  control: Control<StoreRule>
  fieldName:
    | 'disabled'
    | 'enableStartStopActions'
    | 'copyFileOptions.deleteCopiedFiles'
    | 'copyFileOptions.deleteUnderOtherPaths'
    | 'mirrorOptions.enableDeletingInTarget'
  label?: string
  tooltip?: string
  className?: string
}): React.ReactElement {
  const funcName = 'RuleFormCheckBox'
  log.rend(funcName, fileName, area)

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={className}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex flex-row items-center w-fit" asChild>
                <div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormLabel className="ml-2 cursor-pointer">{label}</FormLabel>
                </div>
              </TooltipTrigger>
              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
