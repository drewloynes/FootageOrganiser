import { Alert } from '@shared-all/types/alert'
import { sendAsyncIpcMessageMain } from '@worker/communication/ipc/main/mainIpcSender'

const fileName = 'alert.ts'
const area = 'ipc'

export function sendAlertToMain(title: string, message: string): void {
  const funcName = 'sendAlertToMain'
  entryLog(funcName, fileName, area)

  sendAsyncIpcMessageMain('alert', new Alert(title, message))

  exitLog(funcName, fileName, area)
  return
}
