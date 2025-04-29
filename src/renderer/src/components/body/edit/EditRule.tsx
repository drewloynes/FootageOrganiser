import { Progress } from '@renderer/components/ui/progress'
import { FullRule, RULE_STATUS_TYPE, UNEVALUATABLE_REASON } from '@shared/types/ruleTypes'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CreateRuleForm from '../rule-form/CreateRuleForm'

const EditRule = () => {
  let { ruleName } = useParams<{ ruleName: string }>()
  const [rule, setRule] = useState<FullRule>()
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  if (ruleName === undefined) {
    ruleName = ''
    navigate(`/`)
  }

  useEffect(() => {
    console.log('Start startRuleStream')
    window.electron.startRuleStream(ruleName)

    function handleRule(rule: FullRule): void {
      console.log('Received rule')
      console.log(rule)
      setRule(rule)

      if (loading) {
        setLoading(false)
      }
    }

    window.electron.onRule(handleRule)

    return () => {
      console.log('Stop stopEveryRuleStream')
      window.electron.removeListenerRule(handleRule)
      window.electron.stopEveryRuleStream()
    }
  }, [])

  if (loading) return <div className=" bg-white text-black">Loading...</div>

  return (
    <div className="h-full overflow-y-auto space-y-4 p-4  pb-20">
      <div className=" bg-white text-black">Edit Rule {ruleName}</div>
      <div>
        <button
          className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
          onClick={() => {
            window.electron.deleteRule(ruleName)
            navigate(`/`)
          }}
        >
          Delete Rule
        </button>
        {rule && (
          <div>
            <div>
              {!rule.disabled && (
                <button
                  className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                  onClick={async () => {
                    window.electron.disableRule(ruleName)
                  }}
                >
                  Disable Rule
                </button>
              )}
              {rule.disabled && (
                <button
                  className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                  onClick={async () => {
                    window.electron.activateRule(ruleName)
                  }}
                >
                  Activate Rule
                </button>
              )}
              {rule.status === RULE_STATUS_TYPE.AWAITING_APPROVAL ||
                rule.status === RULE_STATUS_TYPE.QUEUED_ACTIONS ||
                (rule.status === RULE_STATUS_TYPE.EXECUTING_ACTIONS && (
                  <button
                    className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                    onClick={() => {
                      console.log('Pressed view pending work')
                      navigate(`/approval-list/${ruleName}`)
                    }}
                  >
                    View Pending Work
                  </button>
                ))}
              {rule.enableStartStopActions &&
                rule.status === RULE_STATUS_TYPE.AWAITING_APPROVAL && (
                  <div>
                    <button
                      className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                      onClick={() => {
                        window.electron.startRule(ruleName)
                      }}
                    >
                      Run Rule
                    </button>
                  </div>
                )}
              {rule.enableStartStopActions &&
                (rule.status === RULE_STATUS_TYPE.EXECUTING_ACTIONS ||
                  rule.status === RULE_STATUS_TYPE.QUEUED_ACTIONS) && (
                  <div>
                    <button
                      className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
                      onClick={() => {
                        window.electron.stopRule(ruleName)
                      }}
                    >
                      Stop Rule
                    </button>
                  </div>
                )}
            </div>
            <div>{rule.status}</div>
            <div>{rule.error !== '' && <div>Error: {rule.error}</div>}</div>
            <div>
              {rule.error === '' &&
                rule.unevaluateableReason === UNEVALUATABLE_REASON.ZERO_EXISTING_ORIGIN_PATHS && (
                  <div>Unevaluateable rule: No origin paths connected</div>
                )}
            </div>
            <div>
              {rule.error === '' &&
                rule.unevaluateableReason === UNEVALUATABLE_REASON.ZERO_EXISTING_TARGET_PATHS && (
                  <div>Unevaluateable rule: No target paths connected</div>
                )}
            </div>
            <div>
              {rule.error === '' &&
                rule.unevaluateableReason === UNEVALUATABLE_REASON.MIRROR_MULTIPLE_ORIGIN_PATHS && (
                  <div>
                    Unevaluateable rule: Multiple origin paths are found - Not allowed for a mirror
                    rule
                  </div>
                )}
            </div>
            <div>
              {rule.error === '' &&
                rule.unevaluateableReason === UNEVALUATABLE_REASON.NO_PROBLEM &&
                rule.status === RULE_STATUS_TYPE.CHECKSUM_RUNNING && (
                  <div>Running a checksum of {rule.checksumAction}</div>
                )}
            </div>
            <div>
              {rule.error === '' &&
                rule.unevaluateableReason === UNEVALUATABLE_REASON.NO_PROBLEM &&
                rule.status === RULE_STATUS_TYPE.EXECUTING_ACTIONS && (
                  <div>{rule.checksumAction}</div>
                )}
            </div>
            <div>
              {rule.error === '' &&
                rule.unevaluateableReason === UNEVALUATABLE_REASON.NO_PROBLEM &&
                rule.status === RULE_STATUS_TYPE.EXECUTING_ACTIONS && (
                  <div>
                    {rule.checksumAction}
                    <Progress value={rule.actionsProgress} className="h-4 bg-muted" />
                    <div>{rule.actionsProgress}% Completed</div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
      <CreateRuleForm newRule={false} initialRuleName={ruleName} showDisableRule={false} />
    </div>
  )
}

export default EditRule
