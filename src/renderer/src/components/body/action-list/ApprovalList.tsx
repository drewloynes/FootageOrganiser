/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useParams, useNavigate } from 'react-router-dom'

export default function ApprovalList() {
  const { ruleName } = useParams<{ ruleName: string }>()

  const [ruleData, setRuleData] = useState<any>(null)

  const getRuleData = async () => {
    const originalRule = await window.electron.getRule(ruleName)
    console.log('Rule Data:')
    console.log(originalRule)
    setRuleData(originalRule)
  }

  const navigate = useNavigate()

  useEffect(() => {
    if (ruleName) {
      getRuleData()
    }
  }, [])

  if (!ruleData) {
    return <p>Loading...</p>
  }

  return (
    <div className="p-4 space-y-4 bg-white text-black">
      {/* Header Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        <Button
          onClick={() => {
            window.electron.startRule(ruleName)
            navigate(`/`)
          }}
        >
          Start Actions
        </Button>
      </div>

      {/* Data Display */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-grow h-full w-full">
        <ApprovalSectionCopy
          title="Files Waiting for Copy Approval"
          items={ruleData.fileCopyWaitingApproval}
        />
        <ApprovalSection
          title="Files Waiting for Deletion Approval"
          items={ruleData.fileDeleteWaitingApproval}
        />
        <ApprovalSection
          title="Directories Waiting for Creation Approval"
          items={ruleData.dirCreateWaitingApproval}
        />
        <ApprovalSection
          title="Directories Waiting for Deletion Approval"
          items={ruleData.dirDeleteWaitingApproval}
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
