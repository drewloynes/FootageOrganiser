import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { StoreSettings } from '@shared-all/types/settingsTypes'
import { Control } from 'react-hook-form'

const fileName = 'SettingsFormNumberInput.tsx'
const area = 'settings'

export function SettingsFormNumberInput({
  control,
  fieldName,
  label = '',
  tooltip = '',
  placeHolderText = ''
}: {
  control: Control<StoreSettings>
  fieldName: 'actionsCutoffInGBs' | 'deleteOldLogsInDays' | 'reevaluateSleepTime'
  label?: string
  tooltip?: string
  placeHolderText?: string
}): React.ReactElement {
  const funcName = 'SettingsFormNumberInput'
  log.rend(funcName, fileName, area)

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex flex-row items-center w-fit">
                <FormLabel className="text-xs ml-4">{label}</FormLabel>
              </TooltipTrigger>
              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <FormControl>
            <Input type="number" placeholder={placeHolderText} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
