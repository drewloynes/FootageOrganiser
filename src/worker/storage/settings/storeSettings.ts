import { StoreSettings } from '@shared-all/types/settingsTypes'
import { Settings } from '@worker/settings/settings'

const fileName = 'storeSettings.ts'
const area = 'store-settings'

export function toSettings(storeSettings: StoreSettings): Settings {
  const funcName = 'toSettings'
  entryLog(funcName, fileName, area)

  const settings: Settings = new Settings(
    storeSettings.actionsCutoffInGBs,
    storeSettings.deleteOldLogsInDays,
    storeSettings.checksumMethod,
    storeSettings.reevaluateSleepTime
  )

  exitLog(funcName, fileName, area)
  return settings
}

export function toStoreSettings(settings: Settings): StoreSettings {
  const funcName = 'toStoreSettings'
  entryLog(funcName, fileName, area)

  const storeRule: StoreSettings = {
    footageOrganiserVersion: FOOTAGE_ORGANISER_VERSION,
    actionsCutoffInGBs: settings.actionsCutoffInGBs,
    deleteOldLogsInDays: settings.deleteOldLogsInDays,
    checksumMethod: settings.checksumMethod,
    reevaluateSleepTime: settings.reevaluateSleepTime
  }

  exitLog(funcName, fileName, area)
  return storeRule
}
