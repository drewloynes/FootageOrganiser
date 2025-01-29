import { RulePath } from '@shared/rules/rulePath'
import { pathExists } from '@shared/storage/storeData'
import * as fs from 'fs'
import * as path from 'path'
import { TypeCopyFileOptions } from './typeCopyFileOptions'
import { TypeMirrorOptions } from './typeMirrorOptions'
import { RuleCopyOptions } from './ruleCopyOptions'
import { matchStringAgainstStringArray } from '@shared/utils/string'
import { plainToInstance } from 'class-transformer'
import { CheckSumType, generateCheckSum } from '@shared/utils/checkSum'
import { RuleFullPath } from './ruleFullPath'

const fileName = 'rule.ts'
const area = 'rules'

export enum RuleType {
  COPYFILE = 'copy-files',
  MIRROR = 'mirror'
}

export enum ActionableReason {
  NOPROBLEM = 'no-problem',
  ZERO_EXISTING_TO_PATHS = 'zero-existing-to-paths',
  ZERO_EXISTING_FROM_PATHS = 'zero-existing-from-paths',
  MIRROR_MULTIPLE_FROM_PATHS = 'mirror-multiple-from-paths'
}

export enum CopOrDel {
  COPY = 'copy',
  DELETE_MIRROR = 'delete-mirror',
  DELETE_EXTRA = 'delete-extra'
}

interface CopyPaths {
  from: string
  to: string
}

export class Rule {
  private name: string

  private type: RuleType

  private typeOptions: TypeCopyFileOptions | TypeMirrorOptions
  private copyOptions: RuleCopyOptions
  //
  private from: RulePath
  private to: RulePath
  // Is the rule currently actionable?
  // (E.G. do full paths exists, is a mirror trying to mirror from multiple paths)
  private isActionable: boolean
  // Describes problem if isActionable is false
  private isActionableReason: ActionableReason
  // There is work to do which we can currently action on
  private pendingActions: boolean

  private copyingComplete: boolean
  //
  private dirMakeActionQueue: string[]
  private dirDeleteActionQueue: string[]
  //
  private fileCopyActionQueue: CopyPaths[]
  private fileDeleteActionQueue: string[]

  /* --- Constructor & Getters / Setters --- */

  constructor(
    ruleName: string,
    type: RuleType,
    typeOptions: TypeCopyFileOptions | TypeMirrorOptions,
    copyOptions: RuleCopyOptions,
    fromRulePath: RulePath,
    toRulePath: RulePath
  ) {
    const funcName = 'Rule Constructor'
    entryLog(funcName, fileName, area)

    this.name = ruleName
    this.type = type
    this.typeOptions = typeOptions
    this.copyOptions = copyOptions
    this.isActionable = false
    this.isActionableReason = ActionableReason.NOPROBLEM
    this.pendingActions = false
    this.copyingComplete = false
    this.from = fromRulePath
    this.to = toRulePath
    this.dirMakeActionQueue = []
    this.dirDeleteActionQueue = []
    this.fileCopyActionQueue = []
    this.fileDeleteActionQueue = []

    exitLog(funcName, fileName, area)
    return
  }

  getName(): string {
    const funcName = 'getName'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.name
  }

  getType(): RuleType {
    const funcName = 'getType'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.type
  }

  getTypeOptions(): TypeCopyFileOptions | TypeMirrorOptions {
    const funcName = 'getTypeOptions'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.typeOptions
  }

  getCopyOptions(): RuleCopyOptions {
    const funcName = 'getCopyOptions'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.copyOptions
  }

  getFrom(): RulePath {
    const funcName = 'getFrom'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.from
  }

  getTo(): RulePath {
    const funcName = 'getTo'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.to
  }

  /* --- Functions --- */

  /* Calculate actionable work by filling in actionQueues and seeing if there is any actions to do */
  async checkPendingActions(recalculate = true): Promise<boolean> {
    const funcName = 'checkPendingActions'
    entryLog(funcName, fileName, area)

    if (recalculate) {
      condLog(`Recalculate the actions`, funcName, fileName, area)
      // Check if the rule is ready to perform actions
      if (!this.checkActionability()) {
        condLog(`Rule '${this.name}' has missing path when reuqired`, funcName, fileName, area)
      } else {
        condLog(`Fill action queues for rule '${this.name}'`, funcName, fileName, area)
        await this.fillActionQueues()
      }
    }
    // Check if any of the queues have work to do
    if (
      this.dirMakeActionQueue.length > 0 ||
      this.dirDeleteActionQueue.length > 0 ||
      this.fileCopyActionQueue.length > 0 ||
      this.fileDeleteActionQueue.length > 0
    ) {
      condLog(`There is work in actionQueue`, funcName, fileName, area)
      this.pendingActions = true
    } else {
      condLog(`Nothing to do in actionQueue`, funcName, fileName, area)
      this.pendingActions = false
    }

    exitLog(funcName, fileName, area)
    return this.pendingActions
  }

  //
  private checkActionability(): boolean {
    const funcName = 'checkActionability'
    entryLog(funcName, fileName, area)

    // Init actionability
    this.isActionable = true
    this.isActionableReason = ActionableReason.NOPROBLEM
    // Update the full path for to and from before checks
    this.from.updateFullPathList()
    this.to.updateFullPathList()
    if (this.from.getCountFullPathExists() < 1) {
      condLog(`No from full paths exist`, funcName, fileName, area)
      this.isActionable = false
      this.isActionableReason = ActionableReason.ZERO_EXISTING_TO_PATHS
    } else if (this.to.getCountFullPathExists() < 1) {
      condLog(`No to full paths exist`, funcName, fileName, area)
      this.isActionable = false
      this.isActionableReason = ActionableReason.ZERO_EXISTING_FROM_PATHS
    } else if (this.from.getCountFullPathExists() > 1 && this.type === RuleType.MIRROR) {
      condLog(`Too many from paths for mirror rule`, funcName, fileName, area)
      // Mirror rules can only work if they mirror from 1 and only 1 path
      this.isActionable = false
      this.isActionableReason = ActionableReason.MIRROR_MULTIPLE_FROM_PATHS
    }

    exitLog(funcName, fileName, area)
    return this.isActionable
  }

  /* Recurse through each directory, checking for actions to do for each file or directory */
  private async fillActionQueues(): Promise<void> {
    const funcName = 'fillActionQueue'
    entryLog(funcName, fileName, area)

    this.copyingComplete = true
    this.fileCopyActionQueue = []
    this.dirMakeActionQueue = []
    this.fileDeleteActionQueue = []
    this.dirDeleteActionQueue = []
    // For each rule path which exists, rescure through all directories and add actions
    for (const fromFullPath of this.from.getFullPathList()) {
      condLog(`Test if path ${fromFullPath.getPath()} exists`, funcName, fileName, area)
      if (fromFullPath.getExists()) {
        condLog(`Recurse and add actions for copying from path`, funcName, fileName, area)
        await this.recurseAddAction(fromFullPath.getPath(), this.from)
      }
    }
    // If we are mirroring we want to delete any files and dirs under 'to' which isn't under 'from'
    if (this.type === RuleType.MIRROR) {
      condLog(`MIRROR type, go through all to paths`, funcName, fileName, area)
      const mirrorTypeOptions: TypeMirrorOptions = plainToInstance(
        TypeMirrorOptions,
        this.typeOptions
      )
      if (mirrorTypeOptions.getDeleteExtrasInTo()) {
        condLog(`Delete extras in to: True`, funcName, fileName, area)
        for (const toFullPath of this.from.getFullPathList()) {
          condLog(`Recsurse and add actions for deleteing in to path`, funcName, fileName, area)
          await this.recurseAddAction(
            toFullPath.getPath(),
            this.from,
            toFullPath.getPath(),
            CopOrDel.DELETE_MIRROR
          )
        }
      }
    }
    // If we doing copy files, we may want to delete extra files / paths - add them to deletion lists
    if (this.type === RuleType.COPYFILE) {
      condLog(`Rule type: COPY FILE`, funcName, fileName, area)
      const copyFileTypeOptions: TypeCopyFileOptions = plainToInstance(
        TypeCopyFileOptions,
        this.typeOptions
      )
      if (copyFileTypeOptions.getDeleteExtra() && this.copyingComplete) {
        condLog(`Delete extra: TRUE`, funcName, fileName, area)
        for (const extraDeletePath of copyFileTypeOptions.getExtraDeletePaths()) {
          condLog(`Try delete files under path}`, funcName, fileName, area)
          for (const extraDeleteFullPath of extraDeletePath.getFullPathList()) {
            condLog(`Try delete files under path}`, funcName, fileName, area)
            await this.recurseAddAction(
              extraDeleteFullPath.getPath(),
              extraDeletePath,
              extraDeleteFullPath.getPath(),
              CopOrDel.DELETE_EXTRA
            )
          }
        }
      }
    }

    exitLog(funcName, fileName, area)
    return
  }

  private async recurseAddAction(
    originalPath: string,
    originalRulePath: RulePath,
    currentPath: string = originalPath,
    copyOrDelete: CopOrDel = CopOrDel.COPY
  ): Promise<void> {
    const funcName = 'recurseAndAction'
    entryLog(funcName, fileName, area)

    const entries: fs.Dirent[] = await fs.promises.readdir(currentPath, { withFileTypes: true })
    for (const entry of entries) {
      condLog(`Investigate new item in directory`, funcName, fileName, area)
      const currentFullPath = path.join(currentPath, entry.name)
      if (entry.isDirectory()) {
        condLog(`Item is directory`, funcName, fileName, area)
        if (copyOrDelete === CopOrDel.COPY) {
          condLog(`Add to copy action queue`, funcName, fileName, area)
          this.addDirToMakeActionQueue(currentFullPath, originalPath)
        } else if (copyOrDelete === CopOrDel.DELETE_MIRROR) {
          condLog(`Add to delete queue under to`, funcName, fileName, area)
          this.addDirToDeleteActionQueue(currentFullPath, originalPath)
        } else if (copyOrDelete === CopOrDel.DELETE_EXTRA) {
          condLog(`Add to delete queue under from`, funcName, fileName, area)
          this.addDirToDeleteActionQueueExtra(currentFullPath, originalRulePath)
        }
        if (
          (this.dirShouldBeCopied(currentFullPath) && copyOrDelete === CopOrDel.COPY) ||
          copyOrDelete === CopOrDel.DELETE_EXTRA ||
          copyOrDelete === CopOrDel.DELETE_MIRROR
        ) {
          condLog(`Directory should be copied - enter`, funcName, fileName, area)
          await this.recurseAddAction(originalPath, originalRulePath, currentFullPath, copyOrDelete) // Recurse into subdirectory
        }
      } else if (entry.isFile()) {
        condLog(`Item is file`, funcName, fileName, area)
        if (this.shouldSkipFile(currentFullPath)) {
          condLog(`Skip file`, funcName, fileName, area)
          continue
        }
        if (copyOrDelete === CopOrDel.COPY) {
          condLog(`Add to copy action queue`, funcName, fileName, area)
          await this.addFileToCopyActionQueue(currentFullPath, originalPath)
        } else if (copyOrDelete === CopOrDel.DELETE_MIRROR) {
          condLog(`Add to delete queue under to`, funcName, fileName, area)
          this.addFileToDeleteActionQueue(currentFullPath, originalPath)
        } else if (copyOrDelete === CopOrDel.DELETE_EXTRA) {
          condLog(`Add to delete queue under from`, funcName, fileName, area)
          this.addFileToDeleteActionQueueExtra(currentFullPath, originalRulePath)
        }
      } else {
        condLog(`Item is not a file or directory`, funcName, fileName, area)
      }
    }

    exitLog(funcName, fileName, area)
    return
  }

  private shouldSkipFile(pathToFile: string): boolean {
    const funcName: string = 'shouldSkipFile'
    entryLog(funcName, fileName, area)

    let skip: boolean = false
    const nameOfFile: string = path.basename(pathToFile)
    if (nameOfFile === 'desktop.ini' && process.platform === 'win32') {
      condLog(`Skip desktop.ini files on windows`, funcName, fileName, area)
      skip = true
    }

    exitLog(funcName, fileName, area)
    return skip
  }

  private addDirToMakeActionQueue(fromDirPath: string, fromFullPath: string): void {
    const funcName: string = 'addDirToMakeActionQueue'
    entryLog(funcName, fileName, area)

    if (this.type === RuleType.MIRROR) {
      condLog(`Add to dirActionQueue based on rule's type`, funcName, fileName, area)
      if (this.dirShouldBeCopied(fromDirPath)) {
        // Add an action for each existing to full path
        for (const toFullPath of this.to.getFullPathList()) {
          condLog(`Create new toDirPath from new toFullPath`, funcName, fileName, area)
          const toDirPath: string = toFullPath.getPath() + fromDirPath.slice(fromFullPath.length)
          if (!pathExists(toDirPath)) {
            condLog(`Dir doesnt exist - Add directory to actionsQueue`, funcName, fileName, area)
            this.dirMakeActionQueue.push(toDirPath)
          }
        }
      }
    } else {
      condLog(`Dont add to dirActionQueue based on rule's type`, funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return
  }

  private async addFileToCopyActionQueue(
    fromFilePath: string,
    fromFullPath: string
  ): Promise<void> {
    const funcName = 'addFileToCopyActionQueue'
    entryLog(funcName, fileName, area)

    if (this.fileShouldBeCopied(fromFilePath)) {
      condLog(`File should be copied`, funcName, fileName, area)

      // Add an action for each existing to full path
      for (const toFullPath of this.to.getFullPathList()) {
        const toFilePath: string = await this.getCopyToPath(
          fromFilePath,
          fromFullPath,
          toFullPath.getPath()
        )
        if (!pathExists(toFilePath)) {
          condLog(`File does not exist - add to action queue`, funcName, fileName, area)
          this.fileCopyActionQueue.push({ from: fromFilePath, to: toFilePath })
          // Outstanding copying left to do
          this.copyingComplete = false
        } else {
          condLog(`File already exists`, funcName, fileName, area)
          if (await this.shouldFileBeDeleted(fromFilePath, toFilePath)) {
            condLog(`File should be deleted`, funcName, fileName, area)
            this.fileDeleteActionQueue.push(fromFilePath)
          }
        }
      }
    } else {
      condLog(`File shouldn't be coped`, funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return
  }

  private async shouldFileBeDeleted(fromFilePath: string, toFilePath: string): Promise<boolean> {
    const funcName: string = 'shouldFileBeDeleted'
    entryLog(funcName, fileName, area)

    let deleteFile: boolean = false
    if (this.getAutoCleanFromPath()) {
      condLog(`Auto clean from path: TRUE`, funcName, fileName, area)
      // If checkSums both match then delete, otherwise log warning
      const fromCheckSum: string = await generateCheckSum(fromFilePath, CheckSumType.CRC)
      const toCheckSum: string = await generateCheckSum(toFilePath, CheckSumType.CRC)
      if (fromCheckSum === toCheckSum) {
        condLog(`To and From checksums match for file`, funcName, fileName, area)
        deleteFile = true
      } else {
        warnLog(
          `To and From checksums do not match for: ${fromFilePath} and ${toFilePath}`,
          funcName,
          fileName,
          area
        )
        // Copying not complete because the copied file doest match
        this.copyingComplete = false
      }
    }

    exitLog(funcName, fileName, area)
    return deleteFile
  }

  private getAutoCleanFromPath() {
    const funcName: string = 'getAutoCleanFromPath'
    entryLog(funcName, fileName, area)

    let autoCleanFromPath: boolean = false
    if (this.type == RuleType.COPYFILE) {
      condLog(`Rule type: COPY FILE`, funcName, fileName, area)
      const copyFileTypeOptions: TypeCopyFileOptions = plainToInstance(
        TypeCopyFileOptions,
        this.typeOptions
      )
      if (copyFileTypeOptions.getAutoCleanFromPath()) {
        infoLog(`Auto Clean From Path is : True`, funcName, fileName, area)
        autoCleanFromPath = true
      }
    }

    exitLog(funcName, fileName, area)
    return autoCleanFromPath
  }

  /*
  Work out if its a file whicch should be copied
  - This is currently just checking if it matches include and doesnt match exclude lists.
  */
  private fileShouldBeCopied(Path: string): boolean {
    const funcName: string = 'fileShouldBeCopied'
    entryLog(funcName, fileName, area)

    let shouldCopyFile: boolean = true
    infoLog(`Should Copy? From path: ${Path}`, funcName, fileName, area)
    // Extract the file name from the path
    const nameOfFile: string = path.basename(Path)
    // Find if filename matches include array
    const includeArray: string[] = this.copyOptions.getCopyInclude()
    let includeMatch: boolean = true
    if (includeArray.length > 0) {
      condLog(`Check ${nameOfFile} against include array`, funcName, fileName, area)
      includeMatch = matchStringAgainstStringArray(nameOfFile, includeArray)
    }
    // Find if filename matches exclude array
    const excludeArray: string[] = this.copyOptions.getCopyExclude()
    let excludeMatch: boolean = false
    if (excludeArray.length > 0) {
      condLog(`Check ${nameOfFile} against exclude array`, funcName, fileName, area)
      excludeMatch = matchStringAgainstStringArray(nameOfFile, excludeArray)
    }
    // Work out if shouldCopyFile
    if (!includeMatch || excludeMatch) {
      condLog(`Should not include file based on include/exclude lists`, funcName, fileName, area)
      shouldCopyFile = false
    }

    exitLog(funcName, fileName, area)
    return shouldCopyFile
  }

  private dirShouldBeCopied(Path: string): boolean {
    const funcName: string = 'dirShouldBeCopied'
    entryLog(funcName, fileName, area)

    let shouldCopyFile: boolean = true
    infoLog(`Should Copy Dir? From path: ${Path}`, funcName, fileName, area)
    // Extract the file name from the path
    const nameOfDir: string = path.basename(Path)
    // Find if filename matches include array
    const includeArray: string[] = this.copyOptions.getDirCopyInclude()
    let includeMatch: boolean = true
    if (includeArray.length > 0) {
      condLog(`Check ${nameOfDir} against include array`, funcName, fileName, area)
      includeMatch = matchStringAgainstStringArray(nameOfDir, includeArray)
    }
    // Find if filename matches exclude array
    const excludeArray: string[] = this.copyOptions.getDirCopyExclude()
    let excludeMatch: boolean = false
    if (excludeArray.length > 0) {
      condLog(`Check ${nameOfDir} against exclude array`, funcName, fileName, area)
      excludeMatch = matchStringAgainstStringArray(nameOfDir, excludeArray)
    }
    // Work out if shouldCopyFile
    if (!includeMatch || excludeMatch) {
      condLog(`Should not include file based on include/exclude lists`, funcName, fileName, area)
      shouldCopyFile = false
    }

    exitLog(funcName, fileName, area)
    return shouldCopyFile
  }

  private async getCopyToPath(
    fromFilePath: string,
    fromFullPath: string,
    toFullPath: string
  ): Promise<string> {
    const funcName: string = 'getCopyToPath'
    entryLog(funcName, fileName, area)

    let copyToPath: string
    switch (this.type) {
      case RuleType.COPYFILE: {
        condLog(`copy-files types`, funcName, fileName, area)
        copyToPath = await RulePath.convertPathWithFormat(
          fromFilePath,
          toFullPath,
          plainToInstance(TypeCopyFileOptions, this.typeOptions)
        )
        break
      }
      case RuleType.MIRROR: {
        condLog(`mirror type`, funcName, fileName, area)
        copyToPath = toFullPath + fromFilePath.slice(fromFullPath.length)
        break
      }
      default: {
        errorLog('Rule type unknown', funcName, fileName, area)
        throw 'Rule should not be of unknown type'
      }
    }

    exitLog(funcName, fileName, area)
    return copyToPath
  }

  // Just for deleting mirror dirs
  private async addDirToDeleteActionQueue(toDirPath: string, toFullPath: string): Promise<void> {
    const funcName = 'addDirToDeleteActionQueue'
    entryLog(funcName, fileName, area)

    // from full path list must contain only 1 item! and it must exist
    const fromFullPathList: RuleFullPath[] = this.to.getFullPathList()
    const fromFullPath: string = fromFullPathList[0].getPath()
    const fromDirPath: string = fromFullPath + toDirPath.slice(toFullPath.length)

    // If path doesnt exist under from path, then set to delete it
    if (this.dirShouldBeDeleted(toDirPath)) {
      // If path doesnt exist under from path, then set to delete it
      if (!pathExists(fromDirPath)) {
        condLog(
          `Dir doesnt exist under from - Add dir to delete actionsQueue`,
          funcName,
          fileName,
          area
        )
        this.dirDeleteActionQueue.push(fromDirPath)
      }
    }

    exitLog(funcName, fileName, area)
    return
  }

  private async addFileToDeleteActionQueue(toFilePath: string, toFullPath: string): Promise<void> {
    const funcName = 'addFileToDeleteActionQueue'
    entryLog(funcName, fileName, area)

    // from full path list must contain only 1 item! and it must exist
    const fromFullPathList: RuleFullPath[] = this.to.getFullPathList()
    const fromFullPath: string = fromFullPathList[0].getPath()
    const fromFilePath: string = fromFullPath + toFilePath.slice(toFullPath.length)

    // If path doesnt exist under from path, then set to delete it
    if (this.fileShouldBeDeleted(toFilePath)) {
      condLog(`File should be deleted`, funcName, fileName, area)
      if (!pathExists(fromFilePath)) {
        condLog(
          `File doesnt exist under from - Add dir to delete actionsQueue`,
          funcName,
          fileName,
          area
        )
        this.fileDeleteActionQueue.push(fromFilePath)
      }
    }

    exitLog(funcName, fileName, area)
    return
  }

  private fileShouldBeDeleted(Path: string): boolean {
    const funcName: string = 'fileShouldBeDeleted'
    entryLog(funcName, fileName, area)

    let shouldDeleteFile: boolean = true
    infoLog(`Should Delete? TO path: ${Path}`, funcName, fileName, area)
    // Must be mirror
    const mirrorTypeOptions: TypeMirrorOptions = plainToInstance(
      TypeMirrorOptions,
      this.typeOptions
    )
    // Extract the file name from the path
    const nameOfFile: string = path.basename(Path)
    // Find if filename matches include array
    const includeArray: string[] = mirrorTypeOptions.getDeleteInclude()
    let includeMatch: boolean = true
    if (includeArray.length > 0) {
      condLog(`Check ${nameOfFile} against include array`, funcName, fileName, area)
      includeMatch = matchStringAgainstStringArray(nameOfFile, includeArray)
    }
    // Find if filename matches exclude array
    const excludeArray: string[] = mirrorTypeOptions.getDeleteExclude()
    let excludeMatch: boolean = false
    if (excludeArray.length > 0) {
      condLog(`Check ${nameOfFile} against exclude array`, funcName, fileName, area)
      excludeMatch = matchStringAgainstStringArray(nameOfFile, excludeArray)
    }
    // Work out if shouldCopyFile
    if (!includeMatch || excludeMatch) {
      condLog(`Should not include file based on include/exclude lists`, funcName, fileName, area)
      shouldDeleteFile = false
    }

    exitLog(funcName, fileName, area)
    return shouldDeleteFile
  }

  private dirShouldBeDeleted(Path: string): boolean {
    const funcName: string = 'dirShouldBeDeleted'
    entryLog(funcName, fileName, area)

    let shouldDeleteDir: boolean = true
    infoLog(`Should Delete? TO path: ${Path}`, funcName, fileName, area)
    // Must be mirror
    const mirrorTypeOptions: TypeMirrorOptions = plainToInstance(
      TypeMirrorOptions,
      this.typeOptions
    )
    // Extract the file name from the path
    const nameOfFile: string = path.basename(Path)
    // Find if filename matches include array
    const includeArray: string[] = mirrorTypeOptions.getDirDeleteInclude()
    let includeMatch: boolean = true
    if (includeArray.length > 0) {
      condLog(`Check ${nameOfFile} against include array`, funcName, fileName, area)
      includeMatch = matchStringAgainstStringArray(nameOfFile, includeArray)
    }
    // Find if filename matches exclude array
    const excludeArray: string[] = mirrorTypeOptions.getDirDeleteExclude()
    let excludeMatch: boolean = false
    if (excludeArray.length > 0) {
      condLog(`Check ${nameOfFile} against exclude array`, funcName, fileName, area)
      excludeMatch = matchStringAgainstStringArray(nameOfFile, excludeArray)
    }
    // Work out if shouldCopyFile
    if (!includeMatch || excludeMatch) {
      condLog(`Should not include file based on include/exclude lists`, funcName, fileName, area)
      shouldDeleteDir = false
    }

    exitLog(funcName, fileName, area)
    return shouldDeleteDir
  }

  // Just for deleting copy-file extra dirs
  private async addDirToDeleteActionQueueExtra(path: string, rulePath: RulePath): Promise<void> {
    const funcName = 'addDirToDeleteActionQueueExtra'
    entryLog(funcName, fileName, area)

    // If path doesnt exist under from path, then set to delete it
    if (this.dirShouldBeDeletedExtra(path, rulePath)) {
      condLog(`Add dir to delete actionsQueue`, funcName, fileName, area)
      this.dirDeleteActionQueue.push(path)
    }

    exitLog(funcName, fileName, area)
    return
  }

  private dirShouldBeDeletedExtra(Path: string, rulePath: RulePath): boolean {
    const funcName: string = 'dirShouldBeDeletedExtra'
    entryLog(funcName, fileName, area)

    let shouldDeleteDir: boolean = true
    infoLog(`Should Delete? TO path: ${Path}`, funcName, fileName, area)
    // Extract the file name from the path
    const nameOfFile: string = path.basename(Path)
    // Find if filename matches include array
    const includeArray: string[] = rulePath.getDirsToInclude()
    let includeMatch: boolean = true
    if (includeArray.length > 0) {
      condLog(`Check ${nameOfFile} against include array`, funcName, fileName, area)
      includeMatch = matchStringAgainstStringArray(nameOfFile, includeArray)
    }
    // Find if filename matches exclude array
    const excludeArray: string[] = rulePath.getDirsToExclude()
    let excludeMatch: boolean = false
    if (excludeArray.length > 0) {
      condLog(`Check ${nameOfFile} against exclude array`, funcName, fileName, area)
      excludeMatch = matchStringAgainstStringArray(nameOfFile, excludeArray)
    }
    // Work out if shouldCopyFile
    if (!includeMatch || excludeMatch) {
      condLog(`Should not include dir based on include/exclude lists`, funcName, fileName, area)
      shouldDeleteDir = false
    }

    exitLog(funcName, fileName, area)
    return shouldDeleteDir
  }

  // Just for deleting copy-file extra files
  private async addFileToDeleteActionQueueExtra(path: string, rulePath: RulePath): Promise<void> {
    const funcName = 'addFileToDeleteActionQueueExtra'
    entryLog(funcName, fileName, area)

    // If path doesnt exist under from path, then set to delete it
    if (this.fileShouldBeDeletedExtra(path, rulePath)) {
      condLog(`Add file to delete actionsQueue`, funcName, fileName, area)
      this.fileDeleteActionQueue.push(path)
    }

    exitLog(funcName, fileName, area)
    return
  }

  private fileShouldBeDeletedExtra(Path: string, rulePath: RulePath): boolean {
    const funcName: string = 'fileShouldBeDeletedExtra'
    entryLog(funcName, fileName, area)

    let shouldDeleteDir: boolean = true
    infoLog(`Should Delete file? TO path: ${Path}`, funcName, fileName, area)
    // Extract the file name from the path
    const nameOfFile: string = path.basename(Path)
    // Find if filename matches include array
    const includeArray: string[] = rulePath.getFilesToInclude()
    let includeMatch: boolean = true
    if (includeArray.length > 0) {
      condLog(`Check ${nameOfFile} against include array`, funcName, fileName, area)
      includeMatch = matchStringAgainstStringArray(nameOfFile, includeArray)
    }
    // Find if filename matches exclude array
    const excludeArray: string[] = rulePath.getFilesToExclude()
    let excludeMatch: boolean = false
    if (excludeArray.length > 0) {
      condLog(`Check ${nameOfFile} against exclude array`, funcName, fileName, area)
      excludeMatch = matchStringAgainstStringArray(nameOfFile, excludeArray)
    }
    // Work out if shouldCopyFile
    if (!includeMatch || excludeMatch) {
      condLog(`Should not include file based on include/exclude lists`, funcName, fileName, area)
      shouldDeleteDir = false
    }

    exitLog(funcName, fileName, area)
    return shouldDeleteDir
  }

  // loop through mkdirs queue and make all dirs
  mkDirs(): void {
    const funcName: string = 'mkdirs'
    entryLog(funcName, fileName, area)

    for (const dir of this.dirMakeActionQueue) {
      condLog(`Make dir ${dir}`, funcName, fileName, area)
      // try {
      //   fs.mkdirSync(dir, { recursive: true })
      // } catch {
      //   errorLog(`Make dir failed: ${dir}`, funcName, fileName, area)
      // }
    }

    exitLog(funcName, fileName, area)
    return
  }

  // loop through copy file queue and copy files
  copyFiles(): void {
    const funcName: string = 'copyFiles'
    entryLog(funcName, fileName, area)

    // for (const files of this.fileCopyActionQueue) {
    //   condLog(`Copy file from ${files.from} to ${files.to}`, funcName, fileName, area)
    //   try {
    //     fs.mkdirSync(path.dirname(files.to), { recursive: true })
    //     fs.copyFileSync(files.from, files.to, fs.constants.COPYFILE_EXCL)
    //   } catch {
    //     errorLog(`Copy file failed from ${files.from} to ${files.to}`, funcName, fileName, area)
    //   }
    // }

    exitLog(funcName, fileName, area)
    return
  }

  // loop through delete dirs queue and delete all dirs
  deleteDirs(): void {
    const funcName: string = 'deleteDirs'
    entryLog(funcName, fileName, area)

    // for (const dir of this.dirDeleteActionQueue) {
    //   condLog(`Delete dir ${dir}`, funcName, fileName, area)
    //   try {
    //     fs.rmSync(dir, { recursive: true, force: true })
    //   } catch {
    //     errorLog(`Delete dir failed ${dir}`, funcName, fileName, area)
    //   }
    // }

    exitLog(funcName, fileName, area)
    return
  }

  // loop through delete files queue and delete all files
  deleteFiles(): void {
    const funcName: string = 'deleteFiles'
    entryLog(funcName, fileName, area)

    // for (const file of this.fileDeleteActionQueue) {
    //   condLog(`Delete file ${file}`, funcName, fileName, area)
    //   try {
    //     fs.unlinkSync(file)
    //   } catch {
    //     errorLog(`Delete file failed ${file}`, funcName, fileName, area)
    //   }
    // }

    exitLog(funcName, fileName, area)
    return
  }
}
