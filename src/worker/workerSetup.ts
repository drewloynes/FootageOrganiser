import { waitReady } from '@shared/utils/timer'
import { setupIpc, isIpcSetup } from './communication/ipc/ipc'
import { requestStorageLocation } from './communication/ipc/main/mainIpcSender'
import { Settings } from '@shared/settings/settings'

const fileName: string = 'setupWorker.ts'
const area: string = 'worker'

export async function setupWorker(): Promise<boolean> {
  const funcName: string = 'startUpWorker'
  entryLog(funcName, fileName, area)

  let setupSuccess = false
  // Setup IPC first
  if (await setupIpc()) {
    // Setup config - depends on IPC setup
    setupConfig()
    // Wait for the worker setup to fully complete
    setupSuccess = await waitReady(isWorkerSetup)
  }

  exitLog(funcName, fileName, area)
  return setupSuccess
}

// Check if the worker process has finsihed setting up
function isWorkerSetup(): boolean {
  const funcName: string = 'isWorkerSetup'
  entryLog(funcName, fileName, area)

  let setup: boolean = true
  if (!isIpcSetup()) {
    condLog('IPC is not setup', funcName, fileName, area)
    setup = false
  } else if (storageLocation === undefined) {
    condLog('storageLocation is undefined', funcName, fileName, area)
    setup = false
  } else if (footageOrganiserSettings === undefined) {
    condLog('footageOrganiserSettings is undefined', funcName, fileName, area)
    setup = false
  }

  exitLog(funcName, fileName, area)
  return setup
}

function setupConfig(): void {
  const funcName: string = 'setupConfig'
  entryLog(funcName, fileName, area)

  /* Setup workerConfig */
  // Request for storage location from main IPC
  requestStorageLocation()
  // Setup settings
  Settings.fillSettings()
  // Setup auto deleting logs

  exitLog(funcName, fileName, area)
  return
}
