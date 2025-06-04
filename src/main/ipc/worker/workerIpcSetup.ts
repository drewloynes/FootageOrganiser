import { AsyncIpcMessage } from '@shared-node/utils/ipc'
import { MessageChannelMain } from 'electron/main'
import { parseWorkerIpcMessage } from './workerIpcReceiver'

const fileName: string = 'workerIpcSetup.ts'
const area: string = 'worker-ipc'

export function setupWorkerIpc(): void {
  const funcName: string = 'setupWorkerIpc'
  entryLog(funcName, fileName, area)

  // Create ports and send over to worker
  const { port1, port2 } = new MessageChannelMain()
  glob.mainGlobals.workerPort = port2
  setupWorkerIpcEvents()
  glob.mainGlobals.workerProcess?.postMessage({ message: new AsyncIpcMessage('alive', {}) }, [
    port1
  ])
  ipcSentLog('Main->Worker Initial Port Handover Message', funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return
}

function setupWorkerIpcEvents(): void {
  const funcName: string = 'setupWorkerIpcEvents'
  entryLog(funcName, fileName, area)

  glob.mainGlobals.workerPort?.on('message', (e) => {
    ipcRecLog(`Worker->Main Message: ${e.data.type}`, funcName, fileName, area)
    parseWorkerIpcMessage(e.data)
  })

  glob.mainGlobals.workerPort?.on('close', () => {
    debugLog('Main-Worker Port Closed', funcName, fileName, area)
  })

  glob.mainGlobals.workerPort?.start()

  exitLog(funcName, fileName, area)
  return
}
