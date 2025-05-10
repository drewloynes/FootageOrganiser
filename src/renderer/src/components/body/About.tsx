import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'

const fileName: string = 'About.tsx'
const area: string = 'body'

const About = () => {
  const funcName: string = 'About'
  log.rend(funcName, fileName, area)

  return (
    <ScrollArea className="flex-1 h-1">
      <div className="break-words w-full">
        <h1 className="font-bold text-center text-3xl">Here's Some Information</h1>
        <Separator className="my-5" />
        <div className="text-center px-5 w-full ">
          <div className="flex flex-row items-center">
            <div className="w-[25%] font-semibold mr-2">What is the footage organiser for?</div>
            <div className="w-[70%]">
              When filming, I was very bored of repeatedly coping all the different footage from
              different SD cards and putting them in the correct format on my hard drive, I was then
              also sick of having to manually mirror to my back-up hard drive. This app automates
              all of that, so at the end of a day of filming, you just have to plug it all in and
              let the app work it's magic.
            </div>
          </div>
          <div className="px-20 my-5">
            <Separator />
          </div>
          <div className="flex flex-row items-center">
            <div className="w-[25%] font-semibold mr-2">How does the footage organiser work?</div>
            <div className="w-[70%]">
              Firstly the user must create a bunch of rules for either copying files (e.g. coping
              from an SD card to a hard drive) or mirroring files / folders (e.g. mirroring your
              hard drive to your back-up hard drive). <br />
              Once rules exist the footage organiser runs in cycles. The first part of the cycle is
              the evaluation where each rule determines if any actions (e.g. copying a file,
              deleting a file, creating a folder or deleting a folder) need to be performed. The
              second part of the cycle is the execution where the actions are performed.
            </div>
          </div>
          <div className="px-20 my-5">
            <Separator />
          </div>
          <div className="flex flex-row items-center">
            <div className="w-[25%] font-semibold mr-2">How do I setup the footage organiser?</div>
            <div className="w-[70%]">
              Create some rules! - Find out more about the rules on the help page.
              <br />
              Side note: I will always recommend setting 'Enable start / stop actions' for a newly
              created rule as it will allow you to identify any problems with the rule before it
              wrecks havoc. (This setting makes it so you have to start the rule for it to perform
              any actions, allowing you to view the actions it will perform beforehand)
            </div>
          </div>
          <div className="px-20 my-5">
            <Separator />
          </div>
          <div className="flex flex-row items-center">
            <div className="w-[25%] font-semibold mr-2">Can I help?</div>
            <div className="w-[70%]">
              Yes! Please provide any feedback, report any bugs or help out in anyway through the
              GitHub.
            </div>
          </div>
          <div className="px-20 my-5">
            <Separator />
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default About
