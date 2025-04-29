import { setupWindowIpcEvents } from './windowIpcReceiver'

const fileName: string = 'windowIpcSetup.ts'
const area: string = 'window-ipc'

export function setupWindowIpc(): void {
  const funcName: string = 'setupWindowIpc'
  entryLog(funcName, fileName, area)

  setupWindowIpcEvents()

  exitLog(funcName, fileName, area)
  return
}
