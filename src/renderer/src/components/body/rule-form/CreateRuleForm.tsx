import { Checkbox } from '@components/ui/checkbox'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent } from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import {
  DEFAULT_STORE_RULE,
  FullRule,
  RULE_TYPE,
  ShortRule,
  StoreRule
} from '@shared/types/ruleTypes'
import { STORE_RULE_ZOD_SCHEMA } from '@shared/validation/validateRule'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  Resolver,
  useController,
  useFieldArray,
  useForm,
  UseFormSetValue
} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import CopyFormat from './copy-file/CopyFormat'
import { DirectorySelector } from './directorySelector'
import { RuleName } from './Name'
import { RuleType } from './Type'

function initIncludeExcldue(setValue: UseFormSetValue<StoreRule>) {
  setValue('copyFileOptions.targetSubPathFormat', [])
}

type CreateRuleFormType = {
  newRule: boolean
  initialRuleName: string
  initialRuleValues?: StoreRule | ShortRule | FullRule
  showDisableRule?: boolean
}

export default function CreateRuleForm({
  newRule,
  initialRuleName,
  initialRuleValues,
  showDisableRule = true
}: CreateRuleFormType) {
  const [loading, setLoading] = useState(true)

  let defaultValues: StoreRule = {
    ...DEFAULT_STORE_RULE,
    ...initialRuleValues
  }

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors }
  } = useForm<StoreRule>({
    resolver: zodResolver(STORE_RULE_ZOD_SCHEMA) as Resolver<StoreRule>,
    defaultValues: defaultValues,
    criteriaMode: 'all'
  })

  // initIncludeExcldue(register)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'copyFileOptions.otherPaths'
  })

  const [advancedOpen, setAdvancedOpen] = useState(false)

  useEffect(() => {
    console.log('Setvalue copy file')
    setValue('type', RULE_TYPE.COPYFILE)
  }, [setValue])
  const ruleType = watch('type')

  const isDeleteExtraChecked = watch('copyFileOptions.deleteUnderOtherPaths')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchDataAndSetDefaults = async () => {
      console.log('run await')
      const serverData = await window.electron.getRule(initialRuleName)
      const mergeData = { ...initialRuleValues, ...serverData }
      // Merge server data with initial values
      reset(mergeData)

      setLoading(false)
    }

    if (!newRule) {
      fetchDataAndSetDefaults()
    } else {
      setLoading(false)
    }
  }, [initialRuleValues, reset])

  const onSubmit = (data) => {
    console.log('Form Data:', data)

    const submitAddRule = async (data) => {
      try {
        window.electron.addRule(data)
      } catch (error) {
        console.error('Failed to fetch list:', error)
      }
    }

    const submitEditRule = async (data) => {
      try {
        window.electron.modifyRule(initialRuleName, data)
      } catch (error) {
        console.error('Failed to fetch list:', error)
      }
    }

    if (newRule) {
      submitAddRule(data)
    } else {
      submitEditRule(data)
    }
    navigate(`/`)
  }

  const onError = (errors: any) => {
    getValues()
    console.log('Zod Errors:', errors)
  }

  // shadcn
  if (loading) return <div className=" bg-white text-black">Loading...</div>

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className=" bg-white text-black">
      <RuleName control={control} />
      <RuleType control={control} />
      <DirectorySelector<StoreRule> control={control} name="origin" buttonText="Select Copy From" />
      <DirectorySelector<StoreRule> control={control} name="target" buttonText="Select Copy To" />
      <Button
        type="button"
        className="flex flex-wrap gap-2 w-[120px]"
        onClick={() => setAdvancedOpen(!advancedOpen)}
      >
        Toggle Advanced Settings
      </Button>
      {advancedOpen && (
        <div>
          <label>
            <Controller
              name="enableStartStopActions"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              )}
            />{' '}
            Confirm before actions
          </label>
          {showDisableRule && (
            <label>
              <Controller
                name="disabled"
                control={control}
                render={({ field }) => (
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                )}
              />{' '}
              Pause Rule
            </label>
          )}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <DynamicList<StoreRule>
              control={control}
              name="origin.filesToInclude"
              label={'Files to include'}
            />
            <DynamicList<StoreRule>
              control={control}
              name="origin.filesToExclude"
              label="Files to exclude"
            />
            <DynamicList<StoreRule>
              control={control}
              name="origin.dirsToInclude"
              label="Folders to include"
            />
            <DynamicList<StoreRule>
              control={control}
              name="origin.dirsToExclude"
              label="Folders to exclude"
            />
          </motion.div>
        </div>
      )}

      {ruleType === 'Copy File' && (
        <Card>
          <CardContent>
            <CopyFormat control={control} />
            <Controller<StoreRule, 'copyFileOptions.customDirectoryName'>
              name="copyFileOptions.customDirectoryName"
              control={control}
              defaultValue={''}
              render={({ field }) => <Input placeholder="Custom String" {...field} />}
            />
            <label>
              <Controller<StoreRule, 'copyFileOptions.deleteCopiedFiles'>
                name="copyFileOptions.deleteCopiedFiles"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                )}
              />{' '}
              Auto Clean
            </label>
            <div>
              <label>
                <Controller<StoreRule, 'copyFileOptions.deleteUnderOtherPaths'>
                  name="copyFileOptions.deleteUnderOtherPaths"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />{' '}
                Delete Extra
              </label>

              {isDeleteExtraChecked && (
                <div>
                  {fields.map((field, index) => (
                    <Card key={field.id} className="mb-4">
                      <CardContent>
                        <DirectorySelector<StoreRule>
                          control={control}
                          name={`copyFileOptions.otherPaths.${index}`}
                          buttonText="Select path to delete: "
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <DynamicList<StoreRule>
                            control={control}
                            name={`copyFileOptions.otherPaths.${index}.filesToInclude`}
                            label="Files to Include"
                          />
                          <DynamicList<StoreRule>
                            control={control}
                            name={`copyFileOptions.otherPaths.${index}.filesToExclude`}
                            label="Files to Exclude"
                          />
                          <DynamicList<StoreRule>
                            control={control}
                            name={`copyFileOptions.otherPaths.${index}.dirsToInclude`}
                            label="Folders to Include"
                          />
                          <DynamicList<StoreRule>
                            control={control}
                            name={`copyFileOptions.otherPaths.${index}.dirsToExclude`}
                            label="Folders to Exclude"
                          />
                        </motion.div>
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-2 bg-red-500 hover:bg-red-600"
                        >
                          Remove
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
                    className="mt-4 bg-blue-500 hover:bg-blue-600"
                  >
                    Add Delete Extra Path
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {ruleType === 'Mirror' && (
        <Card>
          <CardContent>
            <label>
              <Controller<StoreRule, 'mirrorOptions.enableDeletingInTarget'>
                name="mirrorOptions.enableDeletingInTarget"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                )}
              />{' '}
              Clean Target
            </label>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <DynamicList<StoreRule>
                control={control}
                name="target.filesToInclude"
                label="Files to include"
              />
              <DynamicList<StoreRule>
                control={control}
                name="target.filesToExclude"
                label="Files to exclude"
              />
              <DynamicList<StoreRule>
                control={control}
                name="target.dirsToInclude"
                label="Folders to include"
              />
              <DynamicList<StoreRule>
                control={control}
                name="target.dirsToExclude"
                label="Folders to exclude"
              />
            </motion.div>
          </CardContent>
        </Card>
      )}
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      {errors.type && <p className="text-red-500">{errors.type.message}</p>}
      {errors.origin?.volumeName && (
        <p className="text-red-500">{errors.origin.volumeName.message}</p>
      )}
      {errors.origin?.pathFromVolumeRoot && (
        <p className="text-red-500">{errors.origin.pathFromVolumeRoot.message}</p>
      )}
      {errors.target?.volumeName && (
        <p className="text-red-500">{errors.target.volumeName.message}</p>
      )}
      {errors.target?.pathFromVolumeRoot && (
        <p className="text-red-500">{errors.target.pathFromVolumeRoot.message}</p>
      )}

      {errors.enableStartStopActions && (
        <p className="text-red-500">{errors.enableStartStopActions.message}</p>
      )}
      {errors.disabled && <p className="text-red-500">{errors.disabled.message}</p>}
      {errors.origin?.filesToInclude && (
        <p className="text-red-500">{errors.origin.filesToInclude.message}</p>
      )}
      {errors.origin?.filesToExclude && (
        <p className="text-red-500">{errors.origin.filesToExclude.message}</p>
      )}
      {errors.origin?.dirsToInclude && (
        <p className="text-red-500">{errors.origin.dirsToInclude.message}</p>
      )}
      {errors.origin?.dirsToExclude && (
        <p className="text-red-500">{errors.origin.dirsToExclude.message}</p>
      )}

      {errors.copyFileOptions?.targetSubPathFormat && (
        <p className="text-red-500">{errors.copyFileOptions.targetSubPathFormat.message}</p>
      )}
      {errors.copyFileOptions?.customDirectoryName && (
        <p className="text-red-500">{errors.copyFileOptions.customDirectoryName.message}</p>
      )}
      {errors.copyFileOptions?.deleteCopiedFiles && (
        <p className="text-red-500">{errors.copyFileOptions.deleteCopiedFiles.message}</p>
      )}
      {errors.copyFileOptions?.deleteUnderOtherPaths && (
        <p className="text-red-500">{errors.copyFileOptions.deleteUnderOtherPaths.message}</p>
      )}
      {errors.copyFileOptions?.otherPaths && (
        <p className="text-red-500">{errors.copyFileOptions.otherPaths.message}</p>
      )}

      {errors.mirrorOptions?.enableDeletingInTarget && (
        <p className="text-red-500">{errors.mirrorOptions.enableDeletingInTarget.message}</p>
      )}
      {errors.target?.filesToInclude && (
        <p className="text-red-500">{errors.target.filesToInclude.message}</p>
      )}
      {errors.target?.filesToExclude && (
        <p className="text-red-500">{errors.target.filesToExclude.message}</p>
      )}
      {errors.target?.dirsToInclude && (
        <p className="text-red-500">{errors.target.dirsToInclude.message}</p>
      )}
      {errors.target?.dirsToExclude && (
        <p className="text-red-500">{errors.target.dirsToExclude.message}</p>
      )}

      {newRule && <Button type="submit">Create Rule</Button>}
      {!newRule && <Button type="submit">Edit Rule</Button>}
    </form>
  )
}

// type DynamicListType = {
//   label: string
//   name: string
//   setValue: any
//   getValues: any
// }

// function DynamicList({ label, name, setValue, getValues }: DynamicListType) {
//   console.log('Dynamic Lsit:', name)

//   const [newItem, setNewItem] = useState('')

//   const initialCurrentList: string[] = getValues(name)
//   setValue(name, initialCurrentList)
//   console.log('newCurrentlist: ', initialCurrentList)

//   const [currentItems, setCurrentItems] = useState<string[]>(initialCurrentList)

//   // Add to include file list
//   const addToList = () => {
//     if (newItem.trim()) {
//       const newCurrentList: string[] = [...currentItems, newItem.trim()]
//       setValue(name, newCurrentList)
//       setCurrentItems(newCurrentList)
//       setNewItem('')
//     }
//   }

//   // Remove from include file list
//   const removeFromList = (index) => {
//     const newCurrentList = currentItems.filter((_, i) => i !== index)
//     setValue(name, newCurrentList)
//     setCurrentItems(newCurrentList)
//   }

//   return (
//     <div>
//       <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} />
//       <Button type="button" onClick={() => addToList()}>
//         Add Item
//       </Button>

//       <p>{label}</p>

//       {currentItems.map((item, index) => (
//         <div key={index} className="flex gap-2">
//           <Input value={item} readOnly />
//           <Button type="button" onClick={() => removeFromList(index)}>
//             Remove
//           </Button>
//         </div>
//       ))}
//     </div>
//   )
// }

type DynamicListProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
}

export function DynamicList<TFieldValues extends FieldValues>({
  control,
  name,
  label
}: DynamicListProps<TFieldValues>) {
  const [newItem, setNewItem] = useState('')

  const {
    field: { value = [], onChange }
  } = useController({
    control,
    name
  })

  const addToList = () => {
    const trimmed = newItem.trim()
    if (trimmed) {
      onChange([...value, trimmed])
      setNewItem('')
    }
  }

  const removeFromList = (index: number) => {
    const updated = value.filter((_: string, i: number) => i !== index)
    onChange(updated)
  }

  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add item..."
        />
        <Button type="button" onClick={addToList}>
          Add
        </Button>
      </div>

      {value.map((item: string, index: number) => (
        <div key={index} className="flex items-center gap-2 mb-1">
          <Input value={item} readOnly className="flex-1" />
          <Button type="button" variant="outline" onClick={() => removeFromList(index)}>
            Remove
          </Button>
        </div>
      ))}
    </div>
  )
}
