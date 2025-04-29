import { AsyncIpcMessage, SyncIpcMessage } from '@shared/utils/ipc'

const fileName: string = 'mainIpcSender.ts'
const area: string = 'ipc'

function sendIpcMessageMain(message: AsyncIpcMessage | SyncIpcMessage): void {
  const funcName: string = 'sendIpcMessageMain'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.mainPort?.start()
  glob.workerGlobals.mainPort?.postMessage(message)
  ipcSentLog(`Worker->Main Message: ${message.type}`, funcName, fileName, area)

  exitLog(funcName, fileName, area)
  return
}

export function sendAsyncIpcMessageMain(type: string, data: unknown): void {
  const funcName: string = 'sendAsyncIpcMessageMain'
  entryLog(funcName, fileName, area)

  sendIpcMessageMain(new AsyncIpcMessage(type, data))

  exitLog(funcName, fileName, area)
  return
}

export async function sendSyncIpcMessageMain(type: string, data: unknown): Promise<unknown> {
  const funcName: string = 'sendSyncIpcMessageMain'
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
  const funcName: string = 'replySyncIpcMessageMain'
  entryLog(funcName, fileName, area)

  SyncIpcMessage.replySyncIpc(originalMessage, data, sendIpcMessageMain)

  exitLog(funcName, fileName, area)
  return
}
