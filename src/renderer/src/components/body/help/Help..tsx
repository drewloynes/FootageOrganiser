import { ScrollArea } from '../../ui/scroll-area'
import { Separator } from '../../ui/separator'
import HelpApplication from './HelpApplication'
import HelpRuleConfig from './HelpRuleConfig'
import HelpRuleManagement from './HelpRuleManagement'
import HelpSettings from './HelpSettings'

const fileName = 'Help.tsx'
const area = 'help'

const Help = (): React.ReactElement => {
  const funcName = 'Help'
  log.rend(funcName, fileName, area)

  return (
    <ScrollArea className="flex-1 h-1">
      <div className="break-words w-full pb-5">
        <h1 className="font-bold text-center text-3xl">What Does It All Mean?</h1>
        <Separator className="my-5" />
        <div className="w-full px-5">
          <HelpApplication />
        </div>
        <Separator className="mb-5" />
        <div className="w-full px-5">
          <HelpRuleConfig />
        </div>
        <Separator className="mb-5" />
        <div className="w-full px-5">
          <HelpRuleManagement />
        </div>
        <Separator className="mb-5" />
        <div className="w-full px-5">
          <HelpSettings />
        </div>
      </div>
    </ScrollArea>
  )
}

export default Help
