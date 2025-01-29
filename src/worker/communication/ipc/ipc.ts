import { waitReady } from '@shared/utils/timer'
import { setupMainIpc } from './main/mainIpc'

const fileName: string = 'ipc.ts'
const area: string = 'ipc'

// Setup all IPC requried
// - Returns true if IPCs are fully setup before timeout
// - Returns false if IPCs setup timesout
export async function setupIpc(): Promise<boolean> {
  const funcName: string = 'setupIPC'
  entryLog(funcName, fileName, area)

  // Setup IPC lsiteners, wait for them to be called to complete setup
  setupMainIpc()
  const ipcSetup: boolean = await waitReady(isIpcSetup)

  exitLog(funcName, fileName, area)
  return ipcSetup
}

// Check if all Ipc's have been setup
export function isIpcSetup(): boolean {
  const funcName: string = 'setupIPC'
  entryLog(funcName, fileName, area)

  let setup: boolean = true
  if (!workerConfig.getMainPort()) {
    condLog('mainPort is undefined', funcName, fileName, area)
    setup = false
  }

  exitLog(funcName, fileName, area)
  return setup
}
