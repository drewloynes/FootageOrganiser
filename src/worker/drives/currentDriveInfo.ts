import { DriveInfo } from '@worker/drives/driveInfo'
import { macGetVolNameFromFs } from '@worker/drives/macOs'
import { winGetVolNameFromMount } from '@worker/drives/winOs'
import si from 'systeminformation'

const fileName = 'currentDriveInfo.ts'
const area = 'drive-info'

export async function updateCurrentDriveInfo(): Promise<void> {
  const funcName = 'updateCurrentDriveInfo'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.currentDriveInfo = []
  const siDrives: si.Systeminformation.FsSizeData[] = await si.fsSize()
  // Attempt to fill in currentDriveInfo
  for (const siDrive of siDrives) {
    condLog(`For drived mounted:'${siDrive.mount}'`, funcName, fileName, area)

    // Get volume name using exec commands
    // - Windows: Get it using the mounted drive letter
    // - Mac: Get it using the file system of the drive
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
        // - These are under paths '/' and '/Volumes'
        if (siDrive.mount === '/' || siDrive.mount.startsWith('/Volumes')) {
          condLog(`External Drive or Mac HD`, funcName, fileName, area)
          volumeName = await macGetVolNameFromFs(siDrive.fs)
        }
        break
      }
    }

    if (volumeName === undefined) {
      condLog(`volumeName was not defined`, funcName, fileName, area)
      // Sometimes (for OS reasons) there is a drive without a volume name
      // That is okay. We can skip these drives
      continue
    }

    glob.workerGlobals.currentDriveInfo.push(new DriveInfo(volumeName, siDrive))
  }

  if (glob.workerGlobals.currentDriveInfo.length < 1) {
    errorLog('No drives were found - not even the internal', funcName, fileName, area)
    // Should always have atleast the internal drive!
    throw 'Failed to find the internal drive'
  }

  exitLog(funcName, fileName, area)
  return
}

export function getDriveInfoFromPath(path: string): DriveInfo | undefined {
  const funcName: string = 'getDriveInfoFromPath'
  entryLog(funcName, fileName, area)

  let driveInfoOfPath: DriveInfo | undefined = undefined

  if (!glob.workerGlobals.currentDriveInfo) {
    condLog(`Current drive info doesnt exist`, funcName, fileName, area)
    return driveInfoOfPath
  }

  // For mac this should loop through and match a /volume after matching macintosh hd's / (That is why there is no break)
  for (const driveInfo of glob.workerGlobals.currentDriveInfo) {
    condLog(`For volume name: ${driveInfo.volumeName}`, funcName, fileName, area)
    if (path.startsWith(driveInfo.mount)) {
      condLog(`Match found with mount ${driveInfo.mount}`, funcName, fileName, area)
      driveInfoOfPath = driveInfo
    }
  }

  exitLog(funcName, fileName, area)
  return driveInfoOfPath
}

export function getVolumeNameFromPath(path: string): string | undefined {
  const funcName: string = 'getVolNameFromPath'
  entryLog(funcName, fileName, area)

  const driveInfo: DriveInfo | undefined = getDriveInfoFromPath(path)
  let volumeName: string | undefined = undefined
  if (driveInfo) {
    condLog(`Drive info found, VolumeName: ${driveInfo.volumeName}`, funcName, fileName, area)
    volumeName = driveInfo.volumeName
  }

  exitLog(funcName, fileName, area)
  return volumeName
}
