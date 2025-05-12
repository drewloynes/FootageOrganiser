import { pathExists } from '@shared-node/utils/filePaths'
import { sendSyncIpcMessageMain } from './communication/ipc/main/mainIpcSender'
import { setupMainIpc } from './communication/ipc/main/mainIpcSetup'
import { updateCurrentDriveInfo } from './drives/currentDriveInfo'
import { setCurrentRules } from './rules/currentRules'
import { setCurrentSettings } from './settings/currentSettings'
import { startAutoDeleteOldLogs } from './storage/logs/storeLogs'

const fileName: string = 'workerSetup.ts'
const area: string = 'worker'

export async function setupWorker(): Promise<void> {
  const funcName: string = 'setupWorker'
  entryLog(funcName, fileName, area)

  // Need main port setup to contact main to fill worker globals
  if (!(await setupMainIpc())) {
    errorLog('Error setting up main IPC ', funcName, fileName, area)
    throw 'Failed to setup IPC with main process'
  }

  await fillWorkerGlobals()
  // Don't await this async function - Want it to run in the background permenantly
  startAutoDeleteOldLogs()

  glob.workerGlobals.workerSetup = true

  exitLog(funcName, fileName, area)
  return
}

async function fillWorkerGlobals(): Promise<void> {
  const funcName: string = 'fillWorkerGlobals'
  entryLog(funcName, fileName, area)

  await setStorageLocation()
  await updateCurrentDriveInfo()
  await setCurrentSettings()
  await setCurrentRules()

  exitLog(funcName, fileName, area)
  return
}

async function setStorageLocation(): Promise<void> {
  const funcName: string = 'setStorageLocation'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.storageLocation = (await sendSyncIpcMessageMain(
    'storage-location',
    {}
  )) as string

  if (!pathExists(glob.workerGlobals.storageLocation)) {
    errorLog(`Storage location path doesn't exist`, funcName, fileName, area)
    throw `Storage location path doesn't exist`
  }

  exitLog(funcName, fileName, area)
  return
}
