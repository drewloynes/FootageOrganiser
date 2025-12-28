import { RULE_STATUS_TYPE, RULE_TYPE, UNEVALUATABLE_REASON } from '@shared-all/types/ruleTypes'
import { generateChecksum } from '@shared-node/utils/checksum'
import { isPathFormatCompatible } from '@worker/drives/currentDriveInfo'
import { sendAlertToMain } from '@worker/general/alert'
import { disableRuleCurrentRules } from '@worker/rules/currentRules'
import { Rule } from '@worker/rules/rule'
import { abortIfStateAwaitingChanges } from '@worker/state-changes/changeState'
import * as fs from 'fs'
import * as path from 'path'

const fileName = 'evaluationUtils.ts'
const area = 'evaluation'

export async function checkRuleEvaluatability(rule: Rule): Promise<boolean> {
  const funcName = 'checkRuleEvaluatability'
  entryLog(funcName, fileName, area)

  let isEvaluateable = true
  rule.setUnevaluateableReason(UNEVALUATABLE_REASON.NO_PROBLEM)

  rule.origin.updateFullPathList()
  rule.target.updateFullPathList()

  if (rule.origin.countExistingFullPaths < 1) {
    condLog(`No origin full paths exist`, funcName, fileName, area)
    isEvaluateable = false
    rule.setUnevaluateableReason(UNEVALUATABLE_REASON.ZERO_EXISTING_TARGET_PATHS)
  } else if (rule.target.countExistingFullPaths < 1) {
    condLog(`No target full paths exist`, funcName, fileName, area)
    isEvaluateable = false
    rule.setUnevaluateableReason(UNEVALUATABLE_REASON.ZERO_EXISTING_ORIGIN_PATHS)
  } else if (rule.origin.countExistingFullPaths > 1 && rule.type === RULE_TYPE.MIRROR) {
    condLog(`Too many origin paths for a mirror rule`, funcName, fileName, area)
    // Mirror rules can only work if they mirror from 1 and only 1 path
    isEvaluateable = false
    rule.setUnevaluateableReason(UNEVALUATABLE_REASON.MIRROR_MULTIPLE_ORIGIN_PATHS)
  } else {
    // Check the path drives formats are compatible with the OS
    if (!isPathFormatCompatible(rule.target)) {
      condLog(`Target path format not compatible`, funcName, fileName, area)
      isEvaluateable = false
      rule.setUnevaluateableReason(UNEVALUATABLE_REASON.TARGET_PATH_FORMAT_NOT_COMPATIBLE)
    } else if (!isPathFormatCompatible(rule.origin)) {
      condLog(`Origin path format not compatible`, funcName, fileName, area)
      isEvaluateable = false
      rule.setUnevaluateableReason(UNEVALUATABLE_REASON.ORIGIN_PATH_FORMAT_NOT_COMPATIBLE)
    }
  }

  if (!isEvaluateable) {
    condLog(`Rule is not evaluatable`, funcName, fileName, area)
    rule.setStatus(RULE_STATUS_TYPE.NOT_EVALUATABLE)
  }

  exitLog(funcName, fileName, area)
  return isEvaluateable
}

// Must skip all windows / mac objects as hard drives may be used across both
export function ignoreSystemObject(systemObject: fs.Dirent): boolean {
  const funcName = 'ignoreSystemObject'
  entryLog(funcName, fileName, area)

  let ignore = false

  // Skip windows special object names
  if (systemObject.name === '$RECYCLE.BIN') {
    condLog(`$RECYCLE.BIN is Windows special system object name`, funcName, fileName, area)
    ignore = true
  }
  if (systemObject.name === 'System Volume Information') {
    condLog(
      `System Volume Information is Windows special system object name`,
      funcName,
      fileName,
      area
    )
    ignore = true
  }

  // Skip any hidden objects on mac - begin with .
  if (systemObject.name.startsWith('.')) {
    condLog(
      `Starting with . ${systemObject.name} is Mac hidden object name`,
      funcName,
      fileName,
      area
    )
    ignore = true
  }

  exitLog(funcName, fileName, area)
  return ignore
}

// Must skip all windows / mac objects as hard drives may be used across both
export function ignoreFile(pathToFile: string): boolean {
  const funcName = 'ignoreFile'
  entryLog(funcName, fileName, area)

  let ignore = false
  const nameOfFile: string = path.basename(pathToFile)

  if (nameOfFile === 'desktop.ini') {
    condLog(`File name is desktop.ini files from windows`, funcName, fileName, area)
    ignore = true
  }

  if (nameOfFile === '.DS_Store') {
    condLog(`File name is .DS_Store files from mac`, funcName, fileName, area)
    ignore = true
  }

  exitLog(funcName, fileName, area)
  return ignore
}

export async function generateTargetFilePath(
  rule: Rule,
  initialOriginPath: string,
  pathToOriginFile: string,
  initialTargetPath: string
): Promise<string> {
  const funcName = 'generateTargetFilePath'
  entryLog(funcName, fileName, area)

  let copyToPath: string
  switch (rule.type) {
    case RULE_TYPE.COPYFILE: {
      condLog(`Copy file type`, funcName, fileName, area)
      const formatPath: string = await rule.copyFileOptions.generateTargetSubPath(pathToOriginFile)
      copyToPath = initialTargetPath + formatPath + path.sep + path.basename(pathToOriginFile)
      break
    }
    case RULE_TYPE.MIRROR: {
      condLog(`Mirror type`, funcName, fileName, area)
      copyToPath = initialTargetPath + pathToOriginFile.slice(initialOriginPath.length)
      break
    }
    default: {
      errorLog('Rule type not valid', funcName, fileName, area)
      throw 'Rule should be found in this list'
    }
  }

  exitLog(funcName, fileName, area)
  return copyToPath
}

export async function deleteFileUnderOriginPath(
  rule: Rule,
  originFilePath: string,
  targetFilePath: string
): Promise<boolean> {
  const funcName = 'deleteFileUnderOriginPath'
  entryLog(funcName, fileName, area)

  let deleteFile = false

  if (rule.type !== RULE_TYPE.COPYFILE || !rule.copyFileOptions.deleteCopiedFiles) {
    condExitLog(`Not a copy file rule or not set to delete copied files`, funcName, fileName, area)
    return deleteFile
  }

  abortIfStateAwaitingChanges()

  if (await checksumValidatePaths(rule, originFilePath, targetFilePath)) {
    condLog(`Target and origin checksums match`, funcName, fileName, area)
    deleteFile = true
  } else {
    warnLog(`Checksum failed, report and disable rule`, funcName, fileName, area)
    const alertMessage = `The checksum has failed between paths ${originFilePath} and ${targetFilePath}`
    sendAlertToMain('Checksum Failed', alertMessage)
    // This will always throw an error to exit the evaluation
    await disableRuleCurrentRules(rule.name, alertMessage)
    abortIfStateAwaitingChanges()
  }

  exitLog(funcName, fileName, area)
  return deleteFile
}

async function checksumValidatePaths(
  rule: Rule,
  originFilePath: string,
  targetFilePath: string
): Promise<boolean> {
  const funcName = 'checksumValidatePaths'
  entryLog(funcName, fileName, area)

  rule.setStatus(RULE_STATUS_TYPE.CHECKSUM_RUNNING)
  rule.setChecksumAction(`Checksumming ${originFilePath} with ${targetFilePath}`)

  if (!glob.workerGlobals.currentSettings) {
    errorExitLog(`Current settings doesn't exist when it should`, funcName, fileName, area)
    return false
  }

  const [originCheckSum, targetCheckSum] = await Promise.all([
    generateChecksum(originFilePath, glob.workerGlobals.currentSettings?.checksumMethod),
    generateChecksum(targetFilePath, glob.workerGlobals.currentSettings?.checksumMethod)
  ])

  rule.setStatus(RULE_STATUS_TYPE.EVALUATING)
  rule.setChecksumAction('')
  abortIfStateAwaitingChanges()

  exitLog(funcName, fileName, area)
  return originCheckSum === targetCheckSum
}
