import { AsyncIpcMessage, SyncIpcMessage } from '@shared-node/utils/ipc'

const fileName = 'mainIpcSender.ts'
const area = 'ipc'

function sendIpcMessageMain(message: AsyncIpcMessage | SyncIpcMessage): void {
  const funcName = 'sendIpcMessageMain'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.mainPort?.postMessage(message)
  ipcSentLog(`Worker->Main Message: ${message.type}`, funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return
}

export function sendAsyncIpcMessageMain(type: string, data: unknown): void {
  const funcName = 'sendAsyncIpcMessageMain'
  entryLog(funcName, fileName, area)

  sendIpcMessageMain(new AsyncIpcMessage(type, data))

  exitLog(funcName, fileName, area)
  return
}

export async function sendSyncIpcMessageMain(type: string, data: unknown): Promise<unknown> {
  const funcName = 'sendSyncIpcMessageMain'
  entryLog(funcName, fileName, area)

  const receivedData = await SyncIpcMessage.sendSyncIpc(
    type,
    data,
    sendIpcMessageMain,
    glob.workerGlobals.awaitingIpcMessages
  )

  exitLog(funcName, fileName, area)
  return receivedData
}

export function replySyncIpcMessageMain(originalMessage: SyncIpcMessage, data: unknown): void {
  const funcName = 'replySyncIpcMessageMain'
  entryLog(funcName, fileName, area)

  SyncIpcMessage.replySyncIpc(originalMessage, data, sendIpcMessageMain)

  exitLog(funcName, fileName, area)
  return
}
