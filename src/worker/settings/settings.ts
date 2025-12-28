import { CHECKSUM_TYPE } from '@shared-node/utils/checksum'

const fileName = 'settings.ts'
const area = 'settings'

export class Settings {
  // Minimum GBs of free storage in target path for action to be performed. Otherwise disable rule
  #actionsCutoffInGBs: number // GBs
  // Age in days to delete old action logs.
  #deleteOldLogsInDays: number // Days
  // Method of running check sums
  #checksumMethod: CHECKSUM_TYPE
  // Sleep time after an evaluation of no work
  #reevaluateSleepTime: number // Time in minutes

  constructor(
    actionsCutoffInGBs = 10,
    deleteOldLogsInDays = 30,
    checksumMethod: CHECKSUM_TYPE = CHECKSUM_TYPE.CRC,
    reevaluateSleepTime = 10
  ) {
    const funcName = 'Settings Constructor'
    entryLog(funcName, fileName, area)

    this.#actionsCutoffInGBs = actionsCutoffInGBs
    this.#deleteOldLogsInDays = deleteOldLogsInDays
    this.#checksumMethod = checksumMethod
    this.#reevaluateSleepTime = reevaluateSleepTime

    exitLog(funcName, fileName, area)
    return
  }

  get actionsCutoffInGBs(): number {
    return this.#actionsCutoffInGBs
  }

  get deleteOldLogsInDays(): number {
    return this.#deleteOldLogsInDays
  }

  get checksumMethod(): CHECKSUM_TYPE {
    return this.#checksumMethod
  }

  get reevaluateSleepTime(): number {
    return this.#reevaluateSleepTime
  }
}
