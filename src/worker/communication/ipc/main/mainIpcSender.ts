import { IpcMessage } from '@shared/utils/ipc'
import { RuleStatus } from '@worker/rules/ruleStatus'

const fileName: string = 'mainIpcSender.ts'
const area: string = 'ipc'

// Send IPC to main process
function sendMessageMain(message: unknown): void {
  const funcName: string = 'sendMessageMain'
  entryLog(funcName, fileName, area)

  const mainPort: Electron.MessagePortMain | undefined = workerConfig.getMainPort()
  if (mainPort) {
    condLog('mainPort found', funcName, fileName, area)
    mainPort.start()
    mainPort.postMessage(message)
    ipcSentLog('Worker->Main Message', funcName, fileName, area)
  } else {
    warnLog('mainPort is undefined', funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return
}

// Request for storage location to be filled
export function requestStorageLocation(): void {
  const funcName: string = 'requestStorageLocation'
  entryLog(funcName, fileName, area)

  const message = new IpcMessage('storage-location', {})
  sendMessageMain(message)

  exitLog(funcName, fileName, area)
  return
}

// Request for storage location to be filled
export function sendRuleStatus(ruleStatus: object): void {
  const funcName: string = 'sendRuleStatus'
  entryLog(funcName, fileName, area)

  const message = new IpcMessage('rule-status', ruleStatus)
  sendMessageMain(message)

  exitLog(funcName, fileName, area)
  return
}

// Request for storage location to be filled
export function sendRuleStatusAll(ruleStatusAll: object): void {
  const funcName: string = 'sendRuleStatusAll'
  entryLog(funcName, fileName, area)

  const message = new IpcMessage('rule-status-all', ruleStatusAll)
  sendMessageMain(message)

  exitLog(funcName, fileName, area)
  return
}
