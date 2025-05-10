import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@renderer/components/ui/accordion'
import { Separator } from '@renderer/components/ui/separator'

const fileName: string = 'HelpRuleManagement.tsx'
const area: string = 'help'

function HelpRuleManagement() {
  const funcName: string = 'HelpRuleManagement'
  log.rend(funcName, fileName, area)

  return (
    <div>
      <div className="text-center font-semibold text-xl">Rule Management</div>
      <div className=" mt-1">
        <Separator className="" />
      </div>
      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-10 cursor-pointer">All Rules</AccordionTrigger>
          <AccordionContent>
            <div className="text-center px-2 w-full ">
              <div className="px-10 mb-5">
                <Separator />
              </div>
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Control Rules</div>
                <div className="w-[70%]">
                  This drop down menu on the side bar allows you to control all the rules at once:{' '}
                  <br />
                  <b>Evaluate All</b> will cancel anything all rules are currently doing and
                  evaluate all active rules.
                  <br />
                  <b>Stop All</b> will stop any rules with "Enable start / stop actions" set.
                  <br />
                  <b>Disable All</b> will disable all rules.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">All Rules Page</div>
                <div className="w-[70%]">
                  This is the main page where you can view all the rules, their current status and
                  any problems they've encountered.
                  <br />
                  From this page you control a rule to either disable / activate it, and start /
                  stop it if "Enable Start / Stop Actions" is set.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="px-10 cursor-pointer">Edit Rule</AccordionTrigger>
          <AccordionContent>
            <div className="text-center px-2 w-full ">
              <div className="px-10 mb-5">
                <Separator />
              </div>
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Edit Top Bar</div>
                <div className="w-[70%]">
                  The top bar of the edit page also allows you to activate / disable a rule and
                  start / stop a rule. You can also delete a rule, this deletion will be permanent.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Edit Configuration</div>
                <div className="w-[70%]">
                  This section allows you to modify any of the rule's configuration as set on the
                  create rule page.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="px-10 cursor-pointer">Rule Actions</AccordionTrigger>
          <AccordionContent>
            <div className="text-center px-2 w-full ">
              <div className="px-10 mb-5">
                <Separator />
              </div>
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">View Actions Page</div>
                <div className="w-[70%]">
                  This page is available when a rule has actions to execute. You can view the
                  pending actions separated into lists of actions for : copying a file, deleting a
                  file, creating a folder and deleting a folder.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Logs</div>
                <div className="w-[70%]">
                  This button on the sidebar will open the folder which stores all the logs from
                  executing actions. Every time an action is executed it is logged.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default HelpRuleManagement
