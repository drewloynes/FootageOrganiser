import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@renderer/components/ui/accordion'
import { Separator } from '@renderer/components/ui/separator'

const fileName = 'HelpSettings.tsx'
const area = 'help'

function HelpSettings(): React.ReactElement {
  const funcName = 'HelpSettings'
  log.rend(funcName, fileName, area)

  return (
    <div>
      <div className="text-center font-semibold text-xl">Settings</div>
      <div className=" mt-1">
        <Separator className="" />
      </div>
      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-10 cursor-pointer">
            Settings Configuration
          </AccordionTrigger>
          <AccordionContent>
            {' '}
            <div className="text-center px-2 w-full ">
              <div className="px-10 mb-5">
                <Separator />
              </div>
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Drive Cutoff (GBs)</div>
                <div className="w-[70%]">
                  This is the lowest amount of storage left on a drive before the rule will stop
                  coping files to the drive. This number is the number of GBs the cut off point will
                  be.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Logs Retention (Days)</div>
                <div className="w-[70%]">
                  This is the number of days the logs (recording all the actions executed) will be
                  retained for before automatic deletion.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Checksum Method</div>
                <div className="w-[70%]">
                  This decides the checksum method to use:
                  <br />
                  <b>MD5</b> is the weakest method, but will take less time to run.
                  <br />
                  <b>CRC</b> is the middle method, it will take some time but is more accurate.
                  <br />
                  <b>SHA 256</b> is the strongest method, it will take much longer to run but will
                  be the most accurate.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Time Until Re-Evaluation (Minutes)</div>
                <div className="w-[70%]">
                  If after evaluation, there are no actions to execute, the app will pause for some
                  time before evaluating every rule again. This is the amount of time in minutes to
                  pause.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default HelpSettings
