import { loadData, pathExists, saveData } from '@shared/storage/storeData'
import { deleteOldLogs } from '@shared/storage/storeLogs'
import { CheckSumType } from '@shared/utils/checkSum'
import { getSettingsStorageLocation } from '@shared/utils/filePaths'
import { sleep } from '@shared/utils/timer'
import { InputQueue } from '@worker/communication/ipc/inputQueue'

const fileName: string = 'setings.ts'
const area: string = 'settings'

export class Settings {
  actionCutoffInGBs: number
  autodeleteLogsInDays: number
  checksumMethod: CheckSumType
  syncTime: number

  constructor(
    actionCutoffInGBs: number = 10,
    autodeleteLogsInDays: number = 30,
    checksumMethod: CheckSumType = CheckSumType.CRC,
    syncTime: number = 10
  ) {
    const funcName = 'Settings Constructor'
    entryLog(funcName, fileName, area)

    this.actionCutoffInGBs = actionCutoffInGBs
    this.autodeleteLogsInDays = autodeleteLogsInDays
    this.checksumMethod = checksumMethod
    // time in minutes
    this.syncTime = syncTime

    exitLog(funcName, fileName, area)
    return
  }

  async changed() {
    const funcName = 'changed'
    entryLog(funcName, fileName, area)

    const newSettings: Settings | undefined = await Settings.loadSettings()
    if (newSettings && footageOrganiserSettings) {
      condLog('New settings exist', funcName, fileName, area)
      // If the mew days is less than old days
      if (newSettings.autodeleteLogsInDays < footageOrganiserSettings.autodeleteLogsInDays) {
        condLog('autodeleteLogsInDays changed', funcName, fileName, area)
        deleteOldLogs(newSettings.autodeleteLogsInDays)
      }
      // If the checksum doesnt match, add to input queue - need to resync everything
      if (newSettings.checksumMethod !== footageOrganiserSettings.checksumMethod) {
        condLog('checksumMethod', funcName, fileName, area)
        workerConfig.getInputQueues().setResyncAll()
      }
    }
    footageOrganiserSettings = newSettings

    exitLog(funcName, fileName, area)
    return
  }

  async saveSettings(): Promise<boolean> {
    const funcName = 'saveSettings'
    entryLog(funcName, fileName, area)

    let savingSucess
    const settingsStorageLocation: string | undefined = getSettingsStorageLocation()
    if (settingsStorageLocation) {
      condLog('Saving success', funcName, fileName, area)
      await saveData(settingsStorageLocation, this)
      savingSucess = true
    } else {
      condLog('Saving failed', funcName, fileName, area)
      savingSucess = false
    }

    exitLog(funcName, fileName, area)
    return savingSucess
  }

  static async loadSettings(): Promise<Settings | undefined> {
    const funcName = 'loadSettings'
    entryLog(funcName, fileName, area)

    let settings: Settings | undefined = undefined
    const settingsStorageLocation: string | undefined = getSettingsStorageLocation()
    if (settingsStorageLocation) {
      condLog('Settings location found', funcName, fileName, area)
      if (pathExists(settingsStorageLocation)) {
        condLog('Settings exist - read it', funcName, fileName, area)
        const settingsData = await loadData(settingsStorageLocation)
        settings = new Settings(
          settingsData.actionCutoffInGBs,
          settingsData.autodeleteLogsInDays,
          settingsData.checksumMethod,
          settingsData.syncTime
        )
      } else {
        condLog('Settings dont exist', funcName, fileName, area)
        // init settings and save
        settings = new Settings()
        settings.saveSettings()
      }
    } else {
      condLog('Settings location unkown', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return settings
  }

  static async fillSettings(): Promise<void> {
    const funcName = 'fillSettings'
    entryLog(funcName, fileName, area)

    const settings: Settings | undefined = await this.loadSettings()
    if (settings) {
      condLog('Settings is found, fill it in', funcName, fileName, area)
      footageOrganiserSettings = settings
    } else {
      condLog('Settings not found - wait and try again', funcName, fileName, area)
      await sleep(500)
      this.fillSettings()
    }

    exitLog(funcName, fileName, area)
    return
  }

  getAutodeleteLogsInDays() {
    const funcName = 'getAutodeleteLogsInDays'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.autodeleteLogsInDays
  }

  getSyncTime() {
    const funcName = 'getSyncTime'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.syncTime
  }

  getActionCutoffInGBs() {
    const funcName = 'getActionCutoffInGBs'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.actionCutoffInGBs
  }
}
