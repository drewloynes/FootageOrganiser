import * as LabelPrimitive from '@radix-ui/react-label'
import { Button } from '@renderer/components/ui/button'
import { FormControl, FormField, FormItem, useFormField } from '@renderer/components/ui/form'
import { Label } from '@renderer/components/ui/label'
import { Separator } from '@renderer/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { cn } from '@renderer/utils/utils'
import { ShortPathInVolume } from '@shared-all/types/pathInVolumeTypes'
import { StoreRule } from '@shared-all/types/ruleTypes'
import { Control, FieldPath, useController } from 'react-hook-form'

const fileName: string = 'FolderSelector.tsx'
const area: string = 'rule-form'

export function FolderSelector({
  control,
  name,
  buttonText,
  label,
  toolTip
}: {
  control: Control<StoreRule>
  name: FieldPath<StoreRule>
  buttonText: string
  label: string
  toolTip: string
}) {
  const funcName: string = 'FolderSelector'
  log.rend(funcName, fileName, area)

  const {
    field: { value, onChange }
  } = useController({
    control,
    name
  })

  if (typeof value !== 'object' || !('volumeName' in value)) {
    return <div />
  }

  const selectFolder = async () => {
    log.ipcSent('choose-directory', funcName, fileName, area)
    const directoryChosen: ShortPathInVolume | undefined = await window.electron.chooseDirectory()
    log.ipcRec('choose-directory', funcName, fileName, area, directoryChosen)

    if (directoryChosen) {
      log.cond('Set chosen directory', funcName, fileName, area)
      onChange({
        ...value,
        volumeName: directoryChosen.volumeName,
        pathFromVolumeRoot: directoryChosen.pathFromVolumeRoot
      })
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="flex-1 mx-4">
          <Separator />

          <FormLabel className="text-xs ml-4">{label}</FormLabel>
          <FormControl>
            <div className="flex flex-col items-center px-4 ">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      className="content-center cursor-pointer"
                      onClick={selectFolder}
                    >
                      {buttonText}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{toolTip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {(value.volumeName || value.pathFromVolumeRoot) && (
                <div className="flex flex-col mb-2 mt-4">
                  <div className="flex flex-row items-center ">
                    <div className="font-bold py-1 pr-4 w-[120px] shrink-0">Drive Name</div>
                    <div className=" break-all">{value.volumeName}</div>
                  </div>
                  <div className="flex flex-row items-center">
                    <div className="font-bold py-1 pr-4 w-[120px] shrink-0">Drive Path</div>
                    <div className=" break-all">{value.pathFromVolumeRoot}</div>
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
          <Separator className="mt-2" />
        </FormItem>
      )}
    />
  )
}

// Rework some ShadCN components to work with nested error objects
function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  let body = error ? String(error?.message ?? '') : props.children

  // Set volume name error
  if (
    error &&
    'volumeName' in error &&
    typeof error.volumeName === 'object' &&
    error.volumeName !== null &&
    'message' in error.volumeName
  ) {
    body = error.volumeName.message as string
  }

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  )
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  let { error, formItemId } = useFormField()

  // Set error back to undefined if not changed in this component
  if (
    error &&
    !('volumeName' in error) &&
    !('pathFromVolumeRoot' in error) &&
    !('message' in error)
  ) {
    error = undefined
  }

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

export default FolderSelector
