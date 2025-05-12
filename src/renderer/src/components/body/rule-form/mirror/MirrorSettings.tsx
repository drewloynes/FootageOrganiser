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

const fileName: string = 'MirrorSettings.tsx'
const area: string = 'rule-form'

export function MirrorSettings({ control }: { control: Control<StoreRule> }) {
  const funcName: string = 'MirrorSettings'
  log.rend(funcName, fileName, area)

  return (
    <Card className="my-3">
      <CardHeader>
        <CardTitle>Mirror Advanced Settings</CardTitle>
      </CardHeader>

      <CardContent>
        <RuleFormCheckBox
          control={control}
          fieldName="mirrorOptions.enableDeletingInTarget"
          label="Delete Unnecessary Files / Folders In Target Folder"
          tooltip="Automatically delete files / folders in the target folder which aren't in the
                    origin folder"
          className="mb-4"
        />

        <Card className="mt-2">
          <CardContent>
            <CardTitle className="mb-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex flex-row items-center w-fit">
                    Target Folder Filters
                  </TooltipTrigger>
                  <TooltipContent>
                    Filter folders and files to include and exclude when deleting under the target
                    folder
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <Separator className="mb-4" />
            <IncludeExcludeLists control={control} listParentName={`target`} />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default MirrorSettings
