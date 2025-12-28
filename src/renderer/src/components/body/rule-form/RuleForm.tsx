import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/components/ui/collapsible'
import { Form } from '@renderer/components/ui/form'
import { Separator } from '@renderer/components/ui/separator'
import { FullRule, STORE_RULE_DEFAULT_VALUES, StoreRule } from '@shared-all/types/ruleTypes'
import { STORE_RULE_ZOD_SCHEMA } from '@shared-all/validation/validateRule'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Resolver, useForm, UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import GeneralAdvancedSettings from './advanced/GeneralAdvancedSettings'
import CopyFileSettings from './copy-file/CopyFileSettings'
import { FolderSelector } from './FolderSelector'
import MirrorSettings from './mirror/MirrorSettings'
import RuleFormLoading from './RuleFormLoading'
import { RuleName } from './RuleName'
import { RuleType } from './RuleType'

const fileName = 'RuleForm.tsx'
const area = 'rule-form'

export function RuleForm({
  newRule,
  initialRuleName = '',
  showDisableRule = true
}: {
  newRule: boolean
  initialRuleName?: string
  showDisableRule?: boolean
}): React.ReactElement {
  const funcName = 'RuleForm'
  log.rend(funcName, fileName, area)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [openAdvancedSettings, setOpenAdvancedSettings] = useState(false)

  const navigate = useNavigate()

  const form: UseFormReturn<StoreRule> = useForm<StoreRule>({
    resolver: zodResolver(STORE_RULE_ZOD_SCHEMA) as Resolver<StoreRule>,
    criteriaMode: 'all',
    mode: 'onSubmit'
  })

  const { control, handleSubmit, watch, reset } = form

  const ruleType = watch('type')

  useEffect(() => {
    log.cond('useEffect: Set form defaults', funcName, fileName, area)

    const fetchRuleSetDefaults = async (): Promise<void> => {
      log.ipcSent(`Request rule data: ${initialRuleName}`, funcName, fileName, area)
      const fullRuleData: FullRule | undefined = await window.electron.getRule(initialRuleName)
      log.ipcRec('Rule data received', funcName, fileName, area, fullRuleData)

      reset(fullRuleData)
      setLoading(false)
    }

    if (!newRule) {
      log.cond('Request rule data- Set defaults', funcName, fileName, area)
      void fetchRuleSetDefaults()
    } else {
      log.cond('No loading needed', funcName, fileName, area)
      reset(STORE_RULE_DEFAULT_VALUES)
      setLoading(false)
    }
  }, [])

  const onSubmit = (ruleData: StoreRule): void => {
    log.cond('Rule-Form Submitted', funcName, fileName, area)

    const submitAddRule = async (ruleData: StoreRule): Promise<void> => {
      try {
        log.ipcSent('add-rule', funcName, fileName, area, ruleData)
        window.electron.addRule(ruleData)
      } catch (error) {
        log.error(`Failed to fetch list: ${error}`, funcName, fileName, area)
      }
    }

    const submitEditRule = async (ruleData: StoreRule): Promise<void> => {
      try {
        log.ipcSent('edit-rule', funcName, fileName, area, ruleData)
        window.electron.modifyRule(initialRuleName, ruleData)
      } catch (error) {
        log.error(`Failed to fetch list: ${error}`, funcName, fileName, area)
      }
    }

    if (newRule) {
      log.cond('Add Rule', funcName, fileName, area)
      void submitAddRule(ruleData)
    } else {
      log.cond('Edit Rule', funcName, fileName, area)
      void submitEditRule(ruleData)
    }

    void navigate(`/`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any): void => {
    setError(true)
    console.log('Zod Errors:', errors)
  }

  if (loading) {
    log.cond('Loading rule info', funcName, fileName, area)
    return <RuleFormLoading />
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="w-full px-10 py-2 ">
        <div className="flex flex-row w-full">
          <RuleType control={control} />
          <RuleName control={control} />
        </div>

        <div className="flex flex-row items-start w-full justify-center mt-6 relative">
          <FolderSelector
            control={control}
            name="origin"
            buttonText="Select Origin Folder"
            label="Origin Folder"
            toolTip="Folder to copy from"
          />
          <Separator orientation="vertical" className="absolute top-0 bottom-0 left-1/2" />
          <FolderSelector
            control={control}
            name="target"
            buttonText="Select Target Folder"
            label="Target Folder"
            toolTip="Folder to copy to"
          />
        </div>

        <Collapsible open={openAdvancedSettings} onOpenChange={setOpenAdvancedSettings}>
          <CollapsibleTrigger className="w-full cursor-pointer" asChild>
            <Button className="shadow-transparent justify-start mt-3 bg-transparent text-gray-700 hover:text-black hover:bg-transparent">
              {openAdvancedSettings ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              Advanced Settings
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1">
            <GeneralAdvancedSettings control={control} showDisableRule={showDisableRule} />
            {ruleType === 'Copy File' && <CopyFileSettings control={control} watch={watch} />}
            {ruleType === 'Mirror' && <MirrorSettings control={control} />}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="mt-2 mb-4" />
        {error && (
          <div className="text-destructive text-sm">Some rule configuration is not valid</div>
        )}
        <div className="flex justify-center mb-4">
          <Button type="submit" className="text-2xl px-4 mt-3 py-6 font-bold cursor-pointer">
            {newRule ? 'Create Rule' : 'Edit Rule'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RuleForm
