import { Button } from '@renderer/components/ui/button'
import { FullRule } from '@shared/types/ruleTypes'
import { Pause, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ActionCopyList, ActionList } from './ViewActionsList'
import ViewActionsLoading from './ViewActionsLoading'

const fileName: string = 'ViewActions.tsx'
const area: string = 'view-actions'

export default function ViewActions() {
  const funcName: string = 'ViewActions'
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
    return <ViewActionsLoading />
  }

  return (
    <div className="p-4 space-y-4  h-[calc(100%-100px)]">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="cursor-pointer text-xl"
        >
          Back
        </Button>

        {rule.enableStartStopActions && !rule.startActions && (
          <Button
            className="px-3 py-1 ml-4 mr-0 cursor-pointer rounded-full text-xl bg-green-700  hover:bg-green-600 text-white flex flex-row items-center font-bold"
            onClick={() => {
              window.electron.startRule(rule.name)
              navigate(`/`)
            }}
          >
            <Play className="!size-[30px]" />
            Start
          </Button>
        )}
        {rule.enableStartStopActions && rule.startActions && (
          <Button
            className="text-xl px-3 py-1 ml-4 mr-0 cursor-pointer rounded-full bg-red-700  hover:bg-red-600 text-white flex flex-row items-center font-bold"
            onClick={() => {
              window.electron.stopRule(rule.name)
              navigate(`/`)
            }}
          >
            <Pause className="!size-[30px]" />
            Stop
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full w-full">
        <ActionCopyList title="Files To Copy" actions={rule.fileCopyActionQueue} />
        <ActionList title="Files To Delete" actions={rule.fileDeleteActionQueue} />
        <ActionList title="Folders To Create" actions={rule.dirMakeActionQueue} />
        <ActionList title="Folders To Delete" actions={rule.dirDeleteActionQueue} />
      </div>
    </div>
  )
}
