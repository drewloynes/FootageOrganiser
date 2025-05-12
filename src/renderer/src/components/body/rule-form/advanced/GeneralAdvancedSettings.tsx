import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Separator } from '@renderer/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { StoreRule } from '@shared-all/types/ruleTypes'
import { Control } from 'react-hook-form'
import { IncludeExcludeLists } from '../utils/IncludeExcludeLists'
import { RuleFormCheckBox } from '../utils/RuleFormCheckBox'

const fileName: string = 'GeneralAdvancedSettings.tsx'
const area: string = 'rule-form'

export function GeneralAdvancedSettings({
  control,
  showDisableRule
}: {
  control: Control<StoreRule>
  showDisableRule: boolean
}) {
  const funcName: string = 'GeneralAdvancedSettings'
  log.rend(funcName, fileName, area)

  return (
    <Card className="my-3">
      <CardHeader>
        <CardTitle>General Advanced Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <RuleFormCheckBox
            control={control}
            fieldName="enableStartStopActions"
            label="Enable Start / Stop Actions"
            tooltip="Allows execution of actions to be stopped and started - Requiring all
                      execution to be started"
            className="mb-3"
          />

          {showDisableRule && (
            <RuleFormCheckBox
              control={control}
              fieldName="disabled"
              label="Disable Rule"
              tooltip="Rule does not run - No evaluation or execution"
              className="mb-3"
            />
          )}

          <Card className="mt-2">
            <CardContent>
              <CardTitle className="mb-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex flex-row items-center w-fit">
                      Origin Folder Filters
                    </TooltipTrigger>
                    <TooltipContent>
                      Filter folders and files to include and exclude when copying from the origin
                      folder
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <Separator className="mb-4" />
              <IncludeExcludeLists control={control} listParentName="origin" />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

export default GeneralAdvancedSettings
