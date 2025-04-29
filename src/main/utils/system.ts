import { Alert } from '@shared/types/alert'
import { Notification } from 'electron/main'

const fileName: string = 'system.ts'
const area: string = 'utils'

export function systemNotification(alert: Alert): void {
  const funcName: string = 'systemNotification'
  entryLog(funcName, fileName, area)

  new Notification({ title: alert.title, body: alert.message }).show()

  exitLog(funcName, fileName, area)
  return
}
