import { sleep } from '@shared-node/utils/timer'
import { DriveInfo } from '@worker/drives/driveInfo'
import { macGetVolNameFromFs } from '@worker/drives/macOs'
import { winGetVolNameFromMount } from '@worker/drives/winOs'
import { endReevaluationSleepEarly } from '@worker/runWorker'
import si from 'systeminformation'

const fileName = 'currentDriveInfo.ts'
const area = 'drive-info'

export async function autoUpdateCurrentDriveInfo(): Promise<void> {
  const funcName = 'autoUpdateCurrentDriveInfo'
  entryLog(funcName, fileName, area)

  const sleepTime = 10000 // Time to sleep before recalculating drive info - 10 seconds
  while (true) {
    condLog(`Start infinite updateCurrentDriveInfo loop`, funcName, fileName, area)
    await sleep(sleepTime)
    const connectedDrivesChanged = await updateCurrentDriveInfo()
    if (connectedDrivesChanged) {
      condLog(`Connected drives changed`, funcName, fileName, area)
      endReevaluationSleepEarly()
    }
  }
}

export async function updateCurrentDriveInfo(): Promise<boolean> {
  const funcName = 'updateCurrentDriveInfo'
  entryLog(funcName, fileName, area)

  const newCurrentDriveInfo: DriveInfo[] = []
  const siDrives: si.Systeminformation.FsSizeData[] = await si.fsSize()
  // Attempt to fill in currentDriveInfo
  for (const siDrive of siDrives) {
    condLog(`For drive mounted:'${siDrive.mount}'`, funcName, fileName, area)

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

    newCurrentDriveInfo.push(new DriveInfo(volumeName, siDrive))
  }

  // find if connected drives has changed
  const connectDrivesChanged: boolean = hasConnectDrivesChanged(newCurrentDriveInfo)
  glob.workerGlobals.currentDriveInfo = newCurrentDriveInfo

  if (glob.workerGlobals.currentDriveInfo.length < 1) {
    errorLog('No drives were found - not even the internal', funcName, fileName, area)
    // Should always have atleast the internal drive!
    throw 'Failed to find the internal drive'
  }

  // report currentDrives changed
  exitLog(funcName, fileName, area)
  return connectDrivesChanged
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

export function hasConnectDrivesChanged(newCurrentDriveInfo: DriveInfo[]): boolean {
  const funcName: string = 'hasConnectDrivesChanged'
  entryLog(funcName, fileName, area)

  if (glob.workerGlobals.currentDriveInfo === undefined) {
    condExitLog(`Current drive info doesnt exist`, funcName, fileName, area)
    return false
  }

  if (glob.workerGlobals.currentDriveInfo.length !== newCurrentDriveInfo.length) {
    condExitLog(`Number of connected drives changed`, funcName, fileName, area)
    return true
  }

  const volumeNamesOld = new Set(
    glob.workerGlobals.currentDriveInfo.map((drive) => drive.volumeName)
  )
  const volumeNamesNew = new Set(newCurrentDriveInfo.map((drive) => drive.volumeName))
  for (const volumeName of volumeNamesOld) {
    condLog(`For volumeName ${volumeName}`, funcName, fileName, area)
    if (!volumeNamesNew.has(volumeName)) {
      condExitLog(`volumeName not in latest currentDriveInfo`, funcName, fileName, area)
      return true
    }
  }

  exitLog(funcName, fileName, area)
  return false
}
