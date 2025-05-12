import { StoreCopyFileOptions } from '@shared-all/types/copyFileTypes'
import { StorePathInVolume } from '@shared-all/types/pathInVolumeTypes'
import { PATH_IN_VOLUME_TYPE, PathInVolume } from '@worker/path/pathInVolume'
import { CopyFileOptions } from '@worker/rules/copyFileOptions'
import { toPathInVolume, toStorePathInVolume } from '../path/storePathInVolume'

const fileName = 'storeCopyFileOptions.ts'
const area = 'store-rules'

export async function toCopyFileOptions(
  storeCopyFileOptions: StoreCopyFileOptions
): Promise<CopyFileOptions> {
  const funcName = 'toCopyFileOptions'
  entryLog(funcName, fileName, area)

  const otherPaths: PathInVolume[] = []
  for (const storePathInVolume of storeCopyFileOptions.otherPaths) {
    condLog('Add PathInVolume to otherPaths', funcName, fileName, area)
    otherPaths.push(await toPathInVolume(storePathInVolume, PATH_IN_VOLUME_TYPE.OTHER_PATHS))
  }

  const copyFileOptions = new CopyFileOptions(
    storeCopyFileOptions.targetSubPathFormat,
    storeCopyFileOptions.customDirectoryName,
    storeCopyFileOptions.deleteCopiedFiles,
    storeCopyFileOptions.deleteUnderOtherPaths,
    otherPaths
  )

  exitLog(funcName, fileName, area)
  return copyFileOptions
}

export function toStoreCopyFileOptions(copyFileOptions: CopyFileOptions): StoreCopyFileOptions {
  const funcName = 'toStoreCopyFileOptions'
  entryLog(funcName, fileName, area)

  const otherPaths: StorePathInVolume[] = []
  for (const pathInVolume of copyFileOptions.otherPaths) {
    condLog('Add StorePathInVolume to otherPaths', funcName, fileName, area)
    otherPaths.push(toStorePathInVolume(pathInVolume))
  }

  const storeCopyFileOptions: StoreCopyFileOptions = {
    targetSubPathFormat: copyFileOptions.targetSubPathFormat,
    customDirectoryName: copyFileOptions.customDirectoryName,
    deleteCopiedFiles: copyFileOptions.deleteCopiedFiles,
    deleteUnderOtherPaths: copyFileOptions.deleteUnderOtherPaths,
    otherPaths: otherPaths
  }

  exitLog(funcName, fileName, area)
  return storeCopyFileOptions
}
