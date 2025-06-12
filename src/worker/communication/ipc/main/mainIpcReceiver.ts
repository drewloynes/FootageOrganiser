import { ModifyRuleInfo, StoreRule } from '@shared-all/types/ruleTypes'
import { StoreSettings } from '@shared-all/types/settingsTypes'
import { AsyncIpcMessage, SyncIpcMessage } from '@shared-node/utils/ipc'
import { getShortPathInVolumeFromPath } from '@worker/path/shortPathInVolume'
import {
  activateRuleCurrentRules,
  addRuleCurrentRules,
  deleteRuleCurrentRules,
  disableAllRulesCurrentRules,
  disableRuleCurrentRules,
  evaluateAllRulesCurrentRules,
  getAllRulesToSendCurrentRules,
  getRuleToSendCurrentRules,
  modifyRuleCurrentRules,
  startAllRulesStreamCurrentRules,
  startRuleCurrentRules,
  startRuleStreamCurrentRules,
  stopAllRulesCurrentRules,
  stopAllRulesStreamCurrentRules,
  stopEveryRuleStreamCurrentRules,
  stopRuleCurrentRules,
  stopRuleStreamCurrentRules
} from '@worker/rules/currentRules'
import { modifySettings } from '@worker/settings/changeSettings'
import { getCurrentSettingsToSend } from '@worker/settings/currentSettings'
import { replySyncIpcMessageMain } from './mainIpcSender'

const fileName: string = 'mainIpcReceiver.ts'
const area: string = 'ipc'

export async function parseMainIpcMessage(
  message: AsyncIpcMessage | SyncIpcMessage
): Promise<void> {
  const funcName: string = 'parseMainIpcMessage'
  entryLog(funcName, fileName, area)

  switch (message.type) {
    // Async from main
    case 'alive': {
      condLog('Received alive IPC message', funcName, fileName, area)
      replySyncIpcMessageMain(message as SyncIpcMessage, undefined)
      break
    }
    // Sync from worker
    case 'storage-location': {
      condLog('Received storage-location IPC message', funcName, fileName, area)
      SyncIpcMessage.receiveSentSyncIpc(
        message as SyncIpcMessage,
        glob.workerGlobals.awaitingIpcMessages
      )
      break
    }
    // Sync from main
    case 'get-short-path-in-volume': {
      condLog('Received get-short-path-in-volume IPC message', funcName, fileName, area)
      replySyncIpcMessageMain(
        message as SyncIpcMessage,
        await getShortPathInVolumeFromPath(message.data as string)
      )
      break
    }
    // Async message
    case 'evaluate-all-rules': {
      condLog('evaluate-all-rules message received', funcName, fileName, area)
      evaluateAllRulesCurrentRules()
      break
    }
    // Async message
    case 'add-rule': {
      condLog('add-rule message received', funcName, fileName, area)
      await addRuleCurrentRules(message.data as StoreRule)
      break
    }
    // Async message
    case 'modify-rule': {
      condLog('modify-rule message received', funcName, fileName, area)
      const modifyRuleInfo: ModifyRuleInfo = message.data as ModifyRuleInfo
      await modifyRuleCurrentRules(
        modifyRuleInfo.originalRuleName,
        modifyRuleInfo.modifiedStoreRule
      )
      break
    }
    // Async message
    case 'delete-rule': {
      condLog('delete-rule message received', funcName, fileName, area)
      await deleteRuleCurrentRules(message.data as string)
      break
    }
    // Async message
    case 'start-rule': {
      condLog('start-rule message received', funcName, fileName, area)
      startRuleCurrentRules(message.data as string)
      break
    }
    // Async message
    case 'stop-rule': {
      condLog('stop-rule message received', funcName, fileName, area)
      stopRuleCurrentRules(message.data as string)
      break
    }
    // Async message
    case 'stop-all-rules': {
      condLog('stop-all-rules message received', funcName, fileName, area)
      stopAllRulesCurrentRules()
      break
    }
    // Async message
    case 'activate-rule': {
      condLog('activate-rule message received', funcName, fileName, area)
      await activateRuleCurrentRules(message.data as string)
      break
    }
    // Async message
    case 'disable-rule': {
      condLog('disable-rule message received', funcName, fileName, area)
      await disableRuleCurrentRules(message.data as string)
      break
    }
    // Async message
    case 'disable-all-rules': {
      condLog('disable-all-rules message received', funcName, fileName, area)
      await disableAllRulesCurrentRules()
      break
    }
    // Sync from main
    case 'get-all-rules': {
      condLog('get-all-rules message received', funcName, fileName, area)
      replySyncIpcMessageMain(message as SyncIpcMessage, getAllRulesToSendCurrentRules())
      break
    }
    // Sync from main
    case 'get-rule': {
      condLog('get-rule message received', funcName, fileName, area)
      replySyncIpcMessageMain(
        message as SyncIpcMessage,
        getRuleToSendCurrentRules(message.data as string)
      )
      break
    }
    // Async stream programming message
    case 'start-all-rules-stream': {
      condLog('start-all-rules-stream message received', funcName, fileName, area)
      startAllRulesStreamCurrentRules()
      break
    }
    // Async stream programming message
    case 'stop-all-rules-stream': {
      condLog('stop-all-rules-stream message received', funcName, fileName, area)
      stopAllRulesStreamCurrentRules()
      break
    }
    // Async stream programming message
    case 'start-rule-stream': {
      condLog('start-rule-stream message received', funcName, fileName, area)
      startRuleStreamCurrentRules(message.data as string)
      break
    }
    // Async stream programming message
    case 'stop-rule-stream': {
      condLog('stop-rule-stream message received', funcName, fileName, area)
      stopRuleStreamCurrentRules(message.data as string)
      break
    }
    // Async stream programming message
    case 'stop-every-rule-stream': {
      condLog('stop-every-rule-stream message received', funcName, fileName, area)
      stopEveryRuleStreamCurrentRules()
      break
    }
    // Async message
    case 'modify-settings': {
      condLog('modify-settings message received', funcName, fileName, area)
      await modifySettings(message.data as StoreSettings)
      break
    }
    // Sync from main
    case 'get-settings': {
      condLog('get-settings message received', funcName, fileName, area)
      replySyncIpcMessageMain(message as SyncIpcMessage, getCurrentSettingsToSend())
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
