import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@renderer/components/ui/tooltip'
import { FullRule, ShortRule } from '@shared-all/types/ruleTypes'
import { Power, PowerOff } from 'lucide-react'

const fileName: string = 'ActivateDisable.tsx'
const area: string = 'rule-utils'

export function ActivateDisableSmall({
  rule,
  allRules,
  setAllRules
}: {
  rule: ShortRule
  allRules: ShortRule[]
  setAllRules: React.Dispatch<ShortRule[]>
}) {
  const funcName: string = 'ActivateDisableSmall'
  log.rend(funcName, fileName, area)

  return (
    <div>
      {rule.disabled && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="cursor-pointer p-3 bg-gray-900 hover:bg-white hover:text-black text-white rounded-full "
              onClick={() => {
                log.ipcSent(`activate-rule ${rule.name}`, funcName, fileName, area)
                window.electron.activateRule(rule.name)
                setAllRules(
                  allRules.map((testRule) =>
                    testRule.name === rule.name ? { ...testRule, disabled: false } : testRule
                  )
                )
              }}
            >
              <Power className="!size-[30px]" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Activate</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {!rule.disabled && !rule.awaitingChanges && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="cursor-pointer p-3 bg-transparent hover:bg-black hover:text-white text-black rounded-full"
              onClick={() => {
                log.ipcSent(`disable-rule ${rule.name}`, funcName, fileName, area)
                window.electron.disableRule(rule.name)
                setAllRules(
                  allRules.map((testRule) =>
                    testRule.name === rule.name ? { ...testRule, disabled: true } : testRule
                  )
                )
              }}
            >
              <PowerOff className="!size-[30px]" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Disable</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {!rule.disabled && rule.awaitingChanges && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-pointer p-3 bg-gray-600 text-white rounded-full">
              <PowerOff className="!size-[30px]" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Cant Disable Rule Right Now</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

export function ActivateDisableBig({
  rule,
  setRule
}: {
  rule: FullRule
  setRule: React.Dispatch<FullRule>
}) {
  const funcName: string = 'ActivateDisableBig'
  log.rend(funcName, fileName, area)

  return (
    <div>
      {rule.disabled && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="cursor-pointer p-3 bg-gray-900 hover:bg-white hover:text-black text-white rounded-full flex flex-row items-center font-bold"
              onClick={() => {
                window.electron.activateRule(rule.name)
                setRule({ ...rule, disabled: false })
              }}
            >
              <Power className="!size-[30px] mr-3" />
              Activate
            </TooltipTrigger>
            <TooltipContent>Activate Rule</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {!rule.disabled && !rule.awaitingChanges && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className="cursor-pointer p-3 bg-transparent hover:bg-black hover:text-white text-black rounded-full flex flex-row items-center font-bold border-1 border-black"
              onClick={() => {
                window.electron.disableRule(rule.name)
                setRule({ ...rule, disabled: true })
              }}
            >
              <PowerOff className="!size-[30px] mr-3" />
              Disable
            </TooltipTrigger>
            <TooltipContent>
              <p>Disable Rule</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {!rule.disabled && rule.awaitingChanges && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-pointer p-3 text-white bg-gray-600 rounded-full flex flex-row items-center font-bold border-1 border-black">
              <PowerOff className="!size-[30px] mr-3" />
              Disable
            </TooltipTrigger>
            <TooltipContent>
              <p>Cant Disable Rule Right Now</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
