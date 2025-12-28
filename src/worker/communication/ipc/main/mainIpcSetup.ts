import { endSleep, sleep } from '@shared-node/utils/timer'
import { parseMainIpcMessage } from './mainIpcReceiver'

const fileName = 'mainIpcSetup.ts'
const area = 'ipc'

export async function setupMainIpc(): Promise<boolean> {
  const funcName = 'setupMainIpc'
  entryLog(funcName, fileName, area)

  let setupMainIpcSuccess = true
  const sleepId = 'awaiting-main-ipc'

  // Listen to receive a message from main with port information
  process.parentPort.on('message', (e) => {
    ipcRecLog('Main->Worker Initial Port Handover Message', funcName, fileName, area)
    const [port]: Electron.MessagePortMain[] = e.ports
    glob.workerGlobals.mainPort = port
    infoLog('Port WorkerPrcoess->MainProcess Established', funcName, fileName, area)

    // Setup port events
    setupMainIpcEvents()
    // Resolve promise awaiting this message
    endSleep(sleepId, glob.workerGlobals.currentSleeps)
  })

  // Wait 5 seconds to receive initial IPC from main
  if (await sleep(5000, sleepId, glob.workerGlobals.currentSleeps)) {
    errorLog('Initial IPC never received from main process', funcName, fileName, area)
    setupMainIpcSuccess = false
  }

  exitLog(funcName, fileName, area)
  return setupMainIpcSuccess
}

function setupMainIpcEvents(): void {
  const funcName = 'setupMainIpcEvents'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.mainPort?.on('message', async (e) => {
    ipcRecLog(`Main->Worker Message: ${e.data.type}`, funcName, fileName, area)
    await parseMainIpcMessage(e.data)
  })

  glob.workerGlobals.mainPort?.on('close', () => {
    debugLog('Main-Worker Worker Port Closed', funcName, fileName, area)
  })

  glob.workerGlobals.mainPort?.start()

  exitLog(funcName, fileName, area)
  return
}
