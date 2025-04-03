import { useParams } from 'react-router-dom'
import CreateRuleForm from './rule-form/CreateRuleForm'

const CreateNewRule = () => {
  return (
    <div className="h-full overflow-y-auto space-y-4 p-4  pb-20">
      <div className=" bg-white text-black">Create Rule</div>
      <CreateRuleForm newRule={true} ruleName="" />
    </div>
  )
}

export default CreateNewRule
