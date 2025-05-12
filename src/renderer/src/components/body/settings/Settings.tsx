import { ScrollArea } from '@renderer/components/ui/scroll-area'
import SettingsForm from './SettingsForm'

const fileName: string = 'Settings.tsx'
const area: string = 'settings'

function Settings() {
  const funcName: string = 'Settings'
  log.rend(funcName, fileName, area)

  return (
    <ScrollArea className="flex-1 py-2 text-center h-1">
      <h2 className="text-3xl font-extrabold text-center py-1 mx-auto w-fit border-t-1 border-b-1 border-gray-200 mb-6">
        Settings
      </h2>

      <SettingsForm />
    </ScrollArea>
  )
}

export default Settings
