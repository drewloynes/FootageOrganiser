import { Settings } from '@worker/settings/settings'

const fileName = 'upcomingSettings.ts'
const area = 'settings'

export function modifyUpcomingSettings(newSettings: Settings): void {
  const funcName = 'modifyUpcomingSettings'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.upcomingSettings = newSettings

  exitLog(funcName, fileName, area)
  return
}
