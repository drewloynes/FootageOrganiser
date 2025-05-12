import { AsyncIpcMessage } from '@shared-node/utils/ipc'
import { sleep } from '@shared-node/utils/timer'
import { MessageChannelMain } from 'electron/main'
import { parseWorkerIpcMessage } from './workerIpcReceiver'
import { sendSyncIpcMessageWorker } from './workerIpcSender'

const fileName: string = 'workerIpcSetup.ts'
const area: string = 'worker-ipc'

export function setupWorkerIpc(): void {
  const funcName: string = 'setupWorkerIpc'
  entryLog(funcName, fileName, area)

  // Create ports and send over to worker
  const { port1, port2 } = new MessageChannelMain()
  glob.mainGlobals.workerPort = port2
  glob.mainGlobals.workerPrcoess?.postMessage({ message: new AsyncIpcMessage('alive', {}) }, [
    port1
  ])
  ipcSentLog('Main->Worker Initial Port Handover Message', funcName, fileName, area)

  setupWorkerIpcEvents()

  exitLog(funcName, fileName, area)
  return
}

function setupWorkerIpcEvents(): void {
  const funcName: string = 'setupWorkerIpcEvents'
  entryLog(funcName, fileName, area)

  glob.mainGlobals.workerPort?.on('message', async (e) => {
    ipcRecLog(`Worker->Main Message: ${e.data.type}`, funcName, fileName, area)
    await parseWorkerIpcMessage(e.data)
  })

  glob.mainGlobals.workerPort?.on('close', () => {
    debugLog('Main-Worker Port Closed', funcName, fileName, area)
  })

  exitLog(funcName, fileName, area)
  return
}

export async function awaitWorkerSetup(): Promise<void> {
  const funcName: string = 'isWorkerSetup'
  entryLog(funcName, fileName, area)

  let workerSetup: boolean = false
  while (!workerSetup) {
    condLog('Wait and query if worker is setup', funcName, fileName, area)

    await sleep(500)
    workerSetup = (await sendSyncIpcMessageWorker('worker-setup', {})) as boolean
  }

  exitLog(funcName, fileName, area)
  return
}
