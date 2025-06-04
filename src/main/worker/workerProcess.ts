import { openWindow } from '@main/window/window'
import workerPath from '@worker/worker?modulePath'
import { utilityProcess } from 'electron'
import { setupWorkerIpc } from '../ipc/worker/workerIpcSetup'

const fileName: string = 'workerProcess.ts'
const area: string = 'worker'

export async function setupWorkerProcess(): Promise<void> {
  const funcName: string = 'setupWorkerProcess'
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
  const funcName: string = 'startWorkerProcess'
  entryLog(funcName, fileName, area)

  glob.mainGlobals.workerProcess = utilityProcess.fork(workerPath)

  exitLog(funcName, fileName, area)
  return
}

export function workerSetupComplete(): void {
  const funcName: string = 'workerSetupComplete'
  entryLog(funcName, fileName, area)

  glob.mainGlobals.workerSetup = true
  // Open window after app is fully setup
  openWindow()

  exitLog(funcName, fileName, area)
  return
}
