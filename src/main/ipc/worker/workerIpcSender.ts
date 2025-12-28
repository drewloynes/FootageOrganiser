import { AsyncIpcMessage, SyncIpcMessage } from '@shared-node/utils/ipc'

const fileName = 'workerIpcSender.ts'
const area = 'worker-ipc'

function sendIpcMessageWorker(message: AsyncIpcMessage | SyncIpcMessage): void {
  const funcName = 'sendIpcMessageWorker'
  entryLog(funcName, fileName, area)

  glob.mainGlobals.workerPort?.postMessage(message)
  ipcSentLog(`Main->Worker Message: ${message.type}`, funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return
}

export function sendAsyncIpcMessageWorker(type: string, data: unknown): void {
  const funcName = 'sendAsyncIpcMessageWorker'
  entryLog(funcName, fileName, area)

  sendIpcMessageWorker(new AsyncIpcMessage(type, data))

  exitLog(funcName, fileName, area)
  return
}

export async function sendSyncIpcMessageWorker(type: string, data: unknown): Promise<unknown> {
  const funcName = 'sendSyncIpcMessageWorker'
  entryLog(funcName, fileName, area)

  const receivedData = await SyncIpcMessage.sendSyncIpc(
    type,
    data,
    sendIpcMessageWorker,
    glob.mainGlobals.awaitingIpcMessages
  )

  exitLog(funcName, fileName, area)
  return receivedData
}

export function replySyncIpcMessageWorker(originalMessage: SyncIpcMessage, data: unknown): void {
  const funcName = 'replySyncIpcMessageWorker'
  entryLog(funcName, fileName, area)

  SyncIpcMessage.replySyncIpc(originalMessage, data, sendIpcMessageWorker)

  exitLog(funcName, fileName, area)
  return
}
