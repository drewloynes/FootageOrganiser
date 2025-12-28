import { Alert } from '@shared-all/types/alert'
import { Notification } from 'electron/main'

const fileName = 'system.ts'
const area = 'utils'

export function systemNotification(alert: Alert): void {
  const funcName = 'systemNotification'
  entryLog(funcName, fileName, area)

  new Notification({ title: alert.title, body: alert.message }).show()

  exitLog(funcName, fileName, area)
  return
}
