import { RulePath } from '@shared/rules/rulePath'
import { pathExists } from '@shared/storage/storeData'
import * as fs from 'fs'
import * as path from 'path'
import { TypeCopyFileOptions } from './typeCopyFileOptions'
import { TypeMirrorOptions } from './typeMirrorOptions'
import { plainToInstance } from 'class-transformer'
import { CheckSumType, generateCheckSum } from '@shared/utils/checkSum'
import { RuleFullPath } from './ruleFullPath'
import { ActionType, addActionLog } from '@shared/storage/storeLogs'
import { afterQueueProc } from '@worker/communication/ipc/inputQueue'
import { Rules } from './rules'
import { DriveInfo } from '@shared/drives/driveInfo'
import { RuleStatus, StatusType } from '@worker/rules/ruleStatus'

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

export interface CopyPaths {
  from: string
  to: string
}

export class Rule {
  // Rule name - Used as its ID
  private name: string
  // Rule type - self explanatory
  private type: RuleType
  // Target and Original paths to copy from and to
  private from: RulePath
  private to: RulePath
  // Extra options per rule type and options specific for coping
  private typeOptions: TypeCopyFileOptions | TypeMirrorOptions
  // Whether to set the rule as stopped after each processing - requiring confirmation to proceed
  private stopAfterProcessing: boolean
  // Pause prcoessing of rule
  private pauseProcessing: boolean

  // Whether doing the work in the action queues is stopped or not
  private startActions: boolean
  private reevaluateRule: boolean
  // Queues for making or deleting directorys
  // - Just lists of directories to make or delete
  private dirMakeActionQueue: string[]
  private dirDeleteActionQueue: string[]
  // Queues for copying or deleting files
  // - List of objects of paths to files copying from (origin path) and to (target path)
  // - List of paths of files to delete
  private fileCopyActionQueue: CopyPaths[]
  private fileDeleteActionQueue: string[]

  // Is the rule currently actionable?
  // (E.G. do full paths exists, is a mirror trying to mirror from multiple paths)
  private isActionable: boolean
  // Describes problem if isActionable is false
  private isActionableReason: ActionableReason
  // There is work to do which we can currently action on
  private pendingActions: boolean
  private copyingComplete: boolean

  /* --- Constructor & Getters / Setters --- */

  constructor(
    ruleName: string,
    type: RuleType,
    fromRulePath: RulePath,
    toRulePath: RulePath,
    typeOptions: TypeCopyFileOptions | TypeMirrorOptions,
    stopAfterProcessing: boolean,
    pauseProcessing: boolean
  ) {
    const funcName = 'Rule Constructor'
    entryLog(funcName, fileName, area)

    this.name = ruleName
    this.type = type
    this.typeOptions = typeOptions
    this.stopAfterProcessing = stopAfterProcessing
    this.pauseProcessing = pauseProcessing

    if (stopAfterProcessing) {
      this.startActions = false
    } else {
      this.startActions = true
    }
    this.reevaluateRule = true
    this.dirMakeActionQueue = []
    this.dirDeleteActionQueue = []
    this.fileCopyActionQueue = []
    this.fileDeleteActionQueue = []

    this.isActionable = false
    this.isActionableReason = ActionableReason.NOPROBLEM
    this.pendingActions = false
    this.copyingComplete = false
    this.from = fromRulePath
    this.to = toRulePath

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

  getStopAfterProcessing(): boolean {
    const funcName = 'getStopAfterProcessing'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.stopAfterProcessing
  }

  getPauseProcessing(): boolean {
    const funcName = 'getPauseProcessing'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.pauseProcessing
  }

  getDirMakeActionQueue(): string[] {
    const funcName = 'getDirMakeActionQueue'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.dirMakeActionQueue
  }

  getDirDeleteActionQueue(): string[] {
    const funcName = 'getDirDeleteActionQueue'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.dirDeleteActionQueue
  }

  getFileCopyActionQueue(): CopyPaths[] {
    const funcName = 'getFileCopyActionQueue'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.fileCopyActionQueue
  }

  getFileDeleteActionQueue(): string[] {
    const funcName = 'getFileDeleteActionQueue'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.fileDeleteActionQueue
  }

  /* --- Functions --- */

  setPauseProcessing(pauseProcessing: boolean): void {
    const funcName = 'setPauseProcessing'
    entryLog(funcName, fileName, area)

    this.pauseProcessing = pauseProcessing

    exitLog(funcName, fileName, area)
    return
  }

  /* Calculate actionable work by filling in actionQueues and seeing if there is any actions to do */
  async checkPendingActions(recalculate = true): Promise<boolean> {
    const funcName = 'checkPendingActions'
    entryLog(funcName, fileName, area)

    if (this.pauseProcessing === true || this.reevaluateRule === false) {
      condLog(`Skip evaluation`, funcName, fileName, area)
      // No need to change the current status of rule as it wont be getting processed
    } else if (recalculate) {
      condLog(`Recalculate the actions`, funcName, fileName, area)
      RuleStatus.setRuleStatusInList(this, StatusType.PROCESSING)
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
      if (this.startActions === true) {
        RuleStatus.setRuleStatusInList(this, StatusType.QUEUED_ACTIONS)
      } else {
        RuleStatus.setRuleStatusInList(this, StatusType.AWAITING_APPROVAL)
        RuleStatus.setRuleStatusPendingWorkInList(this)
      }
    } else {
      condLog(`Nothing to do in actionQueue`, funcName, fileName, area)
      this.pendingActions = false
      RuleStatus.setRuleStatusInList(this, StatusType.NO_WORK)
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
        for (const toFullPath of this.to.getFullPathList()) {
          condLog(`Recsurse and add actions for deleteing in to path`, funcName, fileName, area)
          await this.recurseAddAction(
            toFullPath.getPath(),
            this.to,
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
      // it it starts with something weird like $ then skip
      if (entry.name === '$RECYCLE.BIN' || entry.name === 'System Volume Information') {
        condLog(`Recycle bin - skip it`, funcName, fileName, area)
        continue
      }
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
          (this.getFrom().shouldDirBeIncluded(currentFullPath) && copyOrDelete === CopOrDel.COPY) ||
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
      if (this.getFrom().shouldDirBeIncluded(fromDirPath)) {
        // Add an action for each existing to full path
        for (const toFullPath of this.to.getFullPathList()) {
          condLog(`Create new toDirPath from new toFullPath`, funcName, fileName, area)
          const toDirPath: string = toFullPath.getPath() + fromDirPath.slice(fromFullPath.length)
          if (!pathExists(toDirPath)) {
            condLog(`Dir doesnt exist - Add directory to actionsQueue`, funcName, fileName, area)
            this.dirMakeActionQueue.push(toDirPath)
            infoLog(`Add ${toDirPath} to make dir action queue`, funcName, fileName, area)
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

    if (this.getFrom().shouldFileBeIncluded(fromFilePath)) {
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
            infoLog(`Add ${fromFilePath} to copy file action queue`, funcName, fileName, area)
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
  private addDirToDeleteActionQueue(toDirPath: string, toFullPath: string): void {
    const funcName = 'addDirToDeleteActionQueue'
    entryLog(funcName, fileName, area)

    // from full path list must contain only 1 item! and it must exist
    const fromFullPathList: RuleFullPath[] = this.from.getFullPathList()
    const fromFullPath: string = fromFullPathList[0].getPath()
    const fromDirPath: string = fromFullPath + toDirPath.slice(toFullPath.length)

    // Set to delete if:
    // - Dir doesnt exist in origin path
    // - Dir is included in the target dir filters
    if (this.getTo().shouldDirBeIncluded(toDirPath)) {
      condLog(`Dir filtered in`, funcName, fileName, area)
      if (!pathExists(fromDirPath)) {
        condLog(
          `Dir doesnt exist under from - Add dir to delete actionsQueue`,
          funcName,
          fileName,
          area
        )
        this.dirDeleteActionQueue.push(toDirPath)
        infoLog(`Add ${toDirPath} to delete dir action queue`, funcName, fileName, area)
      }
    }

    exitLog(funcName, fileName, area)
    return
  }

  private addFileToDeleteActionQueue(toFilePath: string, toFullPath: string): void {
    const funcName = 'addFileToDeleteActionQueue'
    entryLog(funcName, fileName, area)

    // from full path list must contain only 1 item! and it must exist
    const fromFullPathList: RuleFullPath[] = this.from.getFullPathList()
    const fromFullPath: string = fromFullPathList[0].getPath()
    const fromFilePath: string = fromFullPath + toFilePath.slice(toFullPath.length)

    // Set to delete if:
    // - File doesnt exist in origin path
    // - File is included in the target file filters
    if (this.getTo().shouldFileBeIncluded(toFilePath)) {
      condLog(`File filtered in`, funcName, fileName, area)
      if (!pathExists(fromFilePath)) {
        condLog(
          `File doesnt exist under from - Add dir to delete actionsQueue`,
          funcName,
          fileName,
          area
        )
        this.fileDeleteActionQueue.push(toFilePath)
        infoLog(`Add ${toFilePath} to delete file action queue`, funcName, fileName, area)
      }
    }

    exitLog(funcName, fileName, area)
    return
  }

  // Just for deleting copy-file extra dirs
  private addDirToDeleteActionQueueExtra(path: string, rulePath: RulePath): void {
    const funcName = 'addDirToDeleteActionQueueExtra'
    entryLog(funcName, fileName, area)

    // If path included, delete it
    if (rulePath.shouldDirBeIncluded(path)) {
      condLog(`Add dir to delete actionsQueue`, funcName, fileName, area)
      this.dirDeleteActionQueue.push(path)
      infoLog(`Add ${path} to delete dir action queue`, funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return
  }

  // Just for deleting copy-file extra files
  private addFileToDeleteActionQueueExtra(path: string, rulePath: RulePath): void {
    const funcName = 'addFileToDeleteActionQueueExtra'
    entryLog(funcName, fileName, area)

    // If file included, delete it
    if (rulePath.shouldFileBeIncluded(path)) {
      condLog(`Add file to delete actionsQueue`, funcName, fileName, area)
      this.fileDeleteActionQueue.push(path)
      infoLog(`Add ${path} to delete file action queue`, funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return
  }

  // loop through mkdirs queue and make all dirs
  mkDirs(currentRules: Rules): afterQueueProc {
    const funcName: string = 'mkdirs'
    entryLog(funcName, fileName, area)

    let inputQueueReaction = afterQueueProc.NOTHING
    let updatedDirMakeActionQueue = [...this.dirMakeActionQueue]
    for (const dir of this.dirMakeActionQueue) {
      condLog(`Make dir ${dir}`, funcName, fileName, area)
      // Check inputQueues for work
      try {
        fs.mkdirSync(dir, { recursive: true })
        addActionLog(this.name, ActionType.MAKE_DIRECTORY, dir)
        updatedDirMakeActionQueue = updatedDirMakeActionQueue.filter((matchDir) => matchDir !== dir)
      } catch {
        errorLog(`Make dir failed: ${dir}`, funcName, fileName, area)
      }
      inputQueueReaction = workerConfig.getInputQueues().processInputQueue(currentRules)
      if (
        inputQueueReaction === afterQueueProc.REEVALUATE_ALL_RULES ||
        inputQueueReaction === afterQueueProc.RESTART_DOING_ALL_ACTIONS
      ) {
        break
      } else if (inputQueueReaction === afterQueueProc.MAYBE_SKIP_CURRENT_RULE) {
        const currentRule = currentRules.getRuleList().find((rule) => rule.name === this.name)
        if (currentRule === undefined || currentRule.startActions === false) {
          inputQueueReaction = afterQueueProc.SKIP_CURRENT_RULE
          break
        }
      }
    }
    this.dirMakeActionQueue = updatedDirMakeActionQueue

    exitLog(funcName, fileName, area)
    return inputQueueReaction
  }

  private async isSpaceToCopyFile(fromPath: string, toPath: string) {
    const funcName: string = 'copyFiles'
    entryLog(funcName, fileName, area)

    let isSpace: boolean = false
    const driveInfo: DriveInfo | undefined = DriveInfo.getDriveInfoFromPath(toPath)
    const actionCutoffInGBs = footageOrganiserSettings.getActionCutoffInGBs()
    try {
      const fileStats = fs.statSync(fromPath)
      if (driveInfo) {
        if (driveInfo.available - fileStats.size > actionCutoffInGBs) {
          condLog(`No space to copy file to drive`, funcName, fileName, area)
          isSpace = true
        }
      }
    } catch {
      errorLog('Failed to get file stats', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return isSpace
  }

  // loop through copy file queue and copy files
  async copyFiles(currentRules: Rules): Promise<afterQueueProc> {
    const funcName: string = 'copyFiles'
    entryLog(funcName, fileName, area)

    let inputQueueReaction = afterQueueProc.NOTHING
    let updatedFileCopyActionQueue = [...this.fileCopyActionQueue]
    for (const files of this.fileCopyActionQueue) {
      condLog(`Copy file from ${files.from} to ${files.to}`, funcName, fileName, area)
      if (!this.isSpaceToCopyFile(files.from, files.to)) {
        condLog(`No space to copy file to drive`, funcName, fileName, area)
        inputQueueReaction = afterQueueProc.SKIP_CURRENT_RULE
        break
      }
      try {
        fs.mkdirSync(path.dirname(files.to), { recursive: true })
        fs.copyFileSync(files.from, files.to, fs.constants.COPYFILE_EXCL)
        addActionLog(this.name, ActionType.COPY_FILE, files)
        updatedFileCopyActionQueue = updatedFileCopyActionQueue.filter(
          (matchFiles) => matchFiles.from !== files.from && matchFiles.to !== files.to
        )
      } catch {
        errorLog(`Copy file failed from ${files.from} to ${files.to}`, funcName, fileName, area)
      }
      inputQueueReaction = workerConfig.getInputQueues().processInputQueue(currentRules)
      if (
        inputQueueReaction === afterQueueProc.REEVALUATE_ALL_RULES ||
        inputQueueReaction === afterQueueProc.RESTART_DOING_ALL_ACTIONS
      ) {
        break
      } else if (inputQueueReaction === afterQueueProc.MAYBE_SKIP_CURRENT_RULE) {
        const currentRule = currentRules.getRuleList().find((rule) => rule.name === this.name)
        if (currentRule === undefined || currentRule.startActions === false) {
          inputQueueReaction = afterQueueProc.SKIP_CURRENT_RULE
          break
        }
      }
    }
    this.fileCopyActionQueue = updatedFileCopyActionQueue

    exitLog(funcName, fileName, area)
    return inputQueueReaction
  }

  // loop through delete dirs queue and delete all dirs
  deleteDirs(currentRules: Rules): afterQueueProc {
    const funcName: string = 'deleteDirs'
    entryLog(funcName, fileName, area)

    let inputQueueReaction = afterQueueProc.NOTHING
    let updatedDirDeleteActionQueue = [...this.dirDeleteActionQueue]
    for (const dir of this.dirDeleteActionQueue) {
      condLog(`Delete dir ${dir}`, funcName, fileName, area)
      try {
        fs.rmSync(dir, { recursive: true, force: true })
        addActionLog(this.name, ActionType.DELETE_DIRECTORY, dir)
        updatedDirDeleteActionQueue = updatedDirDeleteActionQueue.filter(
          (matchDir) => matchDir !== dir
        )
      } catch {
        errorLog(`Delete dir failed ${dir}`, funcName, fileName, area)
      }
      inputQueueReaction = workerConfig.getInputQueues().processInputQueue(currentRules)
      if (
        inputQueueReaction === afterQueueProc.REEVALUATE_ALL_RULES ||
        inputQueueReaction === afterQueueProc.RESTART_DOING_ALL_ACTIONS
      ) {
        break
      } else if (inputQueueReaction === afterQueueProc.MAYBE_SKIP_CURRENT_RULE) {
        const currentRule = currentRules.getRuleList().find((rule) => rule.name === this.name)
        if (currentRule === undefined || currentRule.startActions === false) {
          inputQueueReaction = afterQueueProc.SKIP_CURRENT_RULE
          break
        }
      }
    }
    this.dirDeleteActionQueue = updatedDirDeleteActionQueue

    exitLog(funcName, fileName, area)
    return inputQueueReaction
  }

  // loop through delete files queue and delete all files
  deleteFiles(currentRules: Rules): afterQueueProc {
    const funcName: string = 'deleteFiles'
    entryLog(funcName, fileName, area)

    let inputQueueReaction = afterQueueProc.NOTHING
    let updatedFileDeleteActionQueue = [...this.fileDeleteActionQueue]
    for (const file of this.fileDeleteActionQueue) {
      condLog(`Delete file ${file}`, funcName, fileName, area)
      try {
        fs.unlinkSync(file)
        addActionLog(this.name, ActionType.DELETE_FILE, file)
        updatedFileDeleteActionQueue = updatedFileDeleteActionQueue.filter(
          (matchFile) => matchFile !== file
        )
      } catch {
        errorLog(`Delete file failed ${file}`, funcName, fileName, area)
      }
      inputQueueReaction = workerConfig.getInputQueues().processInputQueue(currentRules)
      if (
        inputQueueReaction === afterQueueProc.REEVALUATE_ALL_RULES ||
        inputQueueReaction === afterQueueProc.RESTART_DOING_ALL_ACTIONS
      ) {
        break
      } else if (inputQueueReaction === afterQueueProc.MAYBE_SKIP_CURRENT_RULE) {
        const currentRule = currentRules.getRuleList().find((rule) => rule.name === this.name)
        if (currentRule === undefined || currentRule.startActions === false) {
          inputQueueReaction = afterQueueProc.SKIP_CURRENT_RULE
          break
        }
      }
    }
    this.fileDeleteActionQueue = updatedFileDeleteActionQueue

    exitLog(funcName, fileName, area)
    return inputQueueReaction
  }

  setReevaluate(): void {
    const funcName: string = 'setReevaluate'
    entryLog(funcName, fileName, area)

    this.reevaluateRule = true
    this.dirDeleteActionQueue = []
    this.dirMakeActionQueue = []
    this.fileCopyActionQueue = []
    this.fileDeleteActionQueue = []
    this.startActions = false

    exitLog(funcName, fileName, area)
    return
  }

  setStart(): void {
    const funcName: string = 'setStart'
    entryLog(funcName, fileName, area)

    this.startActions = true
    RuleStatus.setRuleStatusInList(this, StatusType.QUEUED_ACTIONS)
    RuleStatus.emptyRuleStatusPendingWorkInList(this)

    exitLog(funcName, fileName, area)
    return
  }

  getStartActions(): boolean {
    const funcName: string = 'getStartActions'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.startActions
  }

  setStop(): void {
    const funcName: string = 'setStop'
    entryLog(funcName, fileName, area)

    this.startActions = false
    // Cant set RuleStatus here as action queues are not updated with what has been completed and not

    exitLog(funcName, fileName, area)
    return
  }

  updateCurrentInfo(previousRule: Rule): void {
    const funcName: string = 'updateCurrentInfo'
    entryLog(funcName, fileName, area)

    this.startActions = previousRule.startActions
    this.reevaluateRule = previousRule.reevaluateRule

    exitLog(funcName, fileName, area)
    return
  }
}
