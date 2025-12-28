import { StoreSettings } from '@shared-all/types/settingsTypes'
import { STORE_SETTINGS_ZOD_SCHEMA } from '@shared-all/validation/validateSettings'
import { pathExists } from '@shared-node/utils/filePaths'
import { toSettings, toStoreSettings } from '@worker/storage/settings/storeSettings'
import { loadData, saveData } from '@worker/storage/storeData'
import { join } from 'path'
import { Settings } from './settings'

const fileName = 'currentSettings.ts'
const area = 'settings'

function getSettingsStorageLocation(): string {
  const funcName = 'getSettingsStorageLocation'
  entryLog(funcName, fileName, area)

  let settingsStorageLocation = ''
  if (glob.workerGlobals.storageLocation !== undefined) {
    condLog('Storage location set', funcName, fileName, area)
    settingsStorageLocation = join(glob.workerGlobals.storageLocation, 'settings.json')
  } else {
    errorLog('Storage location not set', funcName, fileName, area)
    throw 'Storage location not set when it should be'
  }

  exitLog(funcName, fileName, area)
  return settingsStorageLocation
}

export async function setCurrentSettings(): Promise<void> {
  const funcName = 'setCurrentSettings'
  entryLog(funcName, fileName, area)

  if (!(await loadIntoCurrentSettings())) {
    condLog(`Initialise settings`, funcName, fileName, area)
    await initialiseCurrentSettings()
  }

  exitLog(funcName, fileName, area)
  return
}

async function loadIntoCurrentSettings(): Promise<boolean> {
  const funcName = 'loadIntoCurrentSettings'
  entryLog(funcName, fileName, area)

  const settingsStorageLocation: string = getSettingsStorageLocation()
  if (!pathExists(settingsStorageLocation)) {
    condExitLog(`Settings file doesn't exist`, funcName, fileName, area)
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storeSettingsData: any = await loadData(settingsStorageLocation)
  if (!STORE_SETTINGS_ZOD_SCHEMA.safeParse(storeSettingsData).success) {
    condExitLog('Loaded settings data not valid', funcName, fileName, area)
    return false
  }

  glob.workerGlobals.currentSettings = toSettings(storeSettingsData as StoreSettings)

  exitLog(funcName, fileName, area)
  return glob.workerGlobals.currentSettings !== undefined
}

async function initialiseCurrentSettings(): Promise<void> {
  const funcName = 'initialiseCurrentSettings'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.currentSettings = new Settings()
  await saveCurrentSettings()

  exitLog(funcName, fileName, area)
  return
}

async function saveCurrentSettings(): Promise<void> {
  const funcName = 'saveCurrentSettings'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.currentSettings) {
    errorExitLog('Current settings are undefined', funcName, fileName, area)
    return
  }

  await saveData(getSettingsStorageLocation(), toStoreSettings(glob.workerGlobals.currentSettings))

  exitLog(funcName, fileName, area)
  return
}

export async function modifyCurrentSettings(newSettings: Settings): Promise<void> {
  const funcName = 'modifyCurrentSettings'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.currentSettings = newSettings
  infoLog(`Settings modified`, funcName, fileName, area)

  await saveCurrentSettings()

  exitLog(funcName, fileName, area)
  return
}

function getCurrentSettings(): Settings | undefined {
  const funcName = 'getCurrentSettings'
  entryLog(funcName, fileName, area)

  let currentSettings: Settings | undefined = undefined
  if (glob.workerGlobals.upcomingSettings) {
    condLog('Upcoming settings exist', funcName, fileName, area)
    currentSettings = glob.workerGlobals.upcomingSettings
  } else if (glob.workerGlobals.currentSettings) {
    condLog('Current settings exist', funcName, fileName, area)
    currentSettings = glob.workerGlobals.currentSettings
  }

  exitLog(funcName, fileName, area)
  return currentSettings
}

export function getCurrentSettingsToSend(): StoreSettings | undefined {
  const funcName = 'getCurrentSettingsToSend'
  entryLog(funcName, fileName, area)

  const settings = getCurrentSettings()
  let settingsToSend: StoreSettings | undefined = undefined
  if (settings) {
    condLog('Settings defined', funcName, fileName, area)
    settingsToSend = toStoreSettings(settings)
  }

  exitLog(funcName, fileName, area)
  return settingsToSend
}
