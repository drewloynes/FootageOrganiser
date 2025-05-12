import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card'
import { Separator } from '@renderer/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { StoreRule } from '@shared-all/types/ruleTypes'
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form'
import { FolderSelector } from '../FolderSelector'
import { IncludeExcludeLists } from '../utils/IncludeExcludeLists'
import { RuleFormCheckBox } from '../utils/RuleFormCheckBox'
import TargetSubPathFormat from './TargetSubPathFormat'

const fileName: string = 'CopyFileSettings.tsx'
const area: string = 'rule-form'

export function CopyFileSettings({
  control,
  watch
}: {
  control: Control<StoreRule>
  watch: UseFormWatch<StoreRule>
}) {
  const funcName: string = 'CopyFileSettings'
  log.rend(funcName, fileName, area)

  const isDeleteFilesChecked = watch('copyFileOptions.deleteCopiedFiles')
  const isDeleteExtraChecked = watch('copyFileOptions.deleteUnderOtherPaths')

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'copyFileOptions.otherPaths'
  })

  return (
    <Card className="my-3">
      <CardHeader>
        <CardTitle>Copy File Advanced Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <TargetSubPathFormat control={control} />

        <RuleFormCheckBox
          control={control}
          fieldName="copyFileOptions.deleteCopiedFiles"
          label="Delete Copied Files"
          tooltip="Automatically delete copied files (After checksum verifying copies integrity)"
          className="mb-1 mt-4"
        />

        {isDeleteFilesChecked && (
          <RuleFormCheckBox
            control={control}
            fieldName="copyFileOptions.deleteUnderOtherPaths"
            label="Delete Other Folders / Files"
            tooltip="Automatically delete other folders / files after copied files have been
                      deleted"
            className="mb-5 mt-4"
          />
        )}

        {fields.length === 0 && <Separator className="mb-2 mt-3" />}

        {isDeleteExtraChecked && (
          <div>
            {fields.map((field, index) => (
              <Card key={field.id} className="mb-4">
                <CardContent>
                  <FolderSelector
                    control={control}
                    name={`copyFileOptions.otherPaths.${index}`}
                    buttonText="Select Other Folder"
                    label="Other Folder"
                    toolTip="Other folder to delete under"
                  />
                  <div className="mt-5 mb-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex flex-row items-center w-fit font-semibold">
                          Other Folder Filters
                        </TooltipTrigger>
                        <TooltipContent>
                          Filter folders and files to include and exclude when deleting from this
                          specific folder
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <IncludeExcludeLists
                    control={control}
                    listParentName={`copyFileOptions.otherPaths.${index}`}
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-6 mb-1 bg-red-700  hover:bg-red-600 text-white"
                  >
                    Remove Other Folder
                  </Button>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              onClick={
                () =>
                  append({
                    volumeName: '',
                    pathFromVolumeRoot: '',
                    filesToInclude: [],
                    filesToExclude: [],
                    dirsToInclude: [],
                    dirsToExclude: []
                  }) // Add a new empty object to create another card
              }
              className="mt-4 font-semibold px-4 py-4 cursor-pointer"
            >
              Add Other Folder to Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CopyFileSettings
