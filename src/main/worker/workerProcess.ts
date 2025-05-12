import workerPath from '@worker/worker?modulePath'
import { utilityProcess } from 'electron'
import { awaitWorkerSetup, setupWorkerIpc } from '../ipc/worker/workerIpcSetup'

const fileName: string = 'workerProcess.ts'
const area: string = 'worker'

export default async function setupWorkerProcess(): Promise<void> {
  const funcName: string = 'setupWorkerProcess'
  entryLog(funcName, fileName, area)

  startWorkerProcess()
  setupWorkerIpc()
  await awaitWorkerSetup()

  exitLog(funcName, fileName, area)
  return
}

function startWorkerProcess(): void {
  const funcName: string = 'startWorkerProcess'
  entryLog(funcName, fileName, area)

  glob.mainGlobals.workerPrcoess = utilityProcess.fork(workerPath)

  exitLog(funcName, fileName, area)
  return
}
