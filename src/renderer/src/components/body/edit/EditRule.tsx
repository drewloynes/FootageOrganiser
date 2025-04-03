/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from 'react-router-dom'
import CreateRuleForm from '../rule-form/CreateRuleForm'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EditRule = () => {
  let { ruleName } = useParams<{ ruleName: string }>()
  const [ruleData, setRuleData] = useState<any>(null)
  const [trigger, setTrigger] = useState(0)

  if (ruleName === undefined) {
    ruleName = ''
  }

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
  }, [trigger])

  if (!ruleData) {
    return <p>Loading...</p>
  }

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
        {!ruleData.pauseProcessing && (
          <button
            className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
            onClick={async () => {
              await window.electron.pauseRule(ruleName)
              setTrigger((prev) => prev + 1)
            }}
          >
            Pause Rule
          </button>
        )}
        {ruleData.pauseProcessing && (
          <button
            className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
            onClick={async () => {
              await window.electron.unpauseRule(ruleName)
              setTrigger((prev) => prev + 1)
            }}
          >
            Unpause Rule
          </button>
        )}
        {ruleData.stopAfterProcessing && item.status === 'Actions Awaiting Approval' && (
          <div>
            <button
              className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
              onClick={() => {
                console.log('Pressed view pending work')
                navigate(`/approval-list/${ruleName}`)
              }}
            >
              View Pending Work
            </button>
            <button
              className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
              onClick={() => {
                window.electron.startRule(ruleName)
                setRuleData((prev) => ({ ...prev, startActions: true }))
              }}
            >
              Run Rule
            </button>
          </div>
        )}
        {ruleData.stopAfterProcessing &&
          (item.status === 'Actioning' || item.status === 'Queued Actions') && (
            <button
              className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
              onClick={() => {
                window.electron.stopRule(ruleName)
                setRuleData((prev) => ({ ...prev, startActions: false }))
              }}
            >
              Stop Rule
            </button>
          )}
      </div>
      <CreateRuleForm newRule={false} ruleName={ruleName} />
    </div>
  )
}

export default EditRule
