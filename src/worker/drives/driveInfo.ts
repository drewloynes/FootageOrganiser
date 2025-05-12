import si from 'systeminformation'

const fileName = 'driveInfo.ts'
const area = 'drive-info'

export class DriveInfo {
  // Volume Name of the drive
  // - e.g. 'Macintosh HD' for the Mac internal drive
  // - e.g. 'Windows' for the windows internal C drive
  volumeName: string

  // Drive details - Taken from system information library
  mount: string
  fs: string
  size: number
  used: number
  available: number

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
}
