import { RULE_STATUS_TYPE } from '@shared/types/ruleTypes'
import { Rule } from '@worker/rules/rule'
import {
  abortIfStateAwaitingChanges,
  processErrorForStateChanges
} from '@worker/state-changes/changeState'
import { ACTION_TYPE, addActionLog } from '@worker/storage/logs/storeLogs'
import * as fs from 'fs'
import { copyFile, mkdir, rm, unlink } from 'fs/promises'
import * as path from 'path'
import { executionFailed, handleOutOfDriveSpace, spaceToCopyFile } from './executionUtils'

const fileName: string = 'execution.ts'
const area: string = 'execution'

export async function executeCurrentRules(): Promise<void> {
  const funcName = 'executeCurrentRules'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.currentRules) {
    errorExitLog(`Current rules doesnt exist when it should`, funcName, fileName, area)
    return
  }

  for (const rule of glob.workerGlobals.currentRules.ruleList) {
    condLog(`Attempt to execute on rule: ${rule.name}`, funcName, fileName, area)

    if (!rule.startActions || rule.evaluateRule || rule.disabled) {
      condLog(`Skip rule ${rule.name}`, funcName, fileName, area)
      continue
    }

    glob.workerGlobals.ruleInUse = rule
    rule.setStatus(RULE_STATUS_TYPE.EXECUTING_ACTIONS)
    rule.setExecutingAction('')
    rule.setActionsProgress(0)

    try {
      await executeMakeDirectories(rule)
      await executeCopyFiles(rule)
      await executeDeleteFiles(rule)
      await executeDeleteDirectories(rule)

      rule.setStatus(RULE_STATUS_TYPE.AWAITING_EVALUATION)
      rule.setExecutingAction('')
      rule.setActionsProgress(0)
      rule.setSilentEvaluate()
    } catch (err) {
      condLog(`Caught error`, funcName, fileName, area)
      await processErrorForStateChanges(err)
    }
  }

  glob.workerGlobals.ruleInUse = undefined

  // if any rules are still awaiting execution - recurse this function
  if (glob.workerGlobals.currentRules.containsRulesAwaitingExecution()) {
    condLog(`Some rules still require execution`, funcName, fileName, area)
    executeCurrentRules()
  }

  exitLog(funcName, fileName, area)
  return
}

async function executeMakeDirectories(rule: Rule): Promise<void> {
  const funcName: string = 'executeMakeDirectories'
  entryLog(funcName, fileName, area)

  rule.setExecutingAction('Making directories')

  const fullDirMakeActionQueue = [...rule.dirMakeActionQueue]
  for (const directory of fullDirMakeActionQueue) {
    condLog(`Make directory ${directory}`, funcName, fileName, area)

    try {
      await mkdir(directory, { recursive: true })
    } catch {
      errorLog(`Make directory failed: ${directory}`, funcName, fileName, area)
      executionFailed(rule, 'Creating Folder Failed', `Failed to create the folder ${directory}`)
    }

    addActionLog(rule.name, ACTION_TYPE.MAKE_DIRECTORY, directory)
    rule.dirMakeActionQueue = rule.dirMakeActionQueue.filter(
      (dirToMatch) => dirToMatch !== directory
    )
    abortIfStateAwaitingChanges()
  }

  rule.dirMakeActionQueue = []

  exitLog(funcName, fileName, area)
  return
}

async function executeCopyFiles(rule: Rule): Promise<void> {
  const funcName: string = 'executeCopyFiles'
  entryLog(funcName, fileName, area)

  const fullFileCopyActionQueue = [...rule.fileCopyActionQueue]
  for (const files of fullFileCopyActionQueue) {
    condLog(`Copy file from ${files.from} to ${files.to}`, funcName, fileName, area)

    rule.setExecutingAction(`Copying ${files.from} to ${files.to}`)

    if (!(await spaceToCopyFile(files.from, files.to))) {
      condLog(`No space to copy file to drive`, funcName, fileName, area)
      handleOutOfDriveSpace(rule, files)
      // No need to break, will always throw an error and exit execution of rule
    }

    try {
      // Tested 30GB and does not cause 100ms + latency to event loop
      await mkdir(path.dirname(files.to), { recursive: true })
      await copyFile(files.from, files.to, fs.constants.COPYFILE_EXCL)
    } catch {
      errorLog(`Copy file failed from ${files.from} to ${files.to}`, funcName, fileName, area)
      executionFailed(
        rule,
        'Copying Files Failed',
        `Failed to copy file from ${files.from} to ${files.to}`
      )
    }

    addActionLog(rule.name, ACTION_TYPE.COPY_FILE, files)
    rule.fileCopyActionQueue = rule.fileCopyActionQueue.filter(
      (filesToMatch) => filesToMatch.from !== files.from && filesToMatch.to !== files.to
    )
    rule.setActionsProgress(
      Math.round((1 - rule.fileCopyActionQueue.length / fullFileCopyActionQueue.length) * 100)
    )
    abortIfStateAwaitingChanges()
  }

  rule.fileCopyActionQueue = []

  exitLog(funcName, fileName, area)
  return
}

async function executeDeleteFiles(rule: Rule): Promise<void> {
  const funcName: string = 'executeDeleteFiles'
  entryLog(funcName, fileName, area)

  rule.setExecutingAction(`Deleting files`)

  const fullFileDeleteActionQueue = [...rule.fileDeleteActionQueue]
  for (const file of fullFileDeleteActionQueue) {
    condLog(`Delete file ${file}`, funcName, fileName, area)

    try {
      await unlink(file)
    } catch {
      errorLog(`Deleting file failed ${file}`, funcName, fileName, area)
      executionFailed(rule, 'Deleting File Failed', `Failed to delete the file ${file}`)
    }

    addActionLog(rule.name, ACTION_TYPE.DELETE_FILE, file)
    rule.fileDeleteActionQueue = rule.fileDeleteActionQueue.filter(
      (fileToMatch) => fileToMatch !== file
    )
    abortIfStateAwaitingChanges()
  }

  rule.fileDeleteActionQueue = []

  exitLog(funcName, fileName, area)
  return
}

async function executeDeleteDirectories(rule: Rule): Promise<void> {
  const funcName: string = 'executeDeleteDirectories'
  entryLog(funcName, fileName, area)

  rule.setExecutingAction(`Deleting directories`)

  const fullDirDeleteActionQueue = [...rule.dirDeleteActionQueue]
  for (const directory of fullDirDeleteActionQueue) {
    condLog(`Delete directory ${directory}`, funcName, fileName, area)

    try {
      await rm(directory, { recursive: true, force: true })
    } catch {
      errorLog(`Delete directory failed ${directory}`, funcName, fileName, area)
      executionFailed(rule, 'Deleting Folder Failed', `Failed to delete the folder ${directory}`)
    }

    addActionLog(rule.name, ACTION_TYPE.DELETE_DIRECTORY, directory)
    rule.dirDeleteActionQueue = rule.dirDeleteActionQueue.filter(
      (dirToMatch) => dirToMatch !== directory
    )
    abortIfStateAwaitingChanges()
  }

  rule.dirDeleteActionQueue = []

  exitLog(funcName, fileName, area)
  return
}
