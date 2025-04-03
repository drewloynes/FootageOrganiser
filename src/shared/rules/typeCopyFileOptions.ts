import { DriveInfo } from '@shared/drives/driveInfo'
import path from 'path'
import { RulePath } from './rulePath'

const fileName = 'typeCopyFileOptions.ts'
const area = 'rule options'

export enum TypeCopyFileFormatOptions {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day',
  VOLUME_NAME = 'volume-name',
  FILE_FORMAT = 'file-format',
  CUSTOM = 'custom'
}

export class TypeCopyFileOptions {
  private copyFormat: TypeCopyFileFormatOptions[]
  private customName: string
  // TODO change var names
  // only for deleting sucessfully copied files
  private autoCleanFromPath: boolean
  // Only delete extra files/dir when all files have successfully been copied
  private deleteExtra: boolean
  private extraDeletePaths: RulePath[]

  constructor(
    copyFormat: TypeCopyFileFormatOptions[],
    customName: string,
    autoCleanFromPath: boolean,
    deleteExtra: boolean,
    extraDeletePaths: RulePath[]
  ) {
    const funcName = 'TypeCopyFileOptions Constructor'
    entryLog(funcName, fileName, area)

    // TODO: validate copyFormat contains only types of the format options
    // TODO: validate customName contains only letters, nothing else
    this.copyFormat = copyFormat
    this.customName = customName
    if (autoCleanFromPath === false && deleteExtra === true) {
      throw 'autoCleanFromPath must be true if deleteExtra is true'
    }
    this.autoCleanFromPath = autoCleanFromPath
    this.deleteExtra = deleteExtra
    this.extraDeletePaths = extraDeletePaths

    exitLog(funcName, fileName, area)
    return
  }

  getCopyFortmat(): TypeCopyFileFormatOptions[] {
    const funcName = 'getCopyFortmat'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.copyFormat
  }

  getCustomName(): string {
    const funcName = 'getCustomName'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.customName
  }

  getAutoCleanFromPath(): boolean {
    const funcName = 'getCustomName'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.autoCleanFromPath
  }

  getDeleteExtra(): boolean {
    const funcName = 'getDeleteExtra'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.deleteExtra
  }

  getExtraDeletePaths(): RulePath[] {
    const funcName = 'getExtraDeletePaths'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.extraDeletePaths
  }

  generateFormatPath(fileStats, pathUnderOrigin) {
    const funcName = 'generateFormatPath'
    entryLog(funcName, fileName, area)

    let formatPath: string = ''
    for (const formatItem of this.copyFormat) {
      condLog(`Adding format ${formatItem}`, funcName, fileName, area)
      switch (formatItem) {
        case TypeCopyFileFormatOptions.YEAR: {
          condLog(`Add year to path format`, funcName, fileName, area)
          formatPath = formatPath.concat(path.sep, `${fileStats.birthtime.getFullYear()}`)
          break
        }
        case TypeCopyFileFormatOptions.MONTH: {
          condLog(`Add month to path format`, funcName, fileName, area)
          const monthNum: number = fileStats.birthtime.getMonth() + 1
          const monthName: string = fileStats.birthtime.toLocaleString('default', { month: 'long' })
          const monthPath: string = `${monthNum}-${monthName}`
          // Add 1 to month as it counts from 0
          formatPath = formatPath.concat(path.sep, `${monthPath}`)
          break
        }
        case TypeCopyFileFormatOptions.DAY: {
          condLog(`Add day to path format`, funcName, fileName, area)
          formatPath = formatPath.concat(path.sep, `${fileStats.birthtime.getDate()}`)
          break
        }
        case TypeCopyFileFormatOptions.VOLUME_NAME: {
          condLog(`Add volumeName to path format`, funcName, fileName, area)
          const volumeName: string = DriveInfo.getVolNameFromPath(pathUnderOrigin)
          formatPath = formatPath.concat(path.sep, `${volumeName}`)
          break
        }
        case TypeCopyFileFormatOptions.FILE_FORMAT: {
          condLog(`Add fileFormat to path format`, funcName, fileName, area)
          let extensionName = path.extname(pathUnderOrigin)
          if (extensionName === '') {
            condLog(`No file type`, funcName, fileName, area)
            extensionName = 'No-File-Type'
          }
          formatPath = formatPath.concat(path.sep, `${extensionName}`)
          break
        }
        case TypeCopyFileFormatOptions.CUSTOM: {
          condLog(`Add custom to path format`, funcName, fileName, area)
          formatPath = formatPath.concat(path.sep, this.customName)
          break
        }
        default: {
          errorLog(`Unknown item in CopyFile format options array`, funcName, fileName, area)
        }
      }
    }

    exitLog(funcName, fileName, area)
    return formatPath
  }
}
