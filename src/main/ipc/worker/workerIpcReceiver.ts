import { systemNotification } from '@main/utils/system'
import { workerSetupComplete } from '@main/worker/workerProcess'
import { Alert } from '@shared-all/types/alert'
import { FullRule, ShortRule } from '@shared-all/types/ruleTypes'
import { AsyncIpcMessage, SyncIpcMessage } from '@shared-node/utils/ipc'
import { app } from 'electron/main'
import {
  sendAlertToWindow,
  sendAllRulesToWindow,
  sendRuleToWindow
} from '../window/windowIpcSender'
import { replySyncIpcMessageWorker } from './workerIpcSender'

const fileName = 'workerIpcReceiver.ts'
const area = 'worker-ipc'

export async function parseWorkerIpcMessage(message: AsyncIpcMessage | SyncIpcMessage): Promise<void> {
  const funcName = 'parseWorkerIpcMessage'
  entryLog(funcName, fileName, area)

  switch (message.type) {
    // Sync from main
    case 'alive': {
      condLog('Received alive IPC message', funcName, fileName, area)
      SyncIpcMessage.receiveSentSyncIpc(
        message as SyncIpcMessage,
        glob.mainGlobals.awaitingIpcMessages
      )
      break
    }
    // Sync from worker
    case 'storage-location': {
      condLog('Received storage-location IPC message', funcName, fileName, area)
      replySyncIpcMessageWorker(message as SyncIpcMessage, app.getPath('userData'))
      break
    }
    // Sync from main
    case 'worker-setup': {
      condLog('Received worker-setup IPC message', funcName, fileName, area)
      await workerSetupComplete()
      break
    }
    // Sync from main
    case 'get-short-path-in-volume': {
      condLog('Received get-short-path-in-volume IPC message', funcName, fileName, area)
      SyncIpcMessage.receiveSentSyncIpc(
        message as SyncIpcMessage,
        glob.mainGlobals.awaitingIpcMessages
      )
      break
    }
    // Sync from main
    case 'get-all-rules': {
      condLog('Received get-all-rules IPC message', funcName, fileName, area)
      SyncIpcMessage.receiveSentSyncIpc(
        message as SyncIpcMessage,
        glob.mainGlobals.awaitingIpcMessages
      )
      break
    }
    // Sync from main
    case 'get-rule': {
      condLog('Received get-rule IPC message', funcName, fileName, area)
      SyncIpcMessage.receiveSentSyncIpc(
        message as SyncIpcMessage,
        glob.mainGlobals.awaitingIpcMessages
      )
      break
    }
    // Sync from main
    case 'get-settings': {
      condLog('Received get-rule IPC message', funcName, fileName, area)
      SyncIpcMessage.receiveSentSyncIpc(
        message as SyncIpcMessage,
        glob.mainGlobals.awaitingIpcMessages
      )
      break
    }
    // Async from worker
    case 'alert': {
      condLog('Received alert IPC message', funcName, fileName, area)
      sendAlertToWindow(message.data as Alert)
      systemNotification(message.data as Alert)
      break
    }
    // Async stream message from worker
    case 'stream-current-rules': {
      condLog('Received stream-current-rules IPC message', funcName, fileName, area)
      sendAllRulesToWindow(message.data as ShortRule[])
      break
    }
    // Async stream message from worker
    case 'stream-rule': {
      condLog('Received stream-rule IPC message', funcName, fileName, area)
      sendRuleToWindow(message.data as FullRule)
      break
    }
    default: {
      debugLog('Received ICP message could not be identified', funcName, fileName, area)
      break
    }
  }

  exitLog(funcName, fileName, area)
  return
}
