import { TARGET_SUB_PATH_FORMAT_OPTIONS } from '@shared-all/types/copyFileTypes'
import { getVolumeNameFromPath } from '@worker/drives/currentDriveInfo'
import * as fs from 'fs'
import path from 'path'
import { PathInVolume } from '../path/pathInVolume'

const fileName = 'typeCopyFileOptions.ts'
const area = 'rule-options'

export class CopyFileOptions {
  // Format of the directory path to copy to.
  // - E.G. year/month/day/[copied files]
  #targetSubPathFormat: TARGET_SUB_PATH_FORMAT_OPTIONS[]
  // String for the custom directory name in the targetSubPathFormat
  #customDirectoryName: string

  // Delete copied files from origin when successfully copied
  // - Only successfully copied once after a checksum validaqtion
  #deleteCopiedFiles: boolean
  // Delete extra files and directories under other paths after successfully copying all files
  // - Successfully deleting all original files under origin
  // - Requires deleteCopiedFiles to be true
  #deleteUnderOtherPaths: boolean
  // Array of paths with filters to delete all filtered in files and directories.
  #otherPaths: PathInVolume[]

  constructor(
    targetSubPathFormat: TARGET_SUB_PATH_FORMAT_OPTIONS[],
    customDirectoryName: string,
    deleteCopiedFiles: boolean,
    deleteUnderOtherPaths: boolean,
    otherPaths: PathInVolume[]
  ) {
    const funcName = 'CopyFileOptions Constructor'
    entryLog(funcName, fileName, area)

    this.#targetSubPathFormat = targetSubPathFormat
    this.#customDirectoryName = customDirectoryName
    this.#deleteCopiedFiles = deleteCopiedFiles
    this.#deleteUnderOtherPaths = deleteUnderOtherPaths
    this.#otherPaths = otherPaths

    // Sanity check - This setting is not valid
    if (deleteCopiedFiles === false && deleteUnderOtherPaths === true) {
      errorLog(
        'deleteCopiedFiles is false but deleteUnderOtherPaths is true',
        funcName,
        fileName,
        area
      )
      throw 'deleteCopiedFiles must be true if deleteUnderOtherPaths is true'
    }

    exitLog(funcName, fileName, area)
    return
  }

  get targetSubPathFormat(): TARGET_SUB_PATH_FORMAT_OPTIONS[] {
    return this.#targetSubPathFormat
  }

  get customDirectoryName(): string {
    return this.#customDirectoryName
  }

  get deleteCopiedFiles(): boolean {
    return this.#deleteCopiedFiles
  }

  get deleteUnderOtherPaths(): boolean {
    return this.#deleteUnderOtherPaths
  }

  get otherPaths(): PathInVolume[] {
    return this.#otherPaths
  }

  clone(): CopyFileOptions {
    const funcName = 'clone'
    entryLog(funcName, fileName, area)

    const clonedTargetSubPathFormat: TARGET_SUB_PATH_FORMAT_OPTIONS[] = []
    for (const formatItem of this.targetSubPathFormat) {
      condLog(`For format item`, funcName, fileName, area)
      clonedTargetSubPathFormat.push(formatItem)
    }

    const clonedOtherPaths: PathInVolume[] = []
    for (const otherPath of this.otherPaths) {
      condLog(`For other path`, funcName, fileName, area)
      clonedOtherPaths.push(otherPath.clone())
    }

    const clonedCopyFileOptions: CopyFileOptions = new CopyFileOptions(
      clonedTargetSubPathFormat,
      this.customDirectoryName,
      this.deleteCopiedFiles,
      this.deleteUnderOtherPaths,
      clonedOtherPaths
    )

    exitLog(funcName, fileName, area)
    return clonedCopyFileOptions
  }

  async generateTargetSubPath(pathToOriginFile): Promise<string> {
    const funcName = 'generateTargetSubPath'
    entryLog(funcName, fileName, area)

    let formatPath = ''
    const fileStats = await fs.promises.stat(pathToOriginFile)

    for (const formatItem of this.targetSubPathFormat) {
      condLog(`Adding format ${formatItem}`, funcName, fileName, area)
      switch (formatItem) {
        case TARGET_SUB_PATH_FORMAT_OPTIONS.YEAR: {
          condLog(`Add year to path format`, funcName, fileName, area)
          formatPath = formatPath.concat(path.sep, `${fileStats.birthtime.getFullYear()}`)
          break
        }
        case TARGET_SUB_PATH_FORMAT_OPTIONS.MONTH: {
          condLog(`Add month to path format`, funcName, fileName, area)
          const monthNum: number = fileStats.birthtime.getMonth() + 1 // month counts from 0
          const monthName: string = fileStats.birthtime.toLocaleString('default', { month: 'long' })
          const monthPath = `${monthNum}-${monthName}`
          formatPath = formatPath.concat(path.sep, `${monthPath}`)
          break
        }
        case TARGET_SUB_PATH_FORMAT_OPTIONS.DAY: {
          condLog(`Add day to path format`, funcName, fileName, area)
          formatPath = formatPath.concat(path.sep, `${fileStats.birthtime.getDate()}`)
          break
        }
        case TARGET_SUB_PATH_FORMAT_OPTIONS.VOLUME_NAME: {
          condLog(`Add volumeName to path format`, funcName, fileName, area)
          let volumeName: string | undefined = getVolumeNameFromPath(pathToOriginFile)
          if (!volumeName) {
            condLog(`No file type`, funcName, fileName, area)
            volumeName = 'Unknown-Volume-Name'
          }
          formatPath = formatPath.concat(path.sep, `${volumeName}`)
          break
        }
        case TARGET_SUB_PATH_FORMAT_OPTIONS.FILE_FORMAT: {
          condLog(`Add fileFormat to path format`, funcName, fileName, area)
          let extensionName = path.extname(pathToOriginFile)
          if (extensionName === '') {
            condLog(`No file type`, funcName, fileName, area)
            extensionName = 'No-File-Type'
          } else {
            condLog(`File type found`, funcName, fileName, area)
            extensionName = extensionName.substring(1)
          }
          formatPath = formatPath.concat(path.sep, `${extensionName}`)
          break
        }
        case TARGET_SUB_PATH_FORMAT_OPTIONS.CUSTOM: {
          condLog(`Add custom to path format`, funcName, fileName, area)
          formatPath = formatPath.concat(path.sep, this.customDirectoryName)
          break
        }
        default: {
          warnLog(`Unknown item in target sub-path format array`, funcName, fileName, area)
        }
      }
    }

    debugLog(`Created target sub path: ${formatPath}`, funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return formatPath
  }
}
