import { Rule, RuleType } from '@shared/rules/rule'
import { RulePath } from '@shared/rules/rulePath'
import { TypeCopyFileFormatOptions, TypeCopyFileOptions } from '@shared/rules/typeCopyFileOptions'
import { TypeMirrorOptions } from '@shared/rules/typeMirrorOptions'
import { plainToInstance } from 'class-transformer'
import { createRulePathFromStringArray } from './rulePathUtils'
import { fillCopyTypeOptions, fillMirrorOptions } from './typeOptions'
import { IpcMessage } from '@shared/utils/ipc'
import { sendMessageWorker } from '../worker/ipc'
import { StatusType } from '@worker/rules/ruleStatus'

const fileName: string = 'ruleUtils.ts'
const area: string = 'rule'

export function intToExtFormat(rule: Rule) {
  const funcName: string = 'intToExtFormat'
  entryLog(funcName, fileName, area)

  const extRule = {
    ruleName: rule.getName(),
    ruleType: intToExtRuleType(rule.getType()),
    copyFrom: intToExtRulePath(rule.getFrom()),
    copyTo: intToExtRulePath(rule.getTo()),
    copyFilters: intToExtRulePathFilters(rule.getFrom()),
    stopAfterProcessing: rule.getStopAfterProcessing(),
    pauseProcessing: rule.getPauseProcessing(),
    copyFormat: intToExtCopyFormat(rule.getType(), rule.getTypeOptions()),
    customString: intToExtCustomString(rule.getType(), rule.getTypeOptions()),
    autoClean: intToExtAutoClean(rule.getType(), rule.getTypeOptions()),
    deleteExtra: intToExtDeleteExtra(rule.getType(), rule.getTypeOptions()),
    deleteExtraPaths: intToExtDeleteExtraPaths(rule.getType(), rule.getTypeOptions()),
    cleanTarget: intToExtCleanTarget(rule.getType(), rule.getTypeOptions()),
    deleteTarget: intToExtRulePathFilters(rule.getTo())
  }

  exitLog(funcName, fileName, area)
  return extRule
}

function intToExtRuleType(ruleType: RuleType): string {
  const funcName: string = 'intToExtRuleType'
  entryLog(funcName, fileName, area)

  let ruleTypeString: string = 'Copy File'
  if (ruleType === RuleType.MIRROR) {
    ruleTypeString = 'Mirror'
  }

  exitLog(funcName, fileName, area)
  return ruleTypeString
}

function intToExtRulePath(intRulePath: RulePath): string[] {
  const funcName: string = 'intToExtRulePath'
  entryLog(funcName, fileName, area)

  const extRulePath = [intRulePath.getVolumeName(), intRulePath.getVolumeRootPath()]

  exitLog(funcName, fileName, area)
  return extRulePath
}

function intToExtRulePathFilters(intRulePath: RulePath): object {
  const funcName: string = 'intToExtRulePathFilters'
  entryLog(funcName, fileName, area)

  const extRulePathFilters = {
    fileInclude: intRulePath.getFilesToInclude(),
    fileExclude: intRulePath.getFilesToExclude(),
    folderInclude: intRulePath.getDirsToInclude(),
    folderExclude: intRulePath.getDirsToExclude()
  }

  exitLog(funcName, fileName, area)
  return extRulePathFilters
}

function intToExtCopyFormat(
  ruleType: RuleType,
  intTypeOptions: TypeCopyFileOptions | TypeMirrorOptions
): string[] {
  const funcName: string = 'intToExtCopyFormat'
  entryLog(funcName, fileName, area)

  const extCopyFormat: string[] = []
  if (ruleType === RuleType.COPYFILE) {
    const CopyFileOptions: TypeCopyFileOptions = plainToInstance(
      TypeCopyFileOptions,
      intTypeOptions
    )
    for (const formatItem of CopyFileOptions.getCopyFortmat()) {
      extCopyFormat.push(intToExtCopyFormatItem(formatItem))
    }
  }

  exitLog(funcName, fileName, area)
  return extCopyFormat
}

function intToExtCopyFormatItem(formatItem: TypeCopyFileFormatOptions): string {
  const funcName: string = 'intToExtRulePathFilters'
  entryLog(funcName, fileName, area)

  let extFormatItem = ''
  switch (formatItem) {
    case TypeCopyFileFormatOptions.DAY: {
      extFormatItem = 'Day'
      break
    }
    case TypeCopyFileFormatOptions.MONTH: {
      extFormatItem = 'Month'
      break
    }
    case TypeCopyFileFormatOptions.YEAR: {
      extFormatItem = 'Year'
      break
    }
    case TypeCopyFileFormatOptions.VOLUME_NAME: {
      extFormatItem = 'Volume Name'
      break
    }
    case TypeCopyFileFormatOptions.FILE_FORMAT: {
      extFormatItem = 'File Format'
      break
    }
    case TypeCopyFileFormatOptions.CUSTOM: {
      extFormatItem = 'Custom'
      break
    }
  }

  exitLog(funcName, fileName, area)
  return extFormatItem
}

function intToExtCustomString(
  ruleType: RuleType,
  intTypeOptions: TypeCopyFileOptions | TypeMirrorOptions
): string {
  const funcName: string = 'imtToExtCustomString'
  entryLog(funcName, fileName, area)

  let extCustomString: string = ''
  if (ruleType === RuleType.COPYFILE) {
    const CopyFileOptions: TypeCopyFileOptions = plainToInstance(
      TypeCopyFileOptions,
      intTypeOptions
    )
    extCustomString = CopyFileOptions.getCustomName()
  }

  exitLog(funcName, fileName, area)
  return extCustomString
}

function intToExtAutoClean(
  ruleType: RuleType,
  intTypeOptions: TypeCopyFileOptions | TypeMirrorOptions
): boolean {
  const funcName: string = 'imtToExtAutoClean'
  entryLog(funcName, fileName, area)

  let extAutoClean: boolean = false
  if (ruleType === RuleType.COPYFILE) {
    const CopyFileOptions: TypeCopyFileOptions = plainToInstance(
      TypeCopyFileOptions,
      intTypeOptions
    )
    extAutoClean = CopyFileOptions.getAutoCleanFromPath()
  }

  exitLog(funcName, fileName, area)
  return extAutoClean
}

function intToExtDeleteExtra(
  ruleType: RuleType,
  intTypeOptions: TypeCopyFileOptions | TypeMirrorOptions
): boolean {
  const funcName: string = 'intToExtDeleteExtra'
  entryLog(funcName, fileName, area)

  let extDeleteExtra: boolean = false
  if (ruleType === RuleType.COPYFILE) {
    const CopyFileOptions: TypeCopyFileOptions = plainToInstance(
      TypeCopyFileOptions,
      intTypeOptions
    )
    extDeleteExtra = CopyFileOptions.getDeleteExtra()
  }

  exitLog(funcName, fileName, area)
  return extDeleteExtra
}

function intToExtDeleteExtraPaths(
  ruleType: RuleType,
  intTypeOptions: TypeCopyFileOptions | TypeMirrorOptions
): object[] {
  const funcName: string = 'intToExtDeleteExtraPaths'
  entryLog(funcName, fileName, area)

  const extDeleteExtraPaths: object[] = []
  if (ruleType === RuleType.COPYFILE) {
    const CopyFileOptions: TypeCopyFileOptions = plainToInstance(
      TypeCopyFileOptions,
      intTypeOptions
    )
    for (const extraDeletePath of CopyFileOptions.getExtraDeletePaths()) {
      extDeleteExtraPaths.push(intToExtExtraDeletePath(extraDeletePath))
    }
  }

  exitLog(funcName, fileName, area)
  return extDeleteExtraPaths
}

function intToExtExtraDeletePath(intExtraDeletePath: RulePath): object {
  const funcName: string = 'intToExtExtraDeletePath'
  entryLog(funcName, fileName, area)

  const extExtraDeletePath = {
    DeleteExtraPath: [intExtraDeletePath.getVolumeName(), intExtraDeletePath.getVolumeRootPath()],
    deleteExtraFileInclude: intExtraDeletePath.getFilesToInclude(),
    deleteExtraFileExclude: intExtraDeletePath.getFilesToExclude(),
    deleteExtraFolderInclude: intExtraDeletePath.getDirsToInclude(),
    deleteExtraFolderExclude: intExtraDeletePath.getDirsToExclude()
  }

  exitLog(funcName, fileName, area)
  return extExtraDeletePath
}

function intToExtCleanTarget(
  ruleType: RuleType,
  intTypeOptions: TypeCopyFileOptions | TypeMirrorOptions
): boolean {
  const funcName: string = 'intToExtCleanTarget'
  entryLog(funcName, fileName, area)

  let extCleanTarget: boolean = false
  if (ruleType === RuleType.MIRROR) {
    const MirrorOptions: TypeMirrorOptions = plainToInstance(TypeMirrorOptions, intTypeOptions)
    extCleanTarget = MirrorOptions.getDeleteExtrasInTo()
  }

  exitLog(funcName, fileName, area)
  return extCleanTarget
}

export function extToIntCopyFileRule(
  ruleName: string,
  fromStringArray: string[],
  toStringArray: string[],
  copyFilters: object,
  copyFormat: string[],
  customName: string,
  autoCleanFromPath: boolean,
  deleteExtra: boolean,
  deleteExtraPaths: object[],
  stopAfterProcessing: boolean,
  pauseProcessing: boolean
): Rule {
  const funcName: string = 'extToIntCopyFileRule'
  entryLog(funcName, fileName, area)

  const fromRulePath = createRulePathFromStringArray(
    fromStringArray,
    copyFilters.fileInclude,
    copyFilters.fileExclude,
    copyFilters.folderInclude,
    copyFilters.folderExclude
  )

  const toRulePath = createRulePathFromStringArray(toStringArray)

  const typeOptions = fillCopyTypeOptions(
    copyFormat,
    customName,
    autoCleanFromPath,
    deleteExtra,
    deleteExtraPaths
  )

  const newRule: Rule = new Rule(
    ruleName,
    RuleType.COPYFILE,
    fromRulePath,
    toRulePath,
    typeOptions,
    stopAfterProcessing,
    pauseProcessing
  )

  exitLog(funcName, fileName, area)
  return newRule
}

export function extToIntMirrorRule(
  ruleName: string,
  fromStringArray: string[],
  toStringArray: string[],
  copyFilters: object,
  targetFilters: object,
  cleanTarget: boolean,
  stopAfterProcessing: boolean,
  pauseProcessing: boolean
): Rule {
  const funcName: string = 'extToIntMirrorRule'
  entryLog(funcName, fileName, area)

  const fromRulePath = createRulePathFromStringArray(
    fromStringArray,
    copyFilters.fileInclude,
    copyFilters.fileExclude,
    copyFilters.folderInclude,
    copyFilters.folderExclude
  )

  const toRulePath = createRulePathFromStringArray(
    toStringArray,
    targetFilters.fileInclude,
    targetFilters.fileExclude,
    targetFilters.folderInclude,
    targetFilters.folderExclude
  )

  const typeOptions = fillMirrorOptions(cleanTarget)

  const newRule: Rule = new Rule(
    ruleName,
    RuleType.MIRROR,
    fromRulePath,
    toRulePath,
    typeOptions,
    stopAfterProcessing,
    pauseProcessing
  )

  exitLog(funcName, fileName, area)
  return newRule
}

export async function addRuleStatus(rule: object): Promise<object> {
  const funcName: string = 'addRuleStatus'
  entryLog(funcName, fileName, area)

  const ruleStatus = await getRuleStatus(rule)
  const extRuleStatus = intToExtRuleStatus(ruleStatus)
  const ruleWithStatus = mergeRuleAndStatus(rule, extRuleStatus)

  exitLog(funcName, fileName, area)
  return ruleWithStatus
}

export async function getRuleStatus(rule: object): Promise<unknown> {
  const funcName: string = 'getRuleStatus'
  entryLog(funcName, fileName, area)

  const requestId = uuidv4() // Generate a unique request ID
  const getWorkerDataPromise = new Promise((resolve, reject) => {
    // Send request to the worker process
    if (workerPort) {
      // Store the request so it can be resolved later
      ruleStatusPendingRequests.set(requestId, { resolve, reject })

      // Send request to Worker with a unique ID
      const message = new IpcMessage('rule-status', { requestId: requestId, name: rule.ruleName })
      sendMessageWorker(message)

      // Handle timeout
      setTimeout(() => {
        if (ruleStatusPendingRequests.has(requestId)) {
          ruleStatusPendingRequests.get(requestId).reject(new Error('Worker timeout'))
          ruleStatusPendingRequests.delete(requestId)
        }
      }, 5000)
    } else {
      reject(new Error('Worker Port Missing'))
    }
  })

  exitLog(funcName, fileName, area)
  return getWorkerDataPromise
}

export async function getAllRuleStatus(): Promise<unknown> {
  const funcName: string = 'getAllRuleStatus'
  entryLog(funcName, fileName, area)

  const requestId = uuidv4() // Generate a unique request ID
  const getWorkerDataPromise = new Promise((resolve, reject) => {
    // Send request to the worker process
    if (workerPort) {
      // Store the request so it can be resolved later
      ruleStatusAllPendingRequests.set(requestId, { resolve, reject })

      // Send request to Worker with a unique ID
      const message = new IpcMessage('rule-status-all', { requestId: requestId })
      sendMessageWorker(message)

      // Handle timeout
      setTimeout(() => {
        if (ruleStatusAllPendingRequests.has(requestId)) {
          ruleStatusAllPendingRequests.get(requestId).reject(new Error('Worker timeout'))
          ruleStatusAllPendingRequests.delete(requestId)
        }
      }, 5000)
    } else {
      reject(new Error('Worker Port Missing'))
    }
  })

  exitLog(funcName, fileName, area)
  return getWorkerDataPromise
}

export function intToExtRuleStatus(ruleStatus: object): object {
  const funcName: string = 'intToExtRuleStatus'
  entryLog(funcName, fileName, area)

  switch (ruleStatus.status) {
    case StatusType.UNKNOWN: {
      ruleStatus.status = 'Unknown'
      break
    }
    case StatusType.PAUSED: {
      ruleStatus.status = 'Paused'
      break
    }
    case StatusType.PROCESSING: {
      ruleStatus.status = 'Processing'
      break
    }
    case StatusType.NO_WORK: {
      ruleStatus.status = 'No Work'
      break
    }
    case StatusType.AWAITING_PROCESSING: {
      ruleStatus.status = 'Awaiting Processing'
      break
    }
    case StatusType.QUEUED_ACTIONS: {
      ruleStatus.status = 'Queued Actions'
      break
    }
    case StatusType.AWAITING_APPROVAL: {
      ruleStatus.status = 'Actions Awaiting Approval'
      break
    }
    case StatusType.ACTIONING: {
      ruleStatus.status = 'Actioning'
      break
    }
  }

  exitLog(funcName, fileName, area)
  return ruleStatus
}

export function mergeRuleAndStatus(rule: object, ruleStatus: unknown): object {
  const funcName: string = 'mergeRuleAndStatus'
  entryLog(funcName, fileName, area)

  rule.status = ruleStatus.status
  rule.fileCopyWaitingApproval = ruleStatus.fileCopyWaitingApproval
  rule.fileDeleteWaitingApproval = ruleStatus.fileDeleteWaitingApproval
  rule.dirCreateWaitingApproval = ruleStatus.dirCreateWaitingApproval
  rule.dirDeleteWaitingApproval = ruleStatus.dirDeleteWaitingApproval

  exitLog(funcName, fileName, area)
  return rule
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
