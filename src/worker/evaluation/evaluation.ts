import { RULE_STATUS_TYPE, RULE_TYPE } from '@shared/types/ruleTypes'
import { pathExists } from '@shared/utils/filePaths'
import { Rule } from '@worker/rules/rule'
import {
  abortIfStateAwaitingChanges,
  processErrorForStateChanges
} from '@worker/state-changes/changeState'
import * as fs from 'fs'
import * as path from 'path'
import { PATH_IN_VOLUME_TYPE, PathInVolume } from '../path/pathInVolume'
import {
  checkRuleEvaluatability,
  deleteFileUnderOriginPath,
  generateTargetFilePath,
  ignoreFile,
  ignoreSystemObject
} from './evaluationUtils'

const fileName: string = 'evaluation.ts'
const area: string = 'evaluation'

export async function evaluateCurrentRules(): Promise<boolean> {
  const funcName = 'evaluateCurrentRules'
  entryLog(funcName, fileName, area)

  let hasExecutableActions: boolean = false
  if (!glob.workerGlobals.currentRules) {
    errorExitLog(`currentRules doesn't exist`, funcName, fileName, area)
    return hasExecutableActions
  }

  try {
    for (const rule of glob.workerGlobals.currentRules.ruleList) {
      condLog(`Checking rule ${rule.name}`, funcName, fileName, area)
      glob.workerGlobals.ruleInUse = rule

      // Evalute the rule for actions to do
      await evaluateRule(rule)
      if (rule.hasExecutableActions()) {
        condLog(`Rule ${rule.name} has actions to execute`, funcName, fileName, area)
        hasExecutableActions = true
      }
    }
  } catch (err) {
    condLog(`Caught error`, funcName, fileName, area)
    await processErrorForStateChanges(err)
  }

  glob.workerGlobals.ruleInUse = undefined

  // if any rules are awaiting evaluation - recurse this function
  if (glob.workerGlobals.currentRules.containsRulesAwaitingEvaluation()) {
    condLog(`Some rules still require evaluation`, funcName, fileName, area)
    evaluateCurrentRules()
  }

  exitLog(funcName, fileName, area)
  return hasExecutableActions
}

async function evaluateRule(rule: Rule): Promise<void> {
  const funcName = 'evaluateRule'
  entryLog(funcName, fileName, area)

  if (!rule.evaluateRule) {
    condExitLog(`Do not attempt to evaluate rule: ${rule.name}`, funcName, fileName, area)
    // Could be:
    // - Waiting for approval to start actions previously evaluated
    // - Just was evaluated and hasn't has chance to be executed yet
    // - Is currently disabled
    return
  }

  if (await checkRuleEvaluatability(rule)) {
    condLog(`Rule: '${rule.name}' is evaluatable`, funcName, fileName, area)
    rule.setStatus(RULE_STATUS_TYPE.EVALUATING)
    rule.setError('')
    await fillRuleActionQueues(rule)
  }

  abortIfStateAwaitingChanges()

  if (rule.hasActions()) {
    condLog(`There is pending actions`, funcName, fileName, area)
    if (rule.enableStartStopActions === false) {
      condLog(`Ready to start actions`, funcName, fileName, area)
      rule.setStartActions(true)
      rule.setStatus(RULE_STATUS_TYPE.QUEUED_ACTIONS)
    } else {
      condLog(`Pending actions awaiting approval`, funcName, fileName, area)
      rule.setStartActions(false)
      rule.setStatus(RULE_STATUS_TYPE.AWAITING_APPROVAL)
    }
  } else {
    condLog(`No pending actions`, funcName, fileName, area)
    rule.setStatus(RULE_STATUS_TYPE.NO_WORK)
  }

  rule.evaluateRule = false

  exitLog(funcName, fileName, area)
  return
}

async function fillRuleActionQueues(rule: Rule): Promise<void> {
  const funcName = 'fillRuleActionQueues'
  entryLog(funcName, fileName, area)

  rule.fileCopyActionQueue = []
  rule.dirMakeActionQueue = []
  rule.fileDeleteActionQueue = []
  rule.dirDeleteActionQueue = []

  // For each existing origin full path, add any actions for:
  // - Copying / Mkdir into all of the target paths
  // - Deleting files / paths into all of the origin paths
  for (const originFullPath of rule.origin.fullPathList) {
    condLog(`Test if path ${originFullPath.path} exists`, funcName, fileName, area)
    if (originFullPath.exists) {
      condLog(`Recurse and add actions for copying origin path`, funcName, fileName, area)
      await recurseAddActions(rule, rule.origin, originFullPath.path)
    }
  }

  // Adds any files or directories to delete under the target path
  if (rule.type === RULE_TYPE.MIRROR && rule.mirrorOptions.enableDeletingInTarget) {
    condLog(`MIRROR type and deleting in target paths`, funcName, fileName, area)
    for (const targetFullPath of rule.target.fullPathList) {
      condLog(`Recsurse and add actions for deleteing in target path`, funcName, fileName, area)
      await recurseAddActions(rule, rule.target, targetFullPath.path)
    }
  }

  // Add any files and directories to delete in any other paths
  // - When there is no other work left to do
  if (
    rule.type === RULE_TYPE.COPYFILE &&
    rule.copyFileOptions.deleteUnderOtherPaths &&
    !rule.hasActions()
  ) {
    condLog(`COPY FILE type, deleting other paths, zero pending actions`, funcName, fileName, area)
    for (const otherPath of rule.copyFileOptions.otherPaths) {
      condLog(
        `For path ${otherPath.pathFromVolumeRoot} in volume ${otherPath.volumeName}`,
        funcName,
        fileName,
        area
      )
      for (const otherFullPath of otherPath.fullPathList) {
        condLog(`For full path ${otherFullPath.path}`, funcName, fileName, area)
        await recurseAddActions(rule, otherPath, otherFullPath.path)
      }
    }
  }

  exitLog(funcName, fileName, area)
  return
}

// Recursive function for looping through directories and adding actions to queues
async function recurseAddActions(
  rule: Rule,
  pathInVolume: PathInVolume, // PathInVolume object to recurse under
  initialPath: string, // Path at start of recursion
  currentPath: string = initialPath
): Promise<void> {
  const funcName = 'recurseAndActions'
  entryLog(funcName, fileName, area)

  const systemObjects: fs.Dirent[] = await fs.promises.readdir(currentPath, { withFileTypes: true })
  for (const systemObject of systemObjects) {
    condLog(`For system object`, funcName, fileName, area)

    const systemObjectPath = path.join(currentPath, systemObject.name)
    if (ignoreSystemObject(systemObject)) {
      condLog(`Skip system object ${systemObject.name}`, funcName, fileName, area)
      continue
    }

    if (systemObject.isDirectory()) {
      condLog(`System obkect is directory`, funcName, fileName, area)

      // Try to add actions for this directory
      if (pathInVolume.type === PATH_IN_VOLUME_TYPE.ORIGIN) {
        condLog(`Origin PathInVolume`, funcName, fileName, area)
        updateDirActionQueuesForOriginPath(rule, initialPath, systemObjectPath)
      } else if (pathInVolume.type === PATH_IN_VOLUME_TYPE.TARGET) {
        condLog(`Target PathInVolume`, funcName, fileName, area)
        updateDirActionQueuesForTargetPath(rule, initialPath, systemObjectPath)
      } else if (pathInVolume.type === PATH_IN_VOLUME_TYPE.OTHER_PATHS) {
        condLog(`Other Paths PathInVolume`, funcName, fileName, area)
        updateDirActionQueuesForOtherPaths(rule, pathInVolume, systemObjectPath)
      }

      // When copying from origin: Enter directories which are filtered in (To be copied from)
      // When deleting under target or other paths: Enter directories which are filtered out (Not deleted)
      if (
        (pathInVolume.includeDir(systemObjectPath) &&
          pathInVolume.type === PATH_IN_VOLUME_TYPE.ORIGIN) ||
        (!pathInVolume.includeDir(systemObjectPath) &&
          pathInVolume.type === (PATH_IN_VOLUME_TYPE.TARGET || PATH_IN_VOLUME_TYPE.OTHER_PATHS))
      ) {
        condLog(`Directory should be included`, funcName, fileName, area)
        await recurseAddActions(rule, pathInVolume, initialPath, systemObjectPath) // Recurse into subdirectory
      }
    } else if (systemObject.isFile()) {
      condLog(`System object is file`, funcName, fileName, area)

      if (ignoreFile(systemObjectPath)) {
        condLog(`Skip file ${systemObjectPath}`, funcName, fileName, area)
        continue
      }

      // Try to add actions for this file
      if (pathInVolume.type === PATH_IN_VOLUME_TYPE.ORIGIN) {
        condLog(`Origin PathInVolume`, funcName, fileName, area)
        await updateFileActionQueuesForOriginPath(rule, initialPath, systemObjectPath)
      } else if (pathInVolume.type === PATH_IN_VOLUME_TYPE.TARGET) {
        condLog(`Target PathInVolume`, funcName, fileName, area)
        updateFileActionQueuesForTargetPath(rule, initialPath, systemObjectPath)
      } else if (pathInVolume.type === PATH_IN_VOLUME_TYPE.OTHER_PATHS) {
        condLog(`Other Paths PathInVolume`, funcName, fileName, area)
        updateFileActionQueuesForOtherPaths(rule, pathInVolume, systemObjectPath)
      }
    }

    abortIfStateAwaitingChanges()
  }

  exitLog(funcName, fileName, area)
  return
}

// Add actions to the dir action queues when recursing under origin path
function updateDirActionQueuesForOriginPath(
  rule: Rule,
  initialPath: string,
  pathToDir: string
): void {
  const funcName: string = 'updateDirActionQueuesForOriginPath'
  entryLog(funcName, fileName, area)

  // Only need to add directories in mirroring - Copy files just ... copies files
  if (rule.type !== RULE_TYPE.MIRROR || !rule.origin.includeDir(pathToDir)) {
    condExitLog(`Not mirror rule or dir filtered out`, funcName, fileName, area)
    return
  }

  for (const targetFullPath of rule.target.fullPathList) {
    condLog(`For target path: ${targetFullPath}`, funcName, fileName, area)
    const targetDirPath: string = targetFullPath.path + pathToDir.slice(initialPath.length)
    if (!pathExists(targetDirPath)) {
      condLog(`Dir doesnt exist under target path`, funcName, fileName, area)
      rule.dirMakeActionQueue.push(targetDirPath)
      infoLog(
        `Add ${targetDirPath} to make dir action queue for Rule: ${rule.name}`,
        funcName,
        fileName,
        area
      )
    }
  }

  exitLog(funcName, fileName, area)
  return
}

// Add actions to the dir action queues when recursing under target path - mirror rules only
function updateDirActionQueuesForTargetPath(
  rule: Rule,
  initialPath: string,
  pathToDir: string
): void {
  const funcName = 'updateDirActionQueuesForTargetPath'
  entryLog(funcName, fileName, area)

  const originDirPath: string =
    rule.origin.fullPathList[0].path + pathToDir.slice(initialPath.length)
  // Delete path under target PathInVolume when:
  // - Dir is included in the target dir filters
  // - Dir doesnt exist under origin
  if (rule.target.includeDir(pathToDir) && !pathExists(originDirPath)) {
    condLog(`Dir filtered in and doesnt exist in origin`, funcName, fileName, area)
    rule.dirDeleteActionQueue.push(pathToDir)
    infoLog(
      `Add ${pathToDir} to delete dir action queue for Rule: ${rule.name}`,
      funcName,
      fileName,
      area
    )
  }

  exitLog(funcName, fileName, area)
  return
}

// Add actions to the file action queues when recursing under origin path
async function updateFileActionQueuesForOriginPath(
  rule: Rule,
  initialPath: string,
  pathToFile: string
): Promise<void> {
  const funcName = 'updateFileActionQueuesForOriginPath'
  entryLog(funcName, fileName, area)

  if (!rule.origin.includeFile(pathToFile)) {
    condExitLog(`File filtered out`, funcName, fileName, area)
    return
  }

  for (const targetFullPath of rule.target.fullPathList) {
    condLog(`For target path: ${targetFullPath}`, funcName, fileName, area)
    const pathUndertarget: string = await generateTargetFilePath(
      rule,
      initialPath,
      pathToFile,
      targetFullPath.path
    )
    if (!pathExists(pathUndertarget)) {
      condLog(`File doesn't exist under target - add to action queue`, funcName, fileName, area)
      rule.fileCopyActionQueue.push({ from: pathToFile, to: pathUndertarget })
    } else if (await deleteFileUnderOriginPath(rule, pathToFile, pathUndertarget)) {
      condLog(`File exists under orgin and should be deleted`, funcName, fileName, area)
      rule.fileDeleteActionQueue.push(pathToFile)
      infoLog(`Add ${pathToFile} to copy file action queue`, funcName, fileName, area)
    }
  }

  exitLog(funcName, fileName, area)
  return
}

function updateFileActionQueuesForTargetPath(
  rule: Rule,
  initialPath: string,
  pathToFile: string
): void {
  const funcName = 'updateFileActionQueuesForTargetPath'
  entryLog(funcName, fileName, area)

  // origin full path list must contain only 1 item as rule type must be mirror
  const originFilePath: string =
    rule.origin.fullPathList[0].path + pathToFile.slice(initialPath.length)

  // Set to delete if:
  // - File doesnt exist in origin path
  // - File is included in the target file filters
  if (rule.target.includeFile(pathToFile) && !pathExists(originFilePath)) {
    condLog(`File filtered in and doesnt exist in origin`, funcName, fileName, area)
    rule.fileDeleteActionQueue.push(pathToFile)
    infoLog(`Add ${pathToFile} to delete file action queue`, funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return
}

function updateDirActionQueuesForOtherPaths(
  rule: Rule,
  otherPath: PathInVolume,
  pathToDir: string
): void {
  const funcName = 'updateDirActionQueuesForOtherPaths'
  entryLog(funcName, fileName, area)

  if (otherPath.includeDir(pathToDir)) {
    condLog(`Add dir to delete actionsQueue`, funcName, fileName, area)
    rule.dirDeleteActionQueue.push(pathToDir)
    infoLog(`Add ${pathToDir} to delete dir action queue`, funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return
}

function updateFileActionQueuesForOtherPaths(
  rule: Rule,
  otherPath: PathInVolume,
  pathToFile: string
): void {
  const funcName = 'updateFileActionQueuesForOtherPaths'
  entryLog(funcName, fileName, area)

  if (otherPath.includeFile(pathToFile)) {
    condLog(`Add file to delete actionsQueue`, funcName, fileName, area)
    rule.fileDeleteActionQueue.push(pathToFile)
    infoLog(`Add ${pathToFile} to delete file action queue`, funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return
}
