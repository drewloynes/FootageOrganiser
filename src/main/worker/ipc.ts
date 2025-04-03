import { IpcMessage } from '@shared/utils/ipc'
import { app } from 'electron/main'

const fileName: string = 'ipc.ts'
const area: string = 'fork'

// Send IPC to worker process
export function sendMessageWorker(message: unknown) {
  const funcName: string = 'sendMessageWorker'
  entryLog(funcName, fileName, area)

  if (workerPort) {
    condLog('workerPort found', funcName, fileName, area)
    workerPort.start()
    workerPort.postMessage(message)
    ipcSentLog('Main->Worker Message', funcName, fileName, area)
  } else {
    warnLog('workerPort is undefined', funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return
}

export function receiveWorkerMessage(message: IpcMessage): void {
  const funcName: string = 'receiveWorkerMessage'
  entryLog(funcName, fileName, area)

  switch (message.id) {
    case 'storage-location': {
      infoLog('storage location parsed', funcName, fileName, area)
      const message = new IpcMessage('storage-location', app.getPath('userData'))
      storageLocation = app.getPath('userData')
      sendMessageWorker(message)
      break
    }
    case 'rule-status': {
      infoLog('rule status resposne parsed', funcName, fileName, area)
      if (ruleStatusPendingRequests.has(message.data.requestId)) {
        condLog('Pending request found', funcName, fileName, area)
        // Resolve the Promise with the worker's response
        ruleStatusPendingRequests.get(message.data.requestId).resolve(message.data)
        ruleStatusPendingRequests.delete(message.data.requestId) // Cleanup
      }
      break
    }
    case 'rule-status-all': {
      infoLog('rule status resposne parsed', funcName, fileName, area)
      if (ruleStatusAllPendingRequests.has(message.data.requestId)) {
        condLog('Pending request found', funcName, fileName, area)
        // Resolve the Promise with the worker's response
        ruleStatusAllPendingRequests.get(message.data.requestId).resolve(message.data)
        ruleStatusAllPendingRequests.delete(message.data.requestId) // Cleanup
      }
      break
    }
  }

  exitLog(funcName, fileName, area)
  return
}
