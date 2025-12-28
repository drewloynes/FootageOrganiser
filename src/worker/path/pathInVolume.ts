import { pathExists } from '@shared-node/utils/filePaths'
import { cloneStringArray, matchStringAgainstStringArray } from '@shared-node/utils/string'
import path from 'path'
import { FullPath } from './fullPath'

const fileName = 'pathInVolume.ts'
const area = 'path'

// Identifying what the path in volume is for.
// - ORGIN is an origin path - stored under rule.origin
// - TARGET is a target path - stored under rule.target
// - OTHER_PATHS is an other path used by copy file rules - stored inside rule.copyFileOptions.otherPaths
export enum PATH_IN_VOLUME_TYPE {
  ORIGIN = 'origin',
  TARGET = 'target',
  OTHER_PATHS = 'other-paths'
}

export class PathInVolume {
  // Volume / Drive Name
  // - e.g. 'Windows', 'Untitled' etc..
  #volumeName: string
  // Path from volume root
  #pathFromVolumeRoot: string

  // Path in volume type (What the path is used for)
  #type: PATH_IN_VOLUME_TYPE

  // Array of strings to filter files to include
  #filesToInclude: string[]
  // Array of strings to filter files to exclude
  #filesToExclude: string[]
  // Array of strings to filter directories to include
  #dirsToInclude: string[]
  // Array of strings to filter directories to exclude
  #dirsToExclude: string[]

  // Array of all the full paths to the specificed directory based on current mount locations
  // - Array as multiple drives can have the same VolumeName, therefore we get a fullPath for each drive with volumeName.
  // - Array if empty when the path doesn't currently exist
  #fullPathList: FullPath[] = []
  #countExistingFullPaths = 0

  constructor(
    volumeName: string,
    pathFromVolumeRoot: string,
    type: PATH_IN_VOLUME_TYPE,
    filesToInclude: string[] = [],
    filesToExclude: string[] = [],
    dirsToInclude: string[] = [],
    dirsToExclude: string[] = []
  ) {
    const funcName = 'PathInVolume Constructor'
    entryLog(funcName, fileName, area)

    this.#volumeName = volumeName
    this.#pathFromVolumeRoot = pathFromVolumeRoot
    this.#type = type
    this.#filesToInclude = filesToInclude.filter((matchString) => matchString !== '')
    this.#filesToExclude = filesToExclude.filter((matchString) => matchString !== '')
    this.#dirsToInclude = dirsToInclude.filter((matchString) => matchString !== '')
    this.#dirsToExclude = dirsToExclude.filter((matchString) => matchString !== '')

    // Find and add all full paths
    // - A full path can be worked out if the drive is attached, but that path may not exist.
    this.updateFullPathList()

    exitLog(funcName, fileName, area)
    return
  }

  get volumeName(): string {
    return this.#volumeName
  }

  get pathFromVolumeRoot(): string {
    return this.#pathFromVolumeRoot
  }

  get type(): PATH_IN_VOLUME_TYPE {
    return this.#type
  }

  get filesToInclude(): string[] {
    return this.#filesToInclude
  }

  get filesToExclude(): string[] {
    return this.#filesToExclude
  }

  get dirsToInclude(): string[] {
    return this.#dirsToInclude
  }

  get dirsToExclude(): string[] {
    return this.#dirsToExclude
  }

  get fullPathList(): FullPath[] {
    return this.#fullPathList
  }

  get countExistingFullPaths(): number {
    return this.#countExistingFullPaths
  }

  clone(): PathInVolume {
    const funcName = 'clone'
    entryLog(funcName, fileName, area)

    const clonedFilesToInclude = cloneStringArray(this.#filesToInclude)
    const clonedFilesToExclude = cloneStringArray(this.#filesToExclude)
    const clonedDirsToInclude = cloneStringArray(this.#dirsToInclude)
    const clonedDirsToExclude = cloneStringArray(this.#dirsToExclude)

    const clonedPathInVolume: PathInVolume = new PathInVolume(
      this.volumeName,
      this.pathFromVolumeRoot,
      this.type,
      clonedFilesToInclude,
      clonedFilesToExclude,
      clonedDirsToInclude,
      clonedDirsToExclude
    )

    clonedPathInVolume.#countExistingFullPaths = this.countExistingFullPaths
    for (const fullPath of this.fullPathList) {
      condLog('For fullPath in fullPathList', funcName, fileName, area)
      clonedPathInVolume.fullPathList.push(fullPath.clone())
    }

    exitLog(funcName, fileName, area)
    return clonedPathInVolume
  }

  updateFullPathList(): void {
    const funcName = 'updateFullPathList'
    entryLog(funcName, fileName, area)

    this.#fullPathList = []
    this.#countExistingFullPaths = 0

    if (!glob.workerGlobals.currentDriveInfo) {
      condExitLog(`CurrentDriveInfo is not defined`, funcName, fileName, area)
      return
    }

    for (const driveInfoItem of glob.workerGlobals.currentDriveInfo) {
      condLog(`For drive with volume name: ${driveInfoItem.volumeName}`, funcName, fileName, area)

      if (driveInfoItem.volumeName !== this.volumeName) {
        condLog(`Volume name does not match`, funcName, fileName, area)
        continue
      }

      // Work out the full path - See if that path actually exists
      const newPath: string = driveInfoItem.mount.concat(this.pathFromVolumeRoot)
      const newPathExists: boolean = pathExists(newPath)
      const newFullPath: FullPath = new FullPath(newPath, newPathExists)
      this.fullPathList.push(newFullPath)

      // Increment number of existing full paths
      if (newPathExists) {
        condLog(`Path exists`, funcName, fileName, area)
        this.#countExistingFullPaths += 1
      }
    }

    exitLog(funcName, fileName, area)
    return
  }

  includeFile(pathToFile: string): boolean {
    const funcName = 'includeFile'
    entryLog(funcName, fileName, area)

    const nameOfFile: string = path.basename(pathToFile)

    if (
      this.#filesToInclude.length > 0 &&
      matchStringAgainstStringArray(nameOfFile, this.#filesToInclude)
    ) {
      condExitLog(`Include file ${nameOfFile}`, funcName, fileName, area)
      return true
    }

    if (
      this.#filesToExclude.length > 0 &&
      matchStringAgainstStringArray(nameOfFile, this.#filesToExclude)
    ) {
      condExitLog(`Exclude file ${nameOfFile}`, funcName, fileName, area)
      return false
    }

    exitLog(funcName, fileName, area)
    return true
  }

  includeDir(pathToDir: string): boolean {
    const funcName = 'includeDir'
    entryLog(funcName, fileName, area)

    const nameOfDir: string = path.basename(pathToDir)

    if (
      this.#dirsToInclude.length > 0 &&
      matchStringAgainstStringArray(nameOfDir, this.#dirsToInclude)
    ) {
      condExitLog(`Include dir ${nameOfDir}`, funcName, fileName, area)
      return true
    }

    if (
      this.#dirsToExclude.length > 0 &&
      matchStringAgainstStringArray(nameOfDir, this.#dirsToExclude)
    ) {
      condExitLog(`Exclude dir ${nameOfDir}`, funcName, fileName, area)
      return false
    }

    exitLog(funcName, fileName, area)
    return true
  }
}
