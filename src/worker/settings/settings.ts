import { CHECKSUM_TYPE } from '@shared/utils/checksum'

const fileName: string = 'settings.ts'
const area: string = 'settings'

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
    actionsCutoffInGBs: number = 10,
    deleteOldLogsInDays: number = 30,
    checksumMethod: CHECKSUM_TYPE = CHECKSUM_TYPE.CRC,
    reevaluateSleepTime: number = 10
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

  get actionsCutoffInGBs() {
    return this.#actionsCutoffInGBs
  }

  get deleteOldLogsInDays() {
    return this.#deleteOldLogsInDays
  }

  get checksumMethod() {
    return this.#checksumMethod
  }

  get reevaluateSleepTime() {
    return this.#reevaluateSleepTime
  }
}
