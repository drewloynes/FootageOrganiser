import { Button } from '@renderer/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { FullRule, ShortRule } from '@shared/types/ruleTypes'
import { Pause, Play, Rows4 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const fileName: string = 'StartStop.tsx'
const area: string = 'rule-utils'

export function StartStopSmall({
  rule,
  allRules,
  setAllRules
}: {
  rule: ShortRule
  allRules: ShortRule[]
  setAllRules: React.Dispatch<ShortRule[]>
}) {
  const funcName: string = 'StartStopSmall'
  log.rend(funcName, fileName, area)

  const navigate = useNavigate()

  return (
    <div className="flex flex-col  ">
      <div className="text-gray-500 text-xs mb-2 justify-star text-left">Action Management</div>
      <div className="flex items-center">
        <Button
          className="cursor-pointer px-8 h-14 w-[150px]  align-middle bg-gray-200 border-1 border-gray-300 text-gray-600 hover:text-white mr-[13px]  text-[15px] mx-0"
          onClick={() => navigate(`/approval-list/${rule.name}`)}
        >
          <Rows4 className="!size-[25px]" />
          View <br />
          Actions
        </Button>
        {rule.enableStartStopActions && !rule.startActions && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="p-3 ml-4 mr-0 cursor-pointer rounded-full bg-green-700  hover:bg-green-600 text-white "
                onClick={() => {
                  log.ipcSent(`start-rule ${rule.name}`, funcName, fileName, area)
                  window.electron.startRule(rule.name)
                  setAllRules(
                    allRules.map((testRule) =>
                      testRule.startActions === rule.startActions
                        ? { ...testRule, startActions: true }
                        : testRule
                    )
                  )
                }}
              >
                <Play className="!size-[30px]" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Start Executing Actions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {rule.enableStartStopActions && rule.startActions && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className=" p-3 ml-4 mr-0 cursor-pointer rounded-full bg-red-700  hover:bg-red-600 text-white "
                onClick={() => {
                  log.ipcSent(`stop-rule ${rule.name}`, funcName, fileName, area)
                  window.electron.stopRule(rule.name)
                  setAllRules(
                    allRules.map((testRule) =>
                      testRule.startActions === rule.startActions
                        ? { ...testRule, startActions: false }
                        : testRule
                    )
                  )
                }}
              >
                <Pause className="!size-[30px]" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Stop Executing Actions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}

export function StartStopBig({
  rule,
  setRule
}: {
  rule: FullRule
  setRule: React.Dispatch<FullRule>
}) {
  const funcName: string = 'StartStopBig'
  log.rend(funcName, fileName, area)

  const navigate = useNavigate()

  return (
    <div className="flex flex-row w-full justify-start">
      <Button
        className="cursor-pointer px-14 h-14 w-[240px]  align-middle bg-gray-200 border-1 border-gray-300 text-gray-600 hover:text-white mr-[13px]  text-[15px] mx-0"
        onClick={() => navigate(`/approval-list/${rule.name}`)}
      >
        <Rows4 className="!size-[25px]" />
        View Pending Actions
      </Button>
      {rule.enableStartStopActions && !rule.startActions && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="p-3 ml-4 mr-0 cursor-pointer rounded-full bg-green-700  hover:bg-green-600 text-white flex flex-row items-center font-bold"
              onClick={() => {
                window.electron.startRule(rule.name)
                setRule({ ...rule, startActions: true })
              }}
            >
              <Play className="!size-[30px]" />
              Start
            </TooltipTrigger>
            <TooltipContent>
              <p>Start Executing Actions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {rule.enableStartStopActions && rule.startActions && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className=" p-3 ml-4 mr-0 cursor-pointer rounded-full bg-red-700  hover:bg-red-600 text-white flex flex-row items-center font-bold"
              onClick={() => {
                window.electron.stopRule(rule.name)
                setRule({ ...rule, startActions: false })
              }}
            >
              <Pause className="!size-[30px]" />
              Stop
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop Executing Actions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
