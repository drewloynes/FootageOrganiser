import { RULE_STATUS_TYPE, ShortRule, UNEVALUATABLE_REASON } from '@shared/types/ruleTypes'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Progress } from '../ui/progress'

const fileName: string = 'ViewAllRules.tsx'
const area: string = 'body'

const ViewAllRules = () => {
  const funcName: string = 'ViewAllRules'
  log.rend(funcName, fileName, area)

  const [items, setItems] = useState<ShortRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Start startAllRulesStream')
    window.electron.startAllRulesStream()

    function handleAllRules(allRules: ShortRule[]) {
      console.log('Received rules')
      console.log(allRules)
      setItems(allRules)

      if (loading) {
        setLoading(false)
      }
    }

    window.electron.onAllRules(handleAllRules)

    return () => {
      console.log('Stop stoptAllRulesStream')
      window.electron.removeListenerAllRules(handleAllRules)
      window.electron.stopAllRulesStream()
    }
  }, [])

  const navigate = useNavigate()

  if (loading) {
    return <div className="text-black">Loading</div>
  }

  return (
    <main className="flex-1 p-6 text-center">
      <h2 className="text-2xl font-bold mb-4 text-black">Rule List</h2>
      {items.length > 0 ? (
        <div>
          <button
            className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
            onClick={() => window.electron.evaluateAllRules()}
          >
            Reevaluate All
          </button>
          <ul className="list-disc">
            {items.map((item, index) => (
              <li key={index} className="text-lg">
                <div className="flex items-center border rounded-lg shadow-md p-4 w-full max-w-lg bg-white">
                  <div className="flex">
                    {/* Left Side: Name & Button */}
                    <div className="flex flex-col items-start w-1/3">
                      <h2 className="text-lg font-semibold text-black">{item.name}</h2>
                      <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => navigate(`/edit-rule/${item.name}`)}
                      >
                        Edit Rule
                      </button>
                    </div>

                    {/* Divider Line */}
                    <div className="h-16 w-[2px] bg-gray-300 mx-4"></div>

                    {/* Right Side: Description */}
                    <div className="flex-1">
                      <p className="text-gray-700">{item.status}</p>
                    </div>
                    <div>
                      {item.enableStartStopActions &&
                        item.status === RULE_STATUS_TYPE.AWAITING_APPROVAL && (
                          <div>
                            <button
                              className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                              onClick={() => {
                                console.log('Pressed view pending work')
                                navigate(`/approval-list/${item.name}`)
                              }}
                            >
                              View Pending Work
                            </button>
                            <div className="h-16 w-[2px] bg-gray-300 mx-4"></div>
                            <button
                              className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                              onClick={() => {
                                window.electron.startRule(item.name)
                                setItems((prevItems: any) =>
                                  prevItems.map((rule) =>
                                    rule.ruleName === item.name
                                      ? { ...rule, startActions: true }
                                      : rule
                                  )
                                )
                              }}
                            >
                              Run Rule
                            </button>
                          </div>
                        )}
                    </div>
                    <div>
                      {item.enableStartStopActions &&
                        (item.status === RULE_STATUS_TYPE.EXECUTING_ACTIONS ||
                          item.status === RULE_STATUS_TYPE.QUEUED_ACTIONS) && (
                          <div>
                            <button
                              className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                              onClick={() => {
                                console.log('Pressed view pending work')
                                navigate(`/approval-list/${item.name}`)
                              }}
                            >
                              View Pending Work
                            </button>
                            <button
                              className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                              onClick={() => {
                                window.electron.stopRule(item.name)
                                setItems((prevItems: any) =>
                                  prevItems.map((rule) =>
                                    rule.ruleName === item.name
                                      ? { ...rule, startActions: false }
                                      : rule
                                  )
                                )
                              }}
                            >
                              Stop Rule
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                  <div>{item.error !== '' && <div>Error: {item.error}</div>}</div>
                  <div>
                    {item.error === '' &&
                      item.unevaluateableReason ===
                        UNEVALUATABLE_REASON.ZERO_EXISTING_ORIGIN_PATHS && (
                        <div>Unevaluateable rule: No origin paths connected</div>
                      )}
                  </div>
                  <div>
                    {item.error === '' &&
                      item.unevaluateableReason ===
                        UNEVALUATABLE_REASON.ZERO_EXISTING_TARGET_PATHS && (
                        <div>Unevaluateable rule: No target paths connected</div>
                      )}
                  </div>
                  <div>
                    {item.error === '' &&
                      item.unevaluateableReason ===
                        UNEVALUATABLE_REASON.MIRROR_MULTIPLE_ORIGIN_PATHS && (
                        <div>
                          Unevaluateable rule: Multiple origin paths are found - Not allowed for a
                          mirror rule
                        </div>
                      )}
                  </div>
                  <div>
                    {item.error === '' &&
                      item.unevaluateableReason === UNEVALUATABLE_REASON.NO_PROBLEM &&
                      item.status === RULE_STATUS_TYPE.CHECKSUM_RUNNING && (
                        <div>Running a checksum of {item.checksumAction}</div>
                      )}
                  </div>
                  <div>
                    {item.error === '' &&
                      item.unevaluateableReason === UNEVALUATABLE_REASON.NO_PROBLEM &&
                      item.status === RULE_STATUS_TYPE.EXECUTING_ACTIONS && (
                        <div>{item.checksumAction}</div>
                      )}
                  </div>
                  <div>
                    {item.error === '' &&
                      item.unevaluateableReason === UNEVALUATABLE_REASON.NO_PROBLEM &&
                      item.status === RULE_STATUS_TYPE.EXECUTING_ACTIONS && (
                        <div>
                          {item.checksumAction}
                          <Progress value={item.actionsProgress} className="h-4 bg-muted" />
                          <div>{item.actionsProgress}% Completed</div>
                        </div>
                      )}
                  </div>
                </div>
                {/* <p className="text-lg font-semibold text-black">{item.name}</p> */}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-black">No Rules</p>
      )}
    </main>
  )
}

export default ViewAllRules
