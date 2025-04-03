import { DriveInfo } from '@shared/drives/driveInfo'
import { pathExists } from '@shared/storage/storeData'
import path from 'path'
import * as fs from 'fs'
import { TypeCopyFileOptions } from './typeCopyFileOptions'
import { RuleFullPath } from './ruleFullPath'
import { matchStringAgainstStringArray } from '@shared/utils/string'

const fileName: string = 'rulePath.ts'
const area: string = 'rules'

export class RulePath {
  /*
  Volume / Drive Name
  - Only needed on windows
  - e.g. 'Windows', 'Untitled' etc..
  */
  private volumeName: string
  /*
  Path from volume root - for performaing rule actions
  */
  private volumeRootPath: string
  /*
  Full Path to rule directory based on current mount locations
  - undefined if the full path doesnt currently exist (e.g. drive nto connected)
  - Array as multiple drives can have the same VolumeName, therefore we get a fullPath for each drive with volumeName.
  - When defined, tested to see if the path exists
  */
  private fullPathList: RuleFullPath[]
  /*

  */
  private countFullPathExists: number

  private filesToInclude: string[]
  private filesToExclude: string[]
  private dirsToInclude: string[]
  private dirsToExclude: string[]

  /* --- Functions --- */

  constructor(
    volumeName: string,
    volumeRootPath: string,
    filesToInclude: string[] = [],
    filesToExclude: string[] = [],
    dirsToInclude: string[] = [],
    dirsToExclude: string[] = []
  ) {
    const funcName: string = 'rulePath Constructor'
    entryLog(funcName, fileName, area)

    this.volumeName = volumeName
    this.volumeRootPath = volumeRootPath
    // Add the fullPath
    this.countFullPathExists = 0
    this.fullPathList = []
    this.updateFullPathList()
    this.filesToInclude = filesToInclude
    this.filesToExclude = filesToExclude
    this.dirsToInclude = dirsToInclude
    this.dirsToExclude = dirsToExclude

    exitLog(funcName, fileName, area)
    return
  }

  getVolumeName(): string {
    const funcName: string = 'getVolumeName'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.volumeName
  }

  getVolumeRootPath(): string {
    const funcName: string = 'getVolumeRootPath'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.volumeRootPath
  }

  getFullPathList(): RuleFullPath[] {
    const funcName: string = 'getFullPathList'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.fullPathList
  }

  getFilesToInclude(): string[] {
    const funcName: string = 'getDilesToInclude'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.filesToInclude
  }
  getFilesToExclude(): string[] {
    const funcName: string = 'getFilesToExclude'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.filesToExclude
  }

  getDirsToInclude(): string[] {
    const funcName: string = 'getDirsToInclude'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.dirsToInclude
  }

  getDirsToExclude(): string[] {
    const funcName: string = 'getDirsToExclude'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.dirsToExclude
  }

  /*
  Updates fullPath for the rulePath array.
  - This is has interestingness with:
    - Amount of drives with the same volume name
    - Whether the fullPath actually exists - Cant copy from non-existent path
  */
  updateFullPathList(): void {
    const funcName: string = 'updateFullPathList'
    entryLog(funcName, fileName, area)

    this.fullPathList = []
    this.countFullPathExists = 0
    // Loop through all current connected volumes to see if theres a matching volume name
    // - If so a full path to the list and find out if the path exists
    const currentDriveInfoList: DriveInfo[] | undefined = currentDriveInfo
    if (currentDriveInfoList) {
      condLog(`Go through every drive`, funcName, fileName, area)
      for (const driveInfo of currentDriveInfoList) {
        condLog(`Test if drive volume name matches rulePath volume name`, funcName, fileName, area)
        if (driveInfo.volumeName == this.volumeName) {
          condLog(`Matching volumeName found - Fill fullPath`, funcName, fileName, area)
          const newPath: string = driveInfo.mount.concat(this.volumeRootPath)
          const newPathExists: boolean = pathExists(newPath)
          const newRuleFullPath: RuleFullPath = new RuleFullPath(newPath, newPathExists)
          this.fullPathList.push(newRuleFullPath)
          // Fill bool to note there is atleast one fullPath which exists
          if (newPathExists) {
            condLog(`Path exists under volume`, funcName, fileName, area)
            this.countFullPathExists += 1
          }
        }
      }
    }

    exitLog(funcName, fileName, area)
    return
  }

  getCountFullPathExists(): number {
    const funcName: string = 'getCountFullPathExists'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.countFullPathExists
  }

  shouldFileBeIncluded(pathToFile: string) {
    const funcName: string = 'fileShouldBeIncluded'
    entryLog(funcName, fileName, area)

    let shouldIncludeFile: boolean = true
    const nameOfFile: string = path.basename(pathToFile)
    infoLog(`Should include file? ${pathToFile}`, funcName, fileName, area)

    const includeArray: string[] = this.filesToInclude
    if (includeArray.length > 0) {
      condLog(`Check ${nameOfFile} against include array`, funcName, fileName, area)
      shouldIncludeFile = matchStringAgainstStringArray(nameOfFile, includeArray)
    }

    const excludeArray: string[] = this.filesToExclude
    if (excludeArray.length > 0 && shouldIncludeFile) {
      condLog(`Check ${nameOfFile} against exclude array`, funcName, fileName, area)
      shouldIncludeFile = !matchStringAgainstStringArray(nameOfFile, excludeArray)
    }

    exitLog(funcName, fileName, area)
    return shouldIncludeFile
  }

  shouldDirBeIncluded(pathToDir: string) {
    const funcName: string = 'dirShouldBeIncluded'
    entryLog(funcName, fileName, area)

    let shouldIncludeDir: boolean = true
    const nameOfDir: string = path.basename(pathToDir)
    infoLog(`Should include dir? ${pathToDir}`, funcName, fileName, area)

    const includeArray: string[] = this.dirsToInclude
    if (includeArray.length > 0) {
      condLog(`Check ${nameOfDir} against include array`, funcName, fileName, area)
      shouldIncludeDir = matchStringAgainstStringArray(nameOfDir, includeArray)
    }

    const excludeArray: string[] = this.dirsToExclude
    if (excludeArray.length > 0 && shouldIncludeDir) {
      condLog(`Check ${nameOfDir} against exclude array`, funcName, fileName, area)
      shouldIncludeDir = !matchStringAgainstStringArray(nameOfDir, excludeArray)
    }

    exitLog(funcName, fileName, area)
    return shouldIncludeDir
  }

  static async convertPathWithFormat(
    pathUnderOrigin: string,
    targetRulePath: string,
    copyFileOptions: TypeCopyFileOptions
  ): Promise<string> {
    const funcName: string = 'convertPathWithFormat'
    entryLog(funcName, fileName, area)

    let pathUnderTarget: string | undefined = undefined
    // Generate format path
    const fileStats = await fs.promises.stat(pathUnderOrigin)
    const formatPath: string = copyFileOptions.generateFormatPath(fileStats, pathUnderOrigin)
    infoLog(`Using formatPath: ${formatPath}`, funcName, fileName, area)
    // Fill in the path
    pathUnderTarget = targetRulePath + formatPath + path.sep + path.basename(pathUnderOrigin)

    exitLog(funcName, fileName, area)
    return pathUnderTarget
  }
}
