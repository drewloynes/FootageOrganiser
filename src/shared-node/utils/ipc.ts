import { PromiseResolveRejectTimer } from './promise'

const fileName: string = 'ipc.ts'
const area: string = 'utils'

// Asynchronous messages (Not awaiting a reply)
export class AsyncIpcMessage {
  type: string
  data: unknown

  constructor(type: string, data: unknown) {
    this.type = type
    this.data = data
  }
}

// Synchronous message (Sender awaits the reply)
export class SyncIpcMessage {
  type: string
  id: string
  data: unknown

  constructor(type: string, id: string, data: unknown) {
    this.type = type
    this.id = id
    this.data = data
  }

  static generateId(): string {
    const funcName: string = 'generateId'
    entryLog(funcName, fileName, area)

    const id: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })

    exitLog(funcName, fileName, area)
    return id
  }

  static async sendSyncIpc(
    type: string,
    data: unknown,
    sendIpcMessage: (message: SyncIpcMessage) => void,
    promiseResovleRejectMap: Map<string, PromiseResolveRejectTimer>
  ): Promise<unknown> {
    const funcName: string = 'sendSyncIpc'
    entryLog(funcName, fileName, area)

    const sendIpcMessagePromise = new Promise((resolve, reject) => {
      condLog('sendIpcMessagePromise', funcName, fileName, area)

      const id = SyncIpcMessage.generateId()
      // Setup call back to time out message reply - 5 seconds
      const timer = setTimeout(() => {
        if (promiseResovleRejectMap.has(id)) {
          condLog('Map has ID - timing out', funcName, fileName, area)
          const ipcMessagesEntry = promiseResovleRejectMap.get(id)
          ipcMessagesEntry?.reject(new Error('sendSyncIpc timeout'))
          promiseResovleRejectMap.delete(id)
          errorLog(`Sync IPC of type ${type} timed out`, funcName, fileName, area)
        }
      }, 5000)

      // Store the request so it can be resolved later
      promiseResovleRejectMap.set(id, { resolve, reject, timer })

      const message = new SyncIpcMessage(type, id, data)
      sendIpcMessage(message)
    })

    exitLog(funcName, fileName, area)
    return sendIpcMessagePromise
  }

  static replySyncIpc(
    originalSyncIpcMessage: SyncIpcMessage,
    data: unknown,
    sendIpcMessage: (message: SyncIpcMessage) => void
  ): void {
    const funcName: string = 'replySyncIpc'
    entryLog(funcName, fileName, area)

    const replyMessage = new SyncIpcMessage(
      originalSyncIpcMessage.type,
      originalSyncIpcMessage.id,
      data
    )
    sendIpcMessage(replyMessage)

    exitLog(funcName, fileName, area)
    return
  }

  static receiveSentSyncIpc(
    syncIpcMessage: SyncIpcMessage,
    promiseResovleRejectMap: Map<string, PromiseResolveRejectTimer>
  ): void {
    const funcName: string = 'receiveSentSyncIpc'
    entryLog(funcName, fileName, area)

    if (promiseResovleRejectMap.has(syncIpcMessage.id)) {
      condLog('Awaited IPC message found', funcName, fileName, area)
      // Resolve the Promise with the data response
      const ipcMessagesEntry = promiseResovleRejectMap.get(syncIpcMessage.id)
      ipcMessagesEntry?.resolve(syncIpcMessage.data)
      clearTimeout(ipcMessagesEntry?.timer)
      promiseResovleRejectMap.delete(syncIpcMessage.id)
    } else {
      warnLog('Receive sent sync IPC message but not found on map', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return
  }
}
