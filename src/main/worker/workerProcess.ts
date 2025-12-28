import { openWindow } from '@main/window/window'
import workerPath from '@worker/worker?modulePath'
import { utilityProcess } from 'electron'
import { setupWorkerIpc } from '../ipc/worker/workerIpcSetup'

const fileName = 'workerProcess.ts'
const area = 'worker'

export async function setupWorkerProcess(): Promise<void> {
  const funcName = 'setupWorkerProcess'
  entryLog(funcName, fileName, area)

  startWorkerProcess()

  glob.mainGlobals.workerProcess?.on('spawn', async () => {
    condLog('Worker Process spawned', funcName, fileName, area)
    setupWorkerIpc()
  })

  exitLog(funcName, fileName, area)
  return
}

function startWorkerProcess(): void {
  const funcName = 'startWorkerProcess'
  entryLog(funcName, fileName, area)

  glob.mainGlobals.workerProcess = utilityProcess.fork(workerPath)

  exitLog(funcName, fileName, area)
  return
}

export async function workerSetupComplete(): Promise<void> {
  const funcName = 'workerSetupComplete'
  entryLog(funcName, fileName, area)

  glob.mainGlobals.workerSetup = true
  // Open window after app is fully setup
  await openWindow()

  exitLog(funcName, fileName, area)
  return
}
