import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@renderer/components/ui/accordion'
import { Separator } from '@renderer/components/ui/separator'

const fileName = 'HelpRuleConfig.tsx'
const area = 'help'

function HelpRuleConfig(): React.ReactElement {
  const funcName = 'HelpRuleConfig'
  log.rend(funcName, fileName, area)

  return (
    <div>
      <div className="text-center font-semibold text-xl">Rule Configuration</div>
      <div className=" mt-1">
        <Separator className="" />
      </div>

      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem value="item-1">
          <AccordionTrigger className="px-10 cursor-pointer">
            General Rule Configuration
          </AccordionTrigger>
          <AccordionContent className="w-full">
            <div className="text-center px-2 w-full ">
              <div className="px-10 mb-5">
                <Separator />
              </div>
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Rule Name</div>
                <div className="w-[70%]">
                  Simply just a name for the rule, not used for anything else other than
                  identification.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Rule Type</div>
                <div className="w-[70%]">
                  There are two types of rule: <b>Copy File</b> and <b>Mirror</b>.<br />
                  <b>Copy File</b> will copy any files under the origin (Including files folders
                  inside the origin folder) to the target folder - (Designed for copying footage
                  from an SD card to a hard drive)
                  <br />
                  <b>Mirror</b> will mirror the origin folder and everything underneath it to the
                  target folder, maintaining the origin folder's layout - (Designed for mirroring
                  hard drive to a back-up hard drive)
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Origin</div>
                <div className="w-[70%]">
                  This is the folder the rule will be copying from. (Hard drives are identified by
                  their volume name - make sure your hard drives and SD cards have unique names!)
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Target</div>
                <div className="w-[70%]">
                  This is the folder the rule will be copying to. (Hard drives are identified by
                  their volume name - make sure your hard drives and SD cards have unique names!)
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="px-10 cursor-pointer">
            Advanced Rule Configuration
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-center px-2 w-full ">
              <div className="px-10 mb-5">
                <Separator />
              </div>
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Enable Start / Stop Actions</div>
                <div className="w-[70%]">
                  This will enable and require you to start execution of any actions manually. You
                  will also be able to stop the rule from executing.
                  <br />
                  This is highly recommended when creating a new rule, as it allows you to validate
                  the rule was created correctly by checking what actions it will perform.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Disable Rule</div>
                <div className="w-[70%]">
                  This stops the rule from evaluating. Allowing you to modify the rule with the
                  safety of knowing it won't execute any actions.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Origin Folder Filters</div>
                <div className="w-[70%]">
                  These are lists of filters for files and folders to include and exclude when
                  copying from the origin folder. This allows you to be more specific about what you
                  would like to copy, and what you would like to ignore.
                  <br />
                  To, for example, exclude the folder 'KEEP' you can just add "KEEP" to the list of
                  folders to exclude. Asterisks are also accepted to denote anything else, so to
                  exclude any folder with beginning with KE you can use 'KE*'.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="px-10 cursor-pointer">
            Copy File Configuration
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-center px-2 w-full ">
              <div className="px-10 mb-5">
                <Separator />
              </div>
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Copy Path Under Target Folder</div>
                <div className="w-[70%]">
                  This allows you to copy the files to a unique identifiable path under the target
                  folder. (e.g. [Target Folder]/Year/Month/Day/[File] so all the files are organised
                  separately by the days they were created)
                  <br />
                  <br />
                  The folder options are:
                  <br />
                  <b>Year</b> - The folder will be the year the file was created (e.g. 2025)
                  <br />
                  <b>Month</b> - The folder will be the month the file was created (e.g. 5-May)
                  <br />
                  <b>Day</b> - The folder will be the day of the month the file was created (e.g. 2)
                  <br />
                  <b>Volume Name</b> - The folder will be the volume name of the origin folder (e.g.
                  "SD-Card-1" or "Camera-1")
                  <br />
                  <b>File Format</b> - The folder will be the name of the file's format (e.g. "mp4"
                  or "jpg")
                  <br />
                  <b>Custom</b> - The folder will be a custom name defined in a text box which
                  appears when choosing this option. (e.g. "Custom Name")
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Delete Copied Files</div>
                <div className="w-[70%]">
                  This will delete any files which have successfully been copied to the target
                  folder. The success of the copy is determined by running a checksum on the file
                  under the origin and target folder and validating no data was lost.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Delete Other Folder / Files</div>
                <div className="w-[70%]">
                  This allows you to start adding other folders under which files / folders can be
                  deleted. This deletion only occurs once all files have been successfully copied to
                  the target folder and deleted under the origin folder.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Add Other Folder To Delete</div>
                <div className="w-[70%]">
                  This is allows you to add a new "other folder" under which all files and folders
                  will be delete. You can add unlimited "other folders".
                  <br />
                  Each "other folder" allows you to add filters, so you can specific exactly which
                  files / folders to include in the deletion and which to exclude.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="px-10 cursor-pointer">Mirror Configuration</AccordionTrigger>
          <AccordionContent>
            <div className="text-center px-2 w-full ">
              <div className="px-10 mb-5">
                <Separator />
              </div>
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">
                  Delete Unnecessary Files / Folders In Target Folder
                </div>
                <div className="w-[70%]">
                  When mirroring, the target folder may contain folders and files which don't exist
                  under the origin folder. This option allows you to automatically delete these
                  extra files and folders under the target folder.
                </div>
              </div>
              <div className="px-10 my-5">
                <Separator />
              </div>
            </div>
            <div className="text-center px-2 w-full ">
              <div className="flex flex-row items-center">
                <div className="w-[25%] font-semibold mr-2">Target Folder Filters</div>
                <div className="w-[70%]">
                  These are lists of filters for files and folders to include and exclude when
                  deleting under the target folder. This allows you to be more specific about what
                  you may like to exclude from automatic deletion.
                  <br />
                  To, for example, exclude the folder 'KEEP' you can just add "KEEP" to the list of
                  folders to exclude. Asterisks are also accepted to denote anything else, so to
                  exclude any folder with beginning with KE you can use 'KE*'.
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default HelpRuleConfig
