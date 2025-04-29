import { Button } from '@renderer/components/ui/button'
import { FullRule, RULE_STATUS_TYPE } from '@shared/types/ruleTypes'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function ApprovalList() {
  let { ruleName } = useParams<{ ruleName: string }>()
  const [rule, setRule] = useState<FullRule>()

  const navigate = useNavigate()

  if (ruleName === undefined) {
    ruleName = ''
    navigate(`/`)
  }

  useEffect(() => {
    console.log('Start startRuleStream')
    window.electron.startRuleStream(ruleName)

    window.electron.onRule((rule) => {
      console.log('Received rule')
      console.log(rule)
      setRule(rule)
    })

    return () => {
      console.log('Stop stopEveryRuleStream')
      window.electron.stopEveryRuleStream()
    }
  }, [])

  const getRuleData = async () => {
    const originalRule = await window.electron.getRule(ruleName)
    console.log('Rule Data:')
    console.log(originalRule)
    setRule(originalRule)
  }

  useEffect(() => {
    if (ruleName) {
      getRuleData()
    }
  }, [])

  if (!rule) {
    return <div className="text-black">Loading</div>
  }

  return (
    <div className="p-4 space-y-4 bg-white text-black">
      {/* Header Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        {rule.enableStartStopActions && (
          <div>
            {rule.status === RULE_STATUS_TYPE.AWAITING_APPROVAL && (
              <Button
                onClick={() => {
                  window.electron.startRule(ruleName)
                  navigate(`/`)
                }}
              >
                Start Actions
              </Button>
            )}
            {(rule.status === RULE_STATUS_TYPE.EXECUTING_ACTIONS ||
              rule.status === RULE_STATUS_TYPE.QUEUED_ACTIONS) && (
              <Button
                onClick={() => {
                  window.electron.stopRule(ruleName)
                  navigate(`/`)
                }}
              >
                Stop Actions
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Data Display */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-grow h-full w-full">
        <ApprovalSectionCopy
          title="Files Waiting for Copy Approval"
          items={rule.fileCopyActionQueue}
        />
        <ApprovalSection
          title="Files Waiting for Deletion Approval"
          items={rule.fileDeleteActionQueue}
        />
        <ApprovalSection
          title="Directories Waiting for Creation Approval"
          items={rule.dirMakeActionQueue}
        />
        <ApprovalSection
          title="Directories Waiting for Deletion Approval"
          items={rule.dirDeleteActionQueue}
        />
      </div>
    </div>
  )
}

function ApprovalSection({ title, items }) {
  return (
    <div className="p-4 border rounded-xl shadow-sm overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {items.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No pending approvals</p>
      )}
    </div>
  )
}

function ApprovalSectionCopy({ title, items }) {
  return (
    <div className="p-4 border rounded-xl shadow-sm overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {items.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {items.map((item, index) => (
            <li key={index}>
              {item.from}
              {item.to}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No pending approvals</p>
      )}
    </div>
  )
}
