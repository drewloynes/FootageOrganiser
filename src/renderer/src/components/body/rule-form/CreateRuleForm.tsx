/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import {
  useFieldArray,
  useForm,
  Controller,
  UseFormRegister,
  FieldValues,
  UseFormSetValue
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { DirectorySelector } from './directorySelector'
import { RuleName } from './Name'
import { RuleType } from './Type'
import CopyFormat from './copy-file/CopyFormat'
import { RulePath } from '@shared/rules/rulePath'
import { useNavigate } from 'react-router-dom'

const extraDeleteSchema = {
  DeleteExtraPath: z.array(z.string()),
  deleteExtraFileInclude: z.array(z.string()).default([]),
  deleteExtraFileExclude: z.array(z.string()).default([]),
  deleteExtraFolderInclude: z.array(z.string()).default([]),
  deleteExtraFolderExclude: z.array(z.string()).default([])
}

const includeExcludeArrays = {
  fileInclude: z.array(z.string()).default([]),
  fileExclude: z.array(z.string()).default([]),
  folderInclude: z.array(z.string()).default([]),
  folderExclude: z.array(z.string()).default([])
}

const ruleSchema = z.object({
  ruleName: z.string().min(1, 'Required'),
  ruleType: z.enum(['Copy File', 'Mirror']).default('Copy File'),
  copyFrom: z.array(z.string()),
  copyTo: z.array(z.string()),
  copyFilters: z.object(includeExcludeArrays),
  stopAfterProcessing: z.boolean().optional(),
  pauseProcessing: z.boolean().optional(),

  copyFormat: z
    .array(z.enum(['Year', 'Month', 'Day', 'Volume Name', 'File Format', 'Custom']))
    .max(6)
    .optional(),
  customString: z.string().optional(),
  autoClean: z.boolean().optional(),
  deleteExtra: z.boolean().optional(),
  deleteExtraPaths: z.array(z.object(extraDeleteSchema)).default([]),

  cleanTarget: z.boolean().optional(),
  deleteTarget: z.object(includeExcludeArrays).optional()
})

function initIncludeExcldue(setValue: UseFormSetValue<FieldValues>) {
  const emptyStringArray: string[] = []
  setValue('copyFormat', emptyStringArray)
}

type FormData = z.infer<typeof ruleSchema>

type CreateRuleFormType = {
  newRule: boolean
  ruleName: string
  currentRuleValues?: any
}

export default function CreateRuleForm({
  newRule,
  ruleName,
  currentRuleValues
}: CreateRuleFormType) {
  const [loading, setLoading] = useState(true)

  const defaultValues: FormData = {
    ruleName: currentRuleValues?.ruleName || '',
    ruleType: currentRuleValues?.ruleType || 'Copy File',
    copyFrom: currentRuleValues?.copyFrom || [],
    copyTo: currentRuleValues?.copyTo || [],
    copyFilters: currentRuleValues?.copyFilters || {
      fileInclude: [],
      fileExclude: [],
      folderInclude: [],
      folderExclude: []
    },
    stopAfterProcessing: currentRuleValues?.stopAfterProcessing || false,
    pauseProcessing: currentRuleValues?.pauseProcessing || false,

    copyFormat: currentRuleValues?.copyFormat || [],
    customString: currentRuleValues?.customString || '',
    autoClean: currentRuleValues?.autoClean || false,
    deleteExtra: currentRuleValues?.deleteExtra || false,
    deleteExtraPaths: currentRuleValues?.deleteExtraPaths || [],

    cleanTarget: currentRuleValues?.cleanTarget || false,
    deleteTarget: currentRuleValues?.deleteTarget || {
      fileInclude: [],
      fileExclude: [],
      folderInclude: [],
      folderExclude: []
    }
  }

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    register,
    getValues,
    reset,
    getFieldState,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: defaultValues,
    criteriaMode: 'all'
  })

  initIncludeExcldue(register)

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'deleteExtraPaths'
  })

  const [advancedOpen, setAdvancedOpen] = useState(false)

  useEffect(() => {
    console.log('Setvalue copy file')
    setValue('ruleType', 'Copy File')
  }, [setValue])
  const ruleType = watch('ruleType')

  const isDeleteExtraChecked = watch('deleteExtra')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchDataAndSetDefaults = async () => {
      console.log('run await')
      const serverData = await window.electron.getRule(ruleName)
      const mergeData = { ...currentRuleValues, ...serverData }
      // Merge server data with initial values
      reset(mergeData)

      setLoading(false)
    }

    if (!newRule) {
      fetchDataAndSetDefaults()
    } else {
      setLoading(false)
    }
  }, [currentRuleValues, reset])

  const onSubmit = (data) => {
    console.log('Form Data:', data)

    const submitAddRule = async (data) => {
      try {
        if (data.ruleType === 'Copy File') {
          await window.electron.addCopyFileRule(
            data.ruleName,
            data.copyFrom,
            data.copyTo,
            data.copyFilters,
            data.copyFormat,
            data.customString,
            data.autoClean,
            data.deleteExtra,
            data.deleteExtraPaths,
            data.stopAfterProcessing,
            data.pauseProcessing
          )
        } else if (data.ruleType === 'Mirror') {
          await window.electron.addMirrorRule(
            data.ruleName,
            data.copyFrom,
            data.copyTo,
            data.copyFilters,
            data.deleteTarget,
            data.cleanTarget,
            data.stopAfterProcessing,
            data.pauseProcessing
          )
        } else {
          console.error('Failed to match rule type.')
        }
      } catch (error) {
        console.error('Failed to fetch list:', error)
      }
    }

    const submitEditRule = async (data) => {
      try {
        if (data.ruleType === 'Copy File') {
          await window.electron.modifyCopyFileRule(
            ruleName,
            data.ruleName,
            data.copyFrom,
            data.copyTo,
            data.copyFilters,
            data.copyFormat,
            data.customString,
            data.autoClean,
            data.deleteExtra,
            data.deleteExtraPaths,
            data.stopAfterProcessing,
            data.pauseProcessing
          )
        } else if (data.ruleType === 'Mirror') {
          await window.electron.modifyMirrorRule(
            ruleName,
            data.ruleName,
            data.copyFrom,
            data.copyTo,
            data.copyFilters,
            data.deleteTarget,
            data.cleanTarget,
            data.stopAfterProcessing,
            data.pauseProcessing
          )
        } else {
          console.error('Failed to match rule type.')
        }
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
      <DirectorySelector
        watch={watch}
        setValue={setValue}
        directory="copyFrom"
        buttonText="Select Copy From"
      />
      <DirectorySelector
        watch={watch}
        setValue={setValue}
        directory="copyTo"
        buttonText="Select Copy To"
      />
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
              name="stopAfterProcessing"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              )}
            />{' '}
            Confirm before actions
          </label>
          <label>
            <Controller
              name="pauseProcessing"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              )}
            />{' '}
            Pause Rule
          </label>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <DynamicList
              label="File Include"
              name="copyFilters.fileInclude"
              setValue={setValue}
              getValues={getValues}
            />
            <DynamicList
              label="File Exclude"
              name="copyFilters.fileExclude"
              setValue={setValue}
              getValues={getValues}
            />
            <DynamicList
              label="Folder Include"
              name="copyFilters.folderInclude"
              setValue={setValue}
              getValues={getValues}
            />
            <DynamicList
              label="Folder Exclude"
              name="copyFilters.folderExclude"
              setValue={setValue}
              getValues={getValues}
            />
          </motion.div>
        </div>
      )}

      {ruleType === 'Copy File' && (
        <Card>
          <CardContent>
            <CopyFormat control={control} setValue={setValue} watch={watch} />
            <Controller
              name="customString"
              control={control}
              defaultValue={''}
              render={({ field }) => <Input placeholder="Custom String" {...field} />}
            />
            <label>
              <Controller
                name="autoClean"
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
                <Controller
                  name="deleteExtra"
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
                        <DirectorySelector
                          watch={watch}
                          setValue={setValue}
                          directory={`deleteExtraPaths.${index}.DeleteExtraPath`}
                          buttonText={`Select Delete Extra Path ${index + 1}`}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <DynamicList
                            label="File Include"
                            name={`deleteExtraPaths.${index}.deleteExtraFileInclude`}
                            setValue={setValue}
                            getValues={getValues}
                          />
                          <DynamicList
                            label="File Exclude"
                            name={`deleteExtraPaths.${index}.deleteExtraFileExclude`}
                            setValue={setValue}
                            getValues={getValues}
                          />
                          <DynamicList
                            label="Folder Include"
                            name={`deleteExtraPaths.${index}.deleteExtraFolderInclude`}
                            setValue={setValue}
                            getValues={getValues}
                          />
                          <DynamicList
                            label="Folder Exclude"
                            name={`deleteExtraPaths.${index}.deleteExtraFolderExclude`}
                            setValue={setValue}
                            getValues={getValues}
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
                      () => append({}) // Add a new empty object to create another card
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
              <Controller
                name="cleanTarget"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                )}
              />{' '}
              Clean Target
            </label>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <DynamicList
                label="File Include"
                name="deleteTarget.fileInclude"
                setValue={setValue}
                getValues={getValues}
              />
              <DynamicList
                label="File Exclude"
                name="deleteTarget.fileExclude"
                setValue={setValue}
                getValues={getValues}
              />
              <DynamicList
                label="Folder Include"
                name="deleteTarget.folderInclude"
                setValue={setValue}
                getValues={getValues}
              />
              <DynamicList
                label="Folder Exclude"
                name="deleteTarget.folderExclude"
                setValue={setValue}
                getValues={getValues}
              />
            </motion.div>
          </CardContent>
        </Card>
      )}
      {errors.ruleName && <p className="text-red-500">{errors.ruleName.message}</p>}
      {errors.ruleType && <p className="text-red-500">{errors.ruleType.message}</p>}
      {errors.copyFrom && <p className="text-red-500">{errors.copyFrom.message}</p>}
      {errors.copyTo && <p className="text-red-500">{errors.copyTo.message}</p>}
      {errors.copyFilters && <p className="text-red-500">{errors.copyFilters.message}</p>}
      {errors.copyFormat && <p className="text-red-500">{errors.copyFormat.message}</p>}
      {errors.customString && <p className="text-red-500">{errors.customString.message}</p>}
      {errors.autoClean && <p className="text-red-500">{errors.autoClean.message}</p>}
      {errors.deleteExtra && <p className="text-red-500">{errors.deleteExtra.message}</p>}
      {errors.deleteExtraPaths && <p className="text-red-500">{errors.deleteExtraPaths.message}</p>}
      {errors.cleanTarget && <p className="text-red-500">{errors.cleanTarget.message}</p>}
      {errors.deleteTarget && <p className="text-red-500">{errors.deleteTarget.message}</p>}
      {newRule && <Button type="submit">Create Rule</Button>}
      {!newRule && <Button type="submit">Edit Rule</Button>}
    </form>
  )
}

type DynamicListType = {
  label: string
  name: string
  setValue: any
  getValues: any
}

function DynamicList({ label, name, setValue, getValues }: DynamicListType) {
  console.log('Dynamic Lsit:', name)

  const [newItem, setNewItem] = useState('')

  const initialCurrentList: string[] = getValues(name)
  setValue(name, initialCurrentList)
  console.log('newCurrentlist: ', initialCurrentList)

  const [currentItems, setCurrentItems] = useState<string[]>(initialCurrentList)

  // Add to include file list
  const addToList = () => {
    if (newItem.trim()) {
      const newCurrentList: string[] = [...currentItems, newItem.trim()]
      setValue(name, newCurrentList)
      setCurrentItems(newCurrentList)
      setNewItem('')
    }
  }

  // Remove from include file list
  const removeFromList = (index) => {
    const newCurrentList = currentItems.filter((_, i) => i !== index)
    setValue(name, newCurrentList)
    setCurrentItems(newCurrentList)
  }

  return (
    <div>
      <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} />
      <Button type="button" onClick={() => addToList()}>
        Add Item
      </Button>

      <p>{label}</p>

      {currentItems.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input value={item} readOnly />
          <Button type="button" onClick={() => removeFromList(index)}>
            Remove
          </Button>
        </div>
      ))}
    </div>
  )
}
