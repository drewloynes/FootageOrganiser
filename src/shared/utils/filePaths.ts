import { join } from 'path'

const fileName: string = 'filePaths.ts'
const area: string = 'utils'

export function getRulesStorageLocation(): string | undefined {
  const funcName: string = 'getRulesStorageLocation'
  entryLog(funcName, fileName, area)

  let rulesStorageLocation: string | undefined = undefined
  if (storageLocation) {
    condLog('Fill rules storage location', funcName, fileName, area)
    rulesStorageLocation = join(storageLocation, 'rules.json')
  } else {
    warnLog('storageLocation is undefined', funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return rulesStorageLocation
}

export function getSettingsStorageLocation(): string | undefined {
  const funcName: string = 'getSettingsStorageLocation'
  entryLog(funcName, fileName, area)

  let settingsStorageLocation: string | undefined = undefined
  if (storageLocation) {
    condLog('Fill settings storage location', funcName, fileName, area)
    settingsStorageLocation = join(storageLocation, 'settings.json')
  } else {
    warnLog('storageLocation is undefined', funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return settingsStorageLocation
}
