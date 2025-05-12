import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardTitle } from '@renderer/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Separator } from '@renderer/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { TARGET_SUB_PATH_FORMAT_OPTIONS } from '@shared-all/types/copyFileTypes'
import { StoreRule } from '@shared-all/types/ruleTypes'
import { ArrowRight } from 'lucide-react'
import { Control } from 'react-hook-form'
import { TargetSubPathFormatFolderDisplay } from './TargetSubPathFormatFolderDisplay'

const fileName: string = 'TargetSubPathFormat.tsx'
const area: string = 'rule-form'

export function TargetSubPathFormat({ control }: { control: Control<StoreRule> }) {
  const funcName: string = 'TargetSubPathFormat'
  log.rend(funcName, fileName, area)

  return (
    <FormField
      control={control}
      name="copyFileOptions.targetSubPathFormat"
      render={({ field }) => {
        const selectedFolders: TARGET_SUB_PATH_FORMAT_OPTIONS[] =
          (field.value as TARGET_SUB_PATH_FORMAT_OPTIONS[]) || []

        const availableFolders = Object.values(TARGET_SUB_PATH_FORMAT_OPTIONS).filter(
          (item) => !selectedFolders.includes(item)
        )

        const addFolder = (newFolder: TARGET_SUB_PATH_FORMAT_OPTIONS) => {
          log.cond(`Added: ${newFolder}`, funcName, fileName, area)
          if (!selectedFolders.includes(newFolder)) {
            field.onChange([...selectedFolders, newFolder])
          }
        }

        const removeFolder = (removedFolder: TARGET_SUB_PATH_FORMAT_OPTIONS) => {
          log.cond(`Removed: ${removedFolder}`, funcName, fileName, area)
          const updated = selectedFolders.filter((textFolder) => textFolder !== removedFolder)
          field.onChange(updated)
        }

        const onDragEnd = ({ active, over }: DragEndEvent) => {
          log.cond(`Folder Dragged`, funcName, fileName, area)

          if (!over || active.id === over.id) {
            log.cond(`Not moved`, funcName, fileName, area)
            return
          }

          const oldIndex = selectedFolders.indexOf(active.id as TARGET_SUB_PATH_FORMAT_OPTIONS)
          const newIndex = selectedFolders.indexOf(over.id as TARGET_SUB_PATH_FORMAT_OPTIONS)
          if (oldIndex !== -1 && newIndex !== -1) {
            log.cond(`Moved from ${oldIndex} to ${newIndex}`, funcName, fileName, area)
            field.onChange(arrayMove(selectedFolders, oldIndex, newIndex))
          }
        }

        return (
          <Card>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex flex-row items-center w-fit">
                  <CardTitle className="text-start ml-5">Copy Path Under Target Folder</CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  The path which files will be copied to under the target folder
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <CardContent>
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex flex-row items-center w-fit">
                      <FormLabel className="pl-3 pr-3 pb-3">Copy Path Options</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>Format options for the path</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <FormControl>
                  <div className="w-[calc(100vw-500px)]">
                    {/* Available Items */}
                    <div className="flex w-fit p-2 flex-wrap gap-2 items-center justify-center mx-auto">
                      {availableFolders.map((folderOption) => (
                        <Button
                          key={folderOption}
                          className="cursor-pointer"
                          variant="outline"
                          onClick={() => addFolder(folderOption)}
                        >
                          Add '{folderOption}'
                        </Button>
                      ))}
                      {availableFolders.length === 0 && (
                        <div className="text-xs text-gray-600">
                          No More Available Copy Path Options Available
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex flex-row items-center w-fit">
                          <FormLabel className="pl-3 pr-3 pb-3">Copy Path Order</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          Path files will be copied to under target folder
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Ordered List (Draggable) */}
                    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                      <SortableContext
                        items={selectedFolders}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="flex flex-row flex-wrap justify-center items-center overflow-hidden max-w-full">
                          <Card className="w-fit p-2 m-1 bg-black text-white font-bold">
                            Target Folder
                          </Card>
                          <ArrowRight className="!size-[35px]" />
                          {selectedFolders.map((selectedFolder, key) => (
                            <div key={key} className="flex flex-row items-center">
                              <TargetSubPathFormatFolderDisplay
                                key={selectedFolder}
                                folder={selectedFolder}
                                removeItem={() => removeFolder(selectedFolder)}
                              />
                              <ArrowRight className="!size-[35px]" />
                            </div>
                          ))}
                          <Card className=" w-fit p-2 m-1 bg-black text-white font-bold">
                            Copied Files
                          </Card>
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
              {selectedFolders.includes(TARGET_SUB_PATH_FORMAT_OPTIONS.CUSTOM) && (
                <FormItem>
                  <Separator className="my-4" />
                  <FormField
                    control={control}
                    name="copyFileOptions.customDirectoryName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="flex flex-row items-center w-fit">
                              <FormLabel className=" ml-4 mb-1">Cusom Name</FormLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                              The name of the folder for the 'Custom' option
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <FormControl>
                          <Input placeholder="Custom Folder Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormItem>
              )}
            </CardContent>
          </Card>
        )
      }}
    />
  )
}

export default TargetSubPathFormat
