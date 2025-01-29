import { DriveInfo } from '@shared/drives/driveInfo'
import { join } from 'path'

const fileName: string = 'workerConfig.ts'
const area: string = 'worker'

export class WorkerConfig {
  private mainPort: Electron.MessagePortMain | undefined
  private storageLocation: string | undefined
  private currentDriveInfo: DriveInfo[] | undefined

  constructor() {
    const funcName: string = 'workerConfig Constructor'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return
  }

  /* mainPort Functions */

  setMainPort(port: Electron.MessagePortMain): void {
    const funcName: string = 'setMainPort'
    entryLog(funcName, fileName, area)

    this.mainPort = port

    exitLog(funcName, fileName, area)
    return
  }

  getMainPort(): Electron.MessagePortMain | undefined {
    const funcName: string = 'getMainPort'
    entryLog(funcName, fileName, area)

    if (!this.mainPort) {
      warnLog('mainPort is undefined', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return this.mainPort
  }

  /* storageLocation Functions */

  setStorageLocation(storageLocation: string): void {
    const funcName: string = 'setStorageLocation'
    entryLog(funcName, fileName, area)

    this.storageLocation = storageLocation

    exitLog(funcName, fileName, area)
    return
  }

  getStorageLocation(): string | undefined {
    const funcName: string = 'getStorageLocation'
    entryLog(funcName, fileName, area)

    if (!this.storageLocation) {
      warnLog('storageLocation is undefined', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return this.storageLocation
  }

  getRulesStorageLocation(): string | undefined {
    const funcName: string = 'getStorageLocation'
    entryLog(funcName, fileName, area)

    let rulesStorageLocation: string | undefined = undefined
    if (this.storageLocation) {
      condLog('Fill rules storage location', funcName, fileName, area)
      rulesStorageLocation = join(this.storageLocation, 'rules.json')
    } else {
      warnLog('storageLocation is undefined', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return rulesStorageLocation
  }

  /* currentDriveInfo Functions */

  getCurrentDriveInfo(): DriveInfo[] | undefined {
    const funcName: string = 'getCurrentDriveInfo'
    entryLog(funcName, fileName, area)

    if (!this.currentDriveInfo) {
      warnLog('currentDriveInfo is undefined', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return this.currentDriveInfo
  }

  // Get the latest information on drives conencted to the computer, update workerConfig.currentDriveinfo
  async updateCurrentDriveInfo(): Promise<void> {
    const funcName: string = 'updateCurrentDriveInfo'
    entryLog(funcName, fileName, area)

    const drives: DriveInfo[] = await DriveInfo.getCurrentDriveInfoList()
    // Failed to find any drives - throw error
    if (drives.length === 0) {
      errorLog('Failed to get and parse any drives', funcName, fileName, area)
      throw 'Failed to get and parse any drives'
    }
    // Save drive to the workerConfig
    this.currentDriveInfo = drives

    exitLog(funcName, fileName, area)
    return
  }
}

export default WorkerConfig
