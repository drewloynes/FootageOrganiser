import { Progress } from '@renderer/components/ui/progress'
import {
  FullRule,
  RULE_STATUS_TYPE,
  ShortRule,
  UNEVALUATABLE_REASON
} from '@shared/types/ruleTypes'
import { CircleAlert, Info } from 'lucide-react'

const fileName: string = 'RuleActionsAndErrors.tsx'
const area: string = 'rule-utils'

export function RuleActionsAndErrors({ rule }: { rule: ShortRule | FullRule }) {
  const funcName: string = 'RuleActionsAndErrors'
  log.rend(funcName, fileName, area)

  return (
    <div>
      {rule.error !== '' && (
        <div>
          <div className="w-[100%] h-[1px] bg-gray-300 mt-3 mb-3" />
          <div className="flex flex-row items-center ml-4 mr-4">
            <h3 className="text-white text-xl text-left bg-red-700 py-1 px-2 rounded-[10px] mr-3 flex flex-row items-center">
              <CircleAlert className="mr-2 !size-[35px]" />
              Problem
            </h3>
            <div className="flex items-center break-all">{rule.error}</div>
          </div>
        </div>
      )}
      {rule.error === '' &&
        (rule.unevaluateableReason === UNEVALUATABLE_REASON.ZERO_EXISTING_ORIGIN_PATHS ||
          rule.unevaluateableReason === UNEVALUATABLE_REASON.ZERO_EXISTING_TARGET_PATHS) && (
          <div>
            <div className="w-[100%] h-[1px] bg-gray-300 mt-4 mb-3" />
            <div className="flex flex-row items-center ml-4 mr-4">
              <h3 className="text-white text-xl text-left bg-gray-600 rounded-[30px] mr-3 flex flex-row items-center">
                <Info className="!size-[25px]" />
              </h3>
              <div className="flex items-center text-sm break-all">
                Can't find origin / target folder
              </div>
            </div>
          </div>
        )}
      {rule.error === '' &&
        rule.unevaluateableReason === UNEVALUATABLE_REASON.MIRROR_MULTIPLE_ORIGIN_PATHS && (
          <div>
            <div className="w-[100%] h-[1px] bg-gray-300 mt-4 mb-3" />
            <div className="flex flex-row items-center ml-4 mr-4">
              <h3 className="text-white text-xl text-left bg-gray-600 rounded-[30px] mr-3 flex flex-row items-center">
                <Info className="!size-[25px]" />
              </h3>
              <div className="flex items-center text-sm break-all">
                There are multiple origin paths for a mirror rule - This is not allowed.
              </div>
            </div>
          </div>
        )}
      {rule.error === '' &&
        rule.unevaluateableReason === UNEVALUATABLE_REASON.NO_PROBLEM &&
        rule.status === RULE_STATUS_TYPE.CHECKSUM_RUNNING &&
        rule.checksumAction !== '' && (
          <div>
            <div className="w-[100%] h-[1px] bg-gray-300 mt-4 mb-3" />
            <div className="flex flex-row items-center ml-4 mr-4">
              <div className="flex items-center text-[12px] text-gray-600 break-all">
                {rule.checksumAction}
              </div>
            </div>
          </div>
        )}
      {rule.error === '' &&
        rule.unevaluateableReason === UNEVALUATABLE_REASON.NO_PROBLEM &&
        rule.status === RULE_STATUS_TYPE.EXECUTING_ACTIONS && (
          <div>
            <div className="w-[100%] h-[1px] bg-gray-300 mt-4 mb-3" />
            <div className="flex flex-col items-center ml-4 mr-4">
              <div className="flex items-center text-[12px] text-gray-600 break-all mb-2">
                {rule.executingAction}
              </div>
              <Progress value={rule.actionsProgress} className="h-4 bg-muted mb-1" />
              <div className="text-[14px]">{rule.actionsProgress}%</div>
            </div>
          </div>
        )}
    </div>
  )
}
