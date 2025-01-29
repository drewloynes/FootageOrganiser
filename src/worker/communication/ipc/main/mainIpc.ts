import { IpcMessage } from '@shared/utils/ipc'

const fileName: string = 'mainIpc.ts'
const area: string = 'ipc'

// Setup IPC to the 'main' process of electron
export function setupMainIpc(): void {
  const funcName: string = 'setupMainIpc'
  entryLog(funcName, fileName, area)

  // Wait to receive a message from main with port information
  process.parentPort.on('message', (e) => {
    ipcRecLog('Main->Worker Initial Port Handover Message', funcName, fileName, area)
    const [port]: Electron.MessagePortMain[] = e.ports
    workerConfig.setMainPort(port)
    infoLog('Port WorkerPrcoess->MainProcess Established', funcName, fileName, area)
    // Setup main IPC callback events
    setupMainIpcEvents()
  })

  exitLog(funcName, fileName, area)
  return
}

// Setup event callbacks for main process
function setupMainIpcEvents(): void {
  const funcName: string = 'setupMainIpcEvents'
  entryLog(funcName, fileName, area)

  const mainPort: Electron.MessagePortMain | undefined = workerConfig.getMainPort()
  if (mainPort) {
    mainPort.on('message', (e) => {
      ipcRecLog('Main->Worker Message', funcName, fileName, area)
      receiveMainMessage(e.data)
    })
    mainPort.on('close', () => {
      warnLog('Main->Worker Worker Port Closed', funcName, fileName, area)
    })
  } else {
    errorLog(`mainPort didn't exist`, funcName, fileName, area)
    throw `mainPort should exist but doesn't`
  }

  exitLog(funcName, fileName, area)
  return
}

// Parse the message ID and perform function
function receiveMainMessage(message: IpcMessage): void {
  const funcName: string = 'receiveMainMessage'
  entryLog(funcName, fileName, area)

  switch (message.id) {
    case 'alive': {
      condLog('Received alive ICP message from main process', funcName, fileName, area)
      break
    }
    case 'storage-location': {
      condLog('Received storage-location ICP message from main process', funcName, fileName, area)
      workerConfig.setStorageLocation(message.data as string)
      infoLog('File storage location set', funcName, fileName, area)
      break
    }
    default: {
      condLog('Received ICP message could not be identified by worker', funcName, fileName, area)
      break
    }
  }

  exitLog(funcName, fileName, area)
  return
}
