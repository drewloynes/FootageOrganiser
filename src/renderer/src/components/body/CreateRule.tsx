import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import RuleForm from './rule-form/RuleForm'

const fileName: string = 'CreateNewRule.tsx'
const area: string = 'body'

function CreateRule() {
  const funcName: string = 'CreateNewRule'
  log.rend(funcName, fileName, area)

  return (
    <ScrollArea className="flex-1 p-2 px-6 text-center h-1">
      <div>
        <h2 className="text-3xl font-extrabold text-center py-1 mx-auto w-fit border-t-1 border-b-1 border-gray-200 ">
          Create A New Rule
        </h2>
        <Separator className="mt-4 mb-4" />
        <RuleForm newRule={true} />
      </div>
    </ScrollArea>
  )
}

export default CreateRule
