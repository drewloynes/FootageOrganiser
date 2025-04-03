import { CheckSumType } from '@shared/utils/checkSum'

const fileName: string = 'settingsUtils.ts'
const area: string = 'settings'

export function intToExtSettings(intSettings): object {
  const funcName: string = 'intToExtSettings'
  entryLog(funcName, fileName, area)

  const extSettings = {
    actionCutoffInGBs: intSettings.actionCutoffInGBs,
    autodeleteLogsInDays: intSettings.autodeleteLogsInDays,
    checksumMethod: intToExtCheckSumMethod(intSettings.checksumMethod),
    syncTime: intSettings.syncTime
  }

  exitLog(funcName, fileName, area)
  return extSettings
}

export function intToExtCheckSumMethod(intCheckSumMethod): string {
  const funcName: string = 'intToExtCheckSumMethod'
  entryLog(funcName, fileName, area)

  let extCheckSumMethod: string = 'CRC'
  switch (intCheckSumMethod) {
    case 'crc': {
      extCheckSumMethod = 'CRC'
      break
    }
    case 'md5': {
      extCheckSumMethod = 'MD5'
      break
    }
    case 'sha-256': {
      extCheckSumMethod = 'SHA-256'
      break
    }
  }

  exitLog(funcName, fileName, area)
  return extCheckSumMethod
}

export function extToIntCheckSumMethod(extCheckSumMethod): CheckSumType {
  const funcName: string = 'extToIntCheckSumMethod'
  entryLog(funcName, fileName, area)

  let intCheckSumMethod: CheckSumType = CheckSumType.CRC
  switch (extCheckSumMethod) {
    case 'crc': {
      intCheckSumMethod = CheckSumType.CRC
      break
    }
    case 'md5': {
      intCheckSumMethod = CheckSumType.MD5
      break
    }
    case 'sha-256': {
      intCheckSumMethod = CheckSumType.SHA_256
      break
    }
  }

  exitLog(funcName, fileName, area)
  return intCheckSumMethod
}
