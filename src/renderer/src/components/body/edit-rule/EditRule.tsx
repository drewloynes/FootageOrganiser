import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@renderer/components/ui/alert-dialog'
import { Badge } from '@renderer/components/ui/badge'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Separator } from '@renderer/components/ui/separator'
import { FullRule, RULE_STATUS_TYPE } from '@shared-all/types/ruleTypes'
import { Delete } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RuleForm from '../rule-form/RuleForm'
import { ActivateDisableBig } from '../rule-utils/ActivateDisable'
import { RuleActionsAndErrors } from '../rule-utils/RuleActionsAndErrors'
import { StartStopBig } from '../rule-utils/StartStop'
import EditRuleAwaitingChangesForm from './EditRuleAwaitingChangesForm'
import EditRuleLoading from './EditRuleLoading'

const fileName: string = 'EditRule.tsx'
const area: string = 'edit-rule'

export function EditRule() {
  const funcName: string = 'EditRule'
  log.rend(funcName, fileName, area)

  let { ruleName } = useParams<{ ruleName: string }>()

  const [rule, setRule] = useState<FullRule>()

  const navigate = useNavigate()

  if (ruleName === undefined) {
    log.cond('Rule name not defined', funcName, fileName, area)
    ruleName = ''
    navigate(`/`)
  }

  useEffect(() => {
    log.cond('useEffect: Start startRuleStream', funcName, fileName, area)

    function handleRule(rule: FullRule): void {
      log.ipcRec('Received latest rule', funcName, fileName, area, rule)
      setRule(rule)
    }

    log.ipcSent(`start-rule-stream`, funcName, fileName, area)
    window.electron.startRuleStream(ruleName)
    log.ipcSent(`Setup onRule Handle`, funcName, fileName, area)
    window.electron.onRule(handleRule)

    return () => {
      log.ipcSent(`Destroy onRule Handle`, funcName, fileName, area)
      window.electron.removeListenerRule(handleRule)
      log.ipcSent(`stop-every-rule-stream`, funcName, fileName, area)
      window.electron.stopEveryRuleStream()
    }
  }, [])

  if (!rule) {
    log.cond('Loading Rules', funcName, fileName, area)
    return <EditRuleLoading />
  }

  return (
    <div className="h-full text-center flex flex-col grow min-h-0">
      <div className="flex px-4 border-b-gray-200 items-stretch">
        <div className="text-4xl font-bold mr-6 ml-9 text-gray-700 ">Edit </div>
        <div className="flex items-stretch">
          <Separator orientation="vertical" className="mx-6" />
        </div>
        <div className="text-3xl font-extrabold mx-auto"> {ruleName}</div>
        <Badge className="text-xl py-2 px-4 font-bold">{rule.status}</Badge>
      </div>

      <Separator className="mt-4 my-4" />

      <div className="flex flex-row-reverse gap-3 px-4">
        <AlertDialog>
          <AlertDialogTrigger className="cursor-pointer p-3 bg-red-600 text-white hover:bg-red-500 font-bold rounded-full flex flex-row items-center">
            <Delete className="!size-[30px] mr-3" />
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this rule.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  window.electron.deleteRule(ruleName)
                  navigate(`/`)
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <ActivateDisableBig rule={rule} setRule={setRule} />

        {(rule.status === RULE_STATUS_TYPE.AWAITING_APPROVAL ||
          rule.status === RULE_STATUS_TYPE.QUEUED_ACTIONS ||
          rule.status === RULE_STATUS_TYPE.EXECUTING_ACTIONS) && (
          <StartStopBig rule={rule} setRule={setRule} />
        )}
      </div>

      <RuleActionsAndErrors rule={rule} />
      <Separator className="mt-4 mb-0 bg-gray-300" />

      <ScrollArea className="flex-1 px-6 text-center min-h-0">
        {!rule.awaitingChanges && (
          <RuleForm newRule={false} initialRuleName={ruleName} showDisableRule={false} />
        )}
        {rule.awaitingChanges && <EditRuleAwaitingChangesForm />}
      </ScrollArea>
    </div>
  )
}

export default EditRule
