import { Badge } from '@components/ui/badge'
import { Button } from '@components/ui/button'
import { ScrollArea } from '@components/ui/scroll-area'
import { RULE_STATUS_TYPE, ShortRule } from '@shared/types/ruleTypes'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActivateDisableSmall } from '../rule-utils/ActivateDisable'
import { RuleActionsAndErrors } from '../rule-utils/RuleActionsAndErrors'
import { StartStopSmall } from '../rule-utils/StartStop'
import ViewAllRulesEmpty from './ViewAllRulesEmpty'
import ViewAllRulesLoading from './ViewAllRulesLoading'

const fileName: string = 'ViewAllRules.tsx'
const area: string = 'body'

const ViewAllRules = () => {
  const funcName: string = 'ViewAllRules'
  log.rend(funcName, fileName, area)

  const [allRules, setAllRules] = useState<ShortRule[]>([])
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    log.cond('useEffect: Start startAllRulesStream', funcName, fileName, area)

    function handleAllRules(latestAllRules: ShortRule[]) {
      log.ipcRec('Received Latest All Rules', funcName, fileName, area, allRules)
      setAllRules(latestAllRules)

      if (loading) {
        log.cond('End loading screen', funcName, fileName, area)
        setLoading(false)
      }
    }

    log.ipcSent(`start-all-rules-stream`, funcName, fileName, area)
    window.electron.startAllRulesStream()
    log.ipcSent(`Setup onAllRules Handle`, funcName, fileName, area)
    window.electron.onAllRules(handleAllRules)

    return () => {
      log.ipcSent(`Destroy onAllRules Handle`, funcName, fileName, area)
      window.electron.removeListenerAllRules(handleAllRules)
      log.ipcSent(`stop-all-rules-stream`, funcName, fileName, area)
      window.electron.stopAllRulesStream()
    }
  }, [])

  if (loading) {
    log.cond('Loading Rules', funcName, fileName, area)
    return <ViewAllRulesLoading />
  }

  return (
    <ScrollArea className="flex-1 p-2 px-6 text-center h-1">
      {allRules.length > 0 ? (
        <div>
          {allRules.map((item, index) => (
            <div key={index} className=" items-center border rounded-lg shadow-md p-4 w-full mb-5">
              <div className="flex flex-1 flex-row-reverse items-center">
                <div className="flex flex-col align-bottom w-[230px]">
                  <div className="text-gray-500 text-xs mb-2 text-left">Rule Management</div>
                  <div className="flex">
                    <Button
                      className="cursor-pointer px-8 h-14 w-[170px] align-middle bg-gray-200 border-1 border-gray-300 text-gray-600 hover:text-white mr-[10px] text-[18px]"
                      onClick={() => navigate(`/edit-rule/${item.name}`)}
                    >
                      <Pencil className="!size-[25px]" />
                      Edit
                    </Button>
                    <ActivateDisableSmall
                      rule={item}
                      allRules={allRules}
                      setAllRules={setAllRules}
                    />
                  </div>
                </div>

                <div className="h-22 w-[2px] bg-gray-300 mx-4"></div>

                {(item.status === RULE_STATUS_TYPE.AWAITING_APPROVAL ||
                  item.status === RULE_STATUS_TYPE.QUEUED_ACTIONS ||
                  item.status === RULE_STATUS_TYPE.EXECUTING_ACTIONS) && (
                  <div className="flex flex-row-reverse">
                    <StartStopSmall rule={item} allRules={allRules} setAllRules={setAllRules} />
                    <div className="h-22 w-[1px] bg-gray-300 mx-4"></div>
                  </div>
                )}

                <div className="flex flex-col justify-center items-center w-full">
                  <h2 className="text-2xl  text-center text-black font-semibold rounded-xl break-all border-b-1 border-t-1 p-2 border-gray-200 mb-2">
                    {item.name}
                  </h2>
                  <Badge className="text-xl py-2 px-4 font-bold">{item.status}</Badge>
                </div>
              </div>
              <RuleActionsAndErrors rule={item} />
            </div>
          ))}
        </div>
      ) : (
        <ViewAllRulesEmpty />
      )}
    </ScrollArea>
  )
}

export default ViewAllRules
