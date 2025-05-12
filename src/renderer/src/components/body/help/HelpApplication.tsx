import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@renderer/components/ui/accordion'
import { Separator } from '@renderer/components/ui/separator'

const fileName: string = 'HelpApplication.tsx'
const area: string = 'help'

function HelpApplication() {
  const funcName: string = 'HelpApplication'
  log.rend(funcName, fileName, area)

  return (
    <div>
      <div className="text-center font-semibold text-xl">Application</div>
      <div className=" mt-1">
        <Separator className="" />
      </div>
      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-10 cursor-pointer">Basics</AccordionTrigger>
          <AccordionContent>
            <div className="text-center px-2 w-full ">
              <div className="px-10 mb-5">
                <Separator />
              </div>
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">How does it work?</div>
                <div className="w-[70%]">
                  The user creates some rules, these rules are then evaluated periodically to see if
                  there are any actions to execute.
                  <br />
                  There there are 2 stages of the cycle: <b>evaluation</b> and <b>execution</b>.
                  Where evaluation identifies any actions which need excuting (e.g. copying a file,
                  deleting a directory), and the execution performs that action.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default HelpApplication
