import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/components/ui/collapsible'
import { Form } from '@renderer/components/ui/form'
import { Separator } from '@renderer/components/ui/separator'
import { FullRule, StoreRule } from '@shared/types/ruleTypes'
import { STORE_RULE_ZOD_SCHEMA } from '@shared/validation/validateRule'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Resolver, useForm, UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import GeneralAdvancedSettings from './advanced/GeneralAdvancedSettings'
import CopyFileSettings from './copy-file/CopyFileSettings'
import { DirectorySelector } from './DirectorySelector'
import MirrorSettings from './mirror/MirrorSettings'
import RuleFormLoading from './RuleFormLoading'
import { RuleName } from './RuleName'
import { RuleType } from './RuleType'

const fileName: string = 'RuleForm.tsx'
const area: string = 'rule-form'

export function RuleForm({
  newRule,
  initialRuleName = '',
  showDisableRule = true
}: {
  newRule: boolean
  initialRuleName?: string
  showDisableRule?: boolean
}) {
  const funcName: string = 'RuleForm'
  log.rend(funcName, fileName, area)

  const [loading, setLoading] = useState(true)
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

    const fetchRuleSetDefaults = async () => {
      log.ipcSent(`Request rule data: ${initialRuleName}`, funcName, fileName, area)
      const fullRuleData: FullRule | undefined = await window.electron.getRule(initialRuleName)
      log.ipcRec('Rule data received', funcName, fileName, area, fullRuleData)

      reset(fullRuleData)
      setLoading(false)
    }

    if (!newRule) {
      log.cond('Request rule data- Set defaults', funcName, fileName, area)
      fetchRuleSetDefaults()
    }
  }, [])

  const onSubmit = (ruleData: StoreRule) => {
    log.cond('Rule-Form Submitted', funcName, fileName, area)

    const submitAddRule = async (ruleData: StoreRule) => {
      try {
        log.ipcSent('add-rule', funcName, fileName, area, ruleData)
        window.electron.addRule(ruleData)
      } catch (error) {
        log.error(`Failed to fetch list: ${error}`, funcName, fileName, area)
      }
    }

    const submitEditRule = async (ruleData: StoreRule) => {
      try {
        log.ipcSent('edit-rule', funcName, fileName, area, ruleData)
        window.electron.modifyRule(initialRuleName, ruleData)
      } catch (error) {
        log.error(`Failed to fetch list: ${error}`, funcName, fileName, area)
      }
    }

    if (newRule) {
      log.cond('Add Rule', funcName, fileName, area)
      submitAddRule(ruleData)
    } else {
      log.cond('Edit Rule', funcName, fileName, area)
      submitEditRule(ruleData)
    }

    navigate(`/`)
  }

  const onError = (errors: any) => {
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
          <DirectorySelector
            control={control}
            name="origin"
            buttonText="Select Origin Folder"
            label="Origin Folder"
            toolTip="Folder to copy from"
          />
          <Separator orientation="vertical" className="absolute top-0 bottom-0 left-1/2" />
          <DirectorySelector
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

        {!open && <Separator className="mt-2 mb-4" />}
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
