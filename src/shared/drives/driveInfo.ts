import si from 'systeminformation'
import { winGetVolNameFromMount } from '@shared/utils/winOsUtils'
import { macGetVolNameFromFs } from '@shared/utils/macOsUtils'
import { linGetVolNameFromFs } from '@shared/utils/linOsUtils'

const fileName = 'driveInfo.ts'
const area = 'Drive Information'

export class DriveInfo {
  volumeName: string
  mount: string
  fs: string
  size: number
  used: number
  available: number

  /* --- Functions --- */

  public constructor(volumeName: string, siDriveInfo: si.Systeminformation.FsSizeData) {
    const funcName = 'DriveInfo Constructor'
    entryLog(funcName, fileName, area)

    this.volumeName = volumeName
    this.mount = siDriveInfo.mount
    this.fs = siDriveInfo.fs
    this.size = siDriveInfo.size
    this.used = siDriveInfo.used
    this.available = siDriveInfo.available

    exitLog(funcName, fileName, area)
    return
  }

  // Get a filled list of current DriveInfo
  static async getCurrentDriveInfoList(): Promise<DriveInfo[]> {
    const funcName = 'DriveInfo Constructor'
    entryLog(funcName, fileName, area)

    // Get info from systeminformation module
    const siDrives: si.Systeminformation.FsSizeData[] = await si.fsSize()
    // Fill DriveInfo array
    const drives: DriveInfo[] = []
    for (const siDrive of siDrives) {
      condLog(`For each item of mountToNames`, funcName, fileName, area)
      // Get volume name from Exec commands
      let volumeName: string | undefined = undefined
      switch (process.platform) {
        case 'win32': {
          condLog(`Windows: Get Volume Name`, funcName, fileName, area)
          volumeName = await winGetVolNameFromMount(siDrive.mount)
          break
        }
        case 'darwin': {
          condLog(`Mac: Get Volume Name`, funcName, fileName, area)
          // Only care about Macintosh HD and external mounted drives
          if (siDrive.mount === '/' || siDrive.mount.startsWith('/Volumes')) {
            condLog(`External Drive or Mac HD`, funcName, fileName, area)
            volumeName = await macGetVolNameFromFs(siDrive.fs)
          }
          break
        }
        case 'linux': {
          condLog(`Linux: Get Volume Name`, funcName, fileName, area)
          volumeName = await linGetVolNameFromFs(siDrive.fs)
          break
        }
      }
      if (volumeName === undefined) {
        condLog(`volumeName was not defined`, funcName, fileName, area)
        continue
      }
      // Fill the drive information and save to drives
      const newDriveInfo: DriveInfo = new DriveInfo(volumeName, siDrive)
      drives.push(newDriveInfo)
    }
    // Should always have atleast the internal drive!
    if (drives.length < 1) {
      errorLog('No drives were found - not even the internal', funcName, fileName, area)
    } else {
      infoLog(`Found ${drives.length} drives`, funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return drives
  }

  static getVolNameFromPath(path: string): string {
    const funcName: string = 'getVolNameFromPath'
    entryLog(funcName, fileName, area)

    const driveInfos: DriveInfo[] | undefined = workerConfig.getCurrentDriveInfo()
    let volumeName: string = 'Unknown'
    if (driveInfos) {
      condLog(`Loop through driveInfos`, funcName, fileName, area)
      for (const driveInfo of driveInfos) {
        condLog(`Test if path starts with drive mount`, funcName, fileName, area)
        if (path.startsWith(driveInfo.mount)) {
          condLog(`Match with mount ${driveInfo.mount}`, funcName, fileName, area)
          volumeName = driveInfo.volumeName
        }
      }
    }

    exitLog(funcName, fileName, area)
    return volumeName
  }
}
