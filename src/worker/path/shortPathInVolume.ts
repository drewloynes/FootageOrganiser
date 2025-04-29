import { ShortPathInVolume } from '@shared/types/pathInVolumeTypes'
import { getDriveInfoFromPath, updateCurrentDriveInfo } from '@worker/drives/currentDriveInfo'
import { DriveInfo } from '@worker/drives/driveInfo'

const fileName: string = 'shortPathInVolume.ts'
const area: string = 'path'

export async function getShortPathInVolumeFromPath(
  path: string
): Promise<ShortPathInVolume | undefined> {
  const funcName: string = 'getShortPathInVolumeFromPath'
  entryLog(funcName, fileName, area)

  await updateCurrentDriveInfo()

  let shortPathInVolume: ShortPathInVolume | undefined = undefined
  const driveInfo: DriveInfo | undefined = getDriveInfoFromPath(path)
  if (driveInfo) {
    condLog(`Drive info found, VolumeName: ${driveInfo.volumeName}`, funcName, fileName, area)
    shortPathInVolume = {
      volumeName: driveInfo.volumeName,
      pathFromVolumeRoot: path.slice(driveInfo.mount.length)
    }
  }

  exitLog(funcName, fileName, area)
  return shortPathInVolume
}
