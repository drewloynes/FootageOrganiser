import { CopyPaths } from '@shared-all/types/ruleTypes'
import {
  getDriveInfoFromPath,
  getVolumeNameFromPath,
  updateCurrentDriveInfo
} from '@worker/drives/currentDriveInfo'
import { DriveInfo } from '@worker/drives/driveInfo'
import { sendAlertToMain } from '@worker/general/alert'
import { disableRuleCurrentRules } from '@worker/rules/currentRules'
import { Rule } from '@worker/rules/rule'
import { abortIfStateAwaitingChanges } from '@worker/state-changes/changeState'
import * as fs from 'fs'

const fileName = 'executionUtils.ts'
const area = 'execution'

export async function spaceToCopyFile(fileFromPath: string, fileToPath: string): Promise<boolean> {
  const funcName = 'spaceToCopyFile'
  entryLog(funcName, fileName, area)

  let isSpace = false
  await updateCurrentDriveInfo()
  const driveInfo: DriveInfo | undefined = getDriveInfoFromPath(fileToPath)

  try {
    const fileStats = fs.statSync(fileFromPath)
    if (
      driveInfo &&
      glob.workerGlobals.currentSettings &&
      driveInfo.available - fileStats.size >
        glob.workerGlobals.currentSettings.actionsCutoffInGBs * 1000000000
    ) {
      condLog(`Is space to copy file to drive`, funcName, fileName, area)
      isSpace = true
    }
  } catch {
    errorLog('Failed to get file stats', funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return isSpace
}

export async function handleOutOfDriveSpace(rule: Rule, files: CopyPaths): Promise<void> {
  const funcName = 'handleOutOfDriveSpace'
  entryLog(funcName, fileName, area)

  const outOfSpaceVolumeName = getVolumeNameFromPath(files.to)
  const alertMessage = `Out of storage space on drive: ${outOfSpaceVolumeName}`
  rule.setError(alertMessage)
  sendAlertToMain('Drive Space Full', alertMessage)
  rule.setActionsProgress(100)
  // This will always throw an error to exit the execution
  await disableRuleCurrentRules(rule.name, alertMessage)
  abortIfStateAwaitingChanges()

  exitLog(funcName, fileName, area)
  return
}

export async function executionFailed(rule: Rule, title: string, message: string): Promise<void> {
  const funcName = 'executionFailed'
  entryLog(funcName, fileName, area)

  sendAlertToMain(title, message)
  await disableRuleCurrentRules(rule.name, message)
  // This will always throw an error to exit the evaluation
  abortIfStateAwaitingChanges()

  exitLog(funcName, fileName, area)
  return
}
