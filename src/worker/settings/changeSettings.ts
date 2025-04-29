import { endReevaluationSleepEarly } from '@worker/runWorker'
import { CHANGE_TYPE } from '@worker/state-changes/change'
import { addAwaitingChange } from '@worker/state-changes/changeState'
import { deleteOldLogs } from '@worker/storage/logs/storeLogs'
import { modifyCurrentSettings } from './currentSettings'
import { modifyUpcomingSettings } from './upcomingSettings'
import { StoreSettings } from '@shared/types/settingsTypes'
import { toSettings } from '@worker/storage/settings/storeSettings'
import { Settings } from './settings'

const fileName = 'changeSettings.ts'
const area = 'settings'

export async function modifySettings(newStoreSettings: StoreSettings): Promise<void> {
  const funcName = 'modifySettings'
  entryLog(funcName, fileName, area)

  const newSettings: Settings | undefined = toSettings(newStoreSettings)
  if (!newSettings) {
    debugExitLog(`Settings couldn't be created from StoreSettings`, funcName, fileName, area)
    return
  }

  if (
    glob.workerGlobals.upcomingSettings ||
    (glob.workerGlobals.currentSettings &&
      glob.workerGlobals.currentSettings.checksumMethod !== newSettings.checksumMethod)
  ) {
    condLog(`Upcoming settings is being set or changing checksum`, funcName, fileName, area)
    addAwaitingChange(CHANGE_TYPE.MODIFY_SETTINGS, { newStoreSettings })
    modifyUpcomingSettings(newSettings)
  } else {
    condLog(`Can change settings immediately`, funcName, fileName, area)

    const shouldRunDeleteOldLogs: boolean =
      glob.workerGlobals.currentSettings?.deleteOldLogsInDays !== newSettings.deleteOldLogsInDays

    await modifyCurrentSettings(newSettings)
    endReevaluationSleepEarly()

    if (shouldRunDeleteOldLogs) {
      condLog(`Run delete old logs`, funcName, fileName, area)
      deleteOldLogs()
    }
  }

  exitLog(funcName, fileName, area)
  return
}
