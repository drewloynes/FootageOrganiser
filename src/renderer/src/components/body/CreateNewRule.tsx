import CreateRuleForm from './rule-form/CreateRuleForm'

const fileName: string = 'CreateNewRule.tsx'
const area: string = 'body'

const CreateNewRule = () => {
  const funcName: string = 'CreateNewRule'
  log.rend(funcName, fileName, area)

  return (
    <div className="h-full overflow-y-auto space-y-4 p-4  pb-20">
      <div className=" bg-white text-black">Create Rule</div>
      <CreateRuleForm newRule={true} initialRuleName="" />
    </div>
  )
}

export default CreateNewRule
