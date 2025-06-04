import { StorePathInVolume } from '@shared-all/types/pathInVolumeTypes'
import { PATH_IN_VOLUME_TYPE, PathInVolume } from '@worker/path/pathInVolume'

const fileName: string = 'storePathInVolume.ts'
const area: string = 'store'

export async function toPathInVolume(
  storePathInVolume: StorePathInVolume,
  pathInVolumeType: PATH_IN_VOLUME_TYPE
): Promise<PathInVolume> {
  const funcName = 'toPathInVolume'
  entryLog(funcName, fileName, area)

  const rulePath: PathInVolume = new PathInVolume(
    storePathInVolume.volumeName,
    storePathInVolume.pathFromVolumeRoot,
    pathInVolumeType,
    storePathInVolume.filesToInclude.filter((fileFilter) => fileFilter !== ''),
    storePathInVolume.filesToExclude.filter((fileFilter) => fileFilter !== ''),
    storePathInVolume.dirsToInclude.filter((dirFilter) => dirFilter !== ''),
    storePathInVolume.dirsToExclude.filter((dirFilter) => dirFilter !== '')
  )

  exitLog(funcName, fileName, area)
  return rulePath
}

export function toStorePathInVolume(pathInVolume: PathInVolume): StorePathInVolume {
  const funcName = 'toStorePathInVolume'
  entryLog(funcName, fileName, area)

  const storeRulePath: StorePathInVolume = {
    volumeName: pathInVolume.volumeName,
    pathFromVolumeRoot: pathInVolume.pathFromVolumeRoot,
    filesToInclude: pathInVolume.filesToInclude,
    filesToExclude: pathInVolume.filesToExclude,
    dirsToInclude: pathInVolume.dirsToInclude,
    dirsToExclude: pathInVolume.dirsToExclude
  }

  exitLog(funcName, fileName, area)
  return storeRulePath
}
