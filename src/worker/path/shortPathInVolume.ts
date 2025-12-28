import { ShortPathInVolume } from '@shared-all/types/pathInVolumeTypes'
import { getDriveInfoFromPath } from '@worker/drives/currentDriveInfo'
import { DriveInfo } from '@worker/drives/driveInfo'

const fileName = 'shortPathInVolume.ts'
const area = 'path'

export async function getShortPathInVolumeFromPath(
  path: string
): Promise<ShortPathInVolume | undefined> {
  const funcName = 'getShortPathInVolumeFromPath'
  entryLog(funcName, fileName, area)

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
