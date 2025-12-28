import { setupWindowIpcEvents } from './windowIpcReceiver'

const fileName = 'windowIpcSetup.ts'
const area = 'window-ipc'

export function setupWindowIpc(): void {
  const funcName = 'setupWindowIpc'
  entryLog(funcName, fileName, area)

  setupWindowIpcEvents()

  exitLog(funcName, fileName, area)
  return
}
