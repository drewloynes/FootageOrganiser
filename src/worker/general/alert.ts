import { Alert } from '@shared/types/alert'
import { sendAsyncIpcMessageMain } from '@worker/communication/ipc/main/mainIpcSender'

const fileName: string = 'alert.ts'
const area: string = 'ipc'

export function sendAlertToMain(title: string, message: string): void {
  const funcName: string = 'sendAlertToMain'
  entryLog(funcName, fileName, area)

  sendAsyncIpcMessageMain('alert', new Alert(title, message))

  exitLog(funcName, fileName, area)
  return
}
