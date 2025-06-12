import { StoreRules } from '@shared-all/types/rulesTypes'
import {
  DisableRuleInfo,
  FullRule,
  ModifyRuleInfo,
  ShortRule,
  StoreRule
} from '@shared-all/types/ruleTypes'
import { STORE_RULES_ZOD_SCHEMA } from '@shared-all/validation/validateRules'
import { pathExists } from '@shared-node/utils/filePaths'
import { sendAsyncIpcMessageMain } from '@worker/communication/ipc/main/mainIpcSender'
import { endReevaluationSleepEarly } from '@worker/runWorker'
import { CHANGE_TYPE } from '@worker/state-changes/change'
import { addAwaitingChange } from '@worker/state-changes/changeState'
import { toRule, toStoreRule } from '@worker/storage/rules/storeRule'
import { toRules, toStoreRules } from '@worker/storage/rules/storeRules'
import { loadData, saveData } from '@worker/storage/storeData'
import { join } from 'path'
import { Rule } from './rule'
import { Rules } from './rules'

const fileName: string = 'currentRules.ts'
const area: string = 'rules'

export function getRulesStorageLocation(): string {
  const funcName: string = 'getRulesStorageLocation'
  entryLog(funcName, fileName, area)

  let rulesStorageLocation: string = ''
  if (glob.workerGlobals.storageLocation !== undefined) {
    condLog('Storage location set', funcName, fileName, area)
    rulesStorageLocation = join(glob.workerGlobals.storageLocation, 'rules.json')
  } else {
    errorLog('Storage location not set', funcName, fileName, area)
    throw 'Storage location not set when it should be'
  }

  exitLog(funcName, fileName, area)
  return rulesStorageLocation
}

export async function setCurrentRules(): Promise<void> {
  const funcName = 'setCurrentRules'
  entryLog(funcName, fileName, area)

  if (!(await loadIntoCurrentRules())) {
    condLog(`Initialise rules`, funcName, fileName, area)
    await initialiseCurrentRules()
  }

  exitLog(funcName, fileName, area)
  return
}

async function loadIntoCurrentRules(): Promise<boolean> {
  const funcName = 'loadIntoCurrentRules'
  entryLog(funcName, fileName, area)

  const rulesStorageLocation: string = getRulesStorageLocation()
  if (!pathExists(rulesStorageLocation)) {
    condExitLog(`Rules file doesn't exist`, funcName, fileName, area)
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storeRulesData: any = await loadData(rulesStorageLocation)
  if (!STORE_RULES_ZOD_SCHEMA.safeParse(storeRulesData).success) {
    condExitLog('Loaded rules data not valid', funcName, fileName, area)
    return false
  }

  glob.workerGlobals.currentRules = await toRules(storeRulesData as StoreRules)

  exitLog(funcName, fileName, area)
  return glob.workerGlobals.currentRules !== undefined
}

async function initialiseCurrentRules(): Promise<void> {
  const funcName = 'initialiseCurrentRules'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.currentRules = new Rules()
  await saveCurrentRules()

  exitLog(funcName, fileName, area)
  return
}

export async function saveCurrentRules(): Promise<void> {
  const funcName = 'saveCurrentRules'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.currentRules) {
    errorExitLog('Current rules is undefiend', funcName, fileName, area)
    return
  }

  await saveData(getRulesStorageLocation(), toStoreRules(glob.workerGlobals.currentRules))

  exitLog(funcName, fileName, area)
  return
}

function getCurrentRules(): Rules | undefined {
  const funcName = 'getCurrentRules'
  entryLog(funcName, fileName, area)

  let rules: Rules | undefined = glob.workerGlobals.currentRules

  exitLog(funcName, fileName, area)
  return rules
}

export function getAllRulesToSendCurrentRules(): ShortRule[] {
  const funcName = 'getAllRulesToSendCurrentRules'
  entryLog(funcName, fileName, area)

  const currentRules: Rules | undefined = getCurrentRules()
  if (!currentRules) {
    condExitLog(`Current rules not defined`, funcName, fileName, area)
    return []
  }

  const rulesToSend: Array<ShortRule> = []
  currentRules.ruleList.forEach((rule) => rulesToSend.push(rule.convertToShortRule()))

  exitLog(funcName, fileName, area)
  return rulesToSend
}

export function getRuleToSendCurrentRules(ruleName: string): FullRule | undefined {
  const funcName = 'getRuleToSendCurrentRules'
  entryLog(funcName, fileName, area)

  const currentRules: Rules | undefined = getCurrentRules()
  if (!currentRules) {
    condExitLog(`Current rules not defined`, funcName, fileName, area)
    return undefined
  }

  const ruleToSend: FullRule | undefined = currentRules.findRule(ruleName)?.convertToFullRule()

  exitLog(funcName, fileName, area)
  return ruleToSend
}

export function sendRulesStreamToMainCurrentRules(_ignore: undefined) {
  const funcName = 'sendRulesStreamToMainCurrentRules'
  entryLog(funcName, fileName, area)

  const rulesToSend: ShortRule[] = getAllRulesToSendCurrentRules()
  sendAsyncIpcMessageMain('stream-current-rules', rulesToSend)

  exitLog(funcName, fileName, area)
  return
}

export function sendRuleStreamToMainCurrentRules(rule: Rule) {
  const funcName = 'sendRuleStreamToMainCurrentRules'
  entryLog(funcName, fileName, area)

  const ruleToSend: FullRule | undefined = getRuleToSendCurrentRules(rule.name)
  if (ruleToSend) {
    condLog(`Rule defined`, funcName, fileName, area)
    sendAsyncIpcMessageMain('stream-rule', ruleToSend)
  }

  exitLog(funcName, fileName, area)
  return
}

export function streamUpdateCurrentRules(): void {
  const funcName = 'streamUpdateCurrentRules'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)

  exitLog(funcName, fileName, area)
  return
}

export function setSilentEvaluateCurrentRules(): void {
  const funcName = 'setSilentEvaluateCurrentRules'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.currentRules) {
    errorExitLog('Current rules is undefiend', funcName, fileName, area)
    return
  }

  for (const rule of glob.workerGlobals.currentRules.ruleList) {
    condLog(`For rule: ${rule.name}`, funcName, fileName, area)
    rule.setSilentEvaluate()
  }

  exitLog(funcName, fileName, area)
  return
}

export async function addRuleCurrentRules(newStoreRule: StoreRule): Promise<boolean> {
  const funcName = 'addRuleCurrentRules'
  entryLog(funcName, fileName, area)

  let ruleAdded: boolean = false

  const newRule: Rule | undefined = await toRule(newStoreRule)
  if (!newRule) {
    debugExitLog(`Rule couldn't be created from StoreRule`, funcName, fileName, area)
    return ruleAdded
  }

  if (glob.workerGlobals.currentRules?.addRule(newRule)) {
    infoLog(`Rule: ${newRule.name} added to current rules`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
    await saveCurrentRules()
    endReevaluationSleepEarly()
    ruleAdded = true
  }

  exitLog(funcName, fileName, area)
  return ruleAdded
}

export async function modifyRuleCurrentRules(
  originalRuleName: string,
  modifiedStoreRule: StoreRule,
  error: string = ''
): Promise<boolean> {
  const funcName = 'modifyRuleCurrentRules'
  entryLog(funcName, fileName, area)

  let ruleModified: boolean = false

  const modifiedRule: Rule | undefined = await toRule(modifiedStoreRule)
  if (!modifiedRule) {
    debugExitLog(`Rule couldn't be created from StoreRule`, funcName, fileName, area)
    return ruleModified
  }

  // Error may persist through modification.
  modifiedRule.setError(error)

  if (glob.workerGlobals.ruleInUse && glob.workerGlobals.ruleInUse.name === originalRuleName) {
    condLog(`Rule currently in use - schedule change`, funcName, fileName, area)
    const modifyRuleInfo: ModifyRuleInfo = {
      originalRuleName: originalRuleName,
      modifiedStoreRule: modifiedStoreRule,
      error: error
    }
    addAwaitingChange(CHANGE_TYPE.MODIFY_RULE, modifyRuleInfo)
    setRuleAwaitingChangesCurrentRules(true, originalRuleName)
  } else {
    condLog(`Can change rule immediately`, funcName, fileName, area)

    if (glob.workerGlobals.currentRules?.modifyRule(originalRuleName, modifiedRule)) {
      infoLog(`Rule: ${originalRuleName} has been modified`, funcName, fileName, area)
      glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
      await saveCurrentRules()
      endReevaluationSleepEarly()
      ruleModified = true
    }
  }

  exitLog(funcName, fileName, area)
  return ruleModified
}

export async function deleteRuleCurrentRules(deleteRuleName: string): Promise<boolean> {
  const funcName = 'deleteRuleCurrentRules'
  entryLog(funcName, fileName, area)

  let ruleDeleted: boolean = false

  if (glob.workerGlobals.ruleInUse && glob.workerGlobals.ruleInUse.name === deleteRuleName) {
    condLog(`Rule currently in use - schedule change`, funcName, fileName, area)
    addAwaitingChange(CHANGE_TYPE.DELETE_RULE, deleteRuleName)
    setRuleAwaitingChangesCurrentRules(true, deleteRuleName)
  } else {
    condLog(`Can delete rule immediately`, funcName, fileName, area)

    if (glob.workerGlobals.currentRules?.deleteRule(deleteRuleName)) {
      infoLog(`Rule: ${deleteRuleName} has been deleted`, funcName, fileName, area)
      glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
      await saveCurrentRules()
      ruleDeleted = true
    }
  }

  exitLog(funcName, fileName, area)
  return ruleDeleted
}

export function stopRuleCurrentRules(ruleName: string): boolean {
  const funcName = 'stopRuleCurrentRules'
  entryLog(funcName, fileName, area)

  let ruleStopped: boolean = false

  if (glob.workerGlobals.ruleInUse && glob.workerGlobals.ruleInUse.name === ruleName) {
    condLog(`Rule currently in use - schedule change`, funcName, fileName, area)
    addAwaitingChange(CHANGE_TYPE.STOP_RULE, ruleName)
    setRuleAwaitingChangesCurrentRules(true, ruleName)
  } else {
    condLog(`Can stop rule ${ruleName} immediately`, funcName, fileName, area)

    if (glob.workerGlobals.currentRules?.stopRule(ruleName)) {
      infoLog(`Rule: ${ruleName} has been stopped`, funcName, fileName, area)
      glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
      ruleStopped = true
    }
  }

  endReevaluationSleepEarly()

  exitLog(funcName, fileName, area)
  return ruleStopped
}

export function stopAllRulesCurrentRules(): void {
  const funcName = 'stopAllRulesCurrentRules'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.currentRules) {
    condExitLog(`Current rules doesn't exist`, funcName, fileName, area)
    return
  }

  for (const rule of glob.workerGlobals.currentRules.ruleList) {
    condLog(`For rule: ${rule.name}`, funcName, fileName, area)
    stopRuleCurrentRules(rule.name)
  }

  exitLog(funcName, fileName, area)
  return
}

export function startRuleCurrentRules(ruleName: string): boolean {
  const funcName = 'startRuleCurrentRules'
  entryLog(funcName, fileName, area)

  let ruleStarted: boolean = false
  if (glob.workerGlobals.currentRules?.startRule(ruleName)) {
    infoLog(`Rule: ${ruleName} has been started`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
    endReevaluationSleepEarly()
    ruleStarted = true
  }

  exitLog(funcName, fileName, area)
  return ruleStarted
}

export async function activateRuleCurrentRules(ruleName: string): Promise<void> {
  const funcName = 'activateRuleCurrentRules'
  entryLog(funcName, fileName, area)

  const rule = glob.workerGlobals.currentRules?.findRule(ruleName)
  if (!rule) {
    condExitLog(`Rule doesn't exist`, funcName, fileName, area)
    return
  }

  if (rule.disabled) {
    condLog(`Rule ${rule.name} is currently disabled`, funcName, fileName, area)
    const newRule = rule.clone()
    newRule.setDisabled(false)
    const newStoreRule = toStoreRule(newRule)
    await modifyRuleCurrentRules(rule.name, newStoreRule)
  }

  exitLog(funcName, fileName, area)
  return
}

export async function disableRuleCurrentRules(ruleName: string, error: string = ''): Promise<void> {
  const funcName = 'disableRuleCurrentRules'
  entryLog(funcName, fileName, area)

  const rule = glob.workerGlobals.currentRules?.findRule(ruleName)
  if (!rule) {
    condExitLog(`Rule doesn't exist`, funcName, fileName, area)
    return
  }

  if (!rule.disabled) {
    condLog(`Rule ${rule.name} is currently active`, funcName, fileName, area)

    if (glob.workerGlobals.ruleInUse && glob.workerGlobals.ruleInUse.name === ruleName) {
      condLog(`Rule currently in use - schedule change`, funcName, fileName, area)
      const disableRuleInfo: DisableRuleInfo = {
        ruleName: ruleName,
        error: error
      }
      addAwaitingChange(CHANGE_TYPE.DISABLE_RULE, disableRuleInfo)
      setRuleAwaitingChangesCurrentRules(true, ruleName)
    } else {
      condLog(`Can disable rule ${ruleName} immediately`, funcName, fileName, area)

      const newRule = rule.clone()
      newRule.setDisabled(true)
      const newStoreRule = toStoreRule(newRule)
      await modifyRuleCurrentRules(rule.name, newStoreRule, error) // Maintain the error state
    }
  }

  exitLog(funcName, fileName, area)
  return
}

export async function disableAllRulesCurrentRules(): Promise<void> {
  const funcName = 'disableAllRulesCurrentRules'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.currentRules) {
    condExitLog(`Current rules doesn't exist`, funcName, fileName, area)
    return
  }

  for (const rule of glob.workerGlobals.currentRules.ruleList) {
    condLog(`For rule: ${rule.name}`, funcName, fileName, area)
    await disableRuleCurrentRules(rule.name)
  }

  exitLog(funcName, fileName, area)
  return
}

export function startAllRulesStreamCurrentRules(): void {
  const funcName = 'startAllRulesStreamCurrentRules'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.streamAllRulesToMain.start(glob.workerGlobals.currentSettings)

  exitLog(funcName, fileName, area)
  return
}

export function stopAllRulesStreamCurrentRules(): void {
  const funcName = 'stopAllRulesStreamCurrentRules'
  entryLog(funcName, fileName, area)

  glob.workerGlobals.streamAllRulesToMain.stop()

  exitLog(funcName, fileName, area)
  return
}

export function startRuleStreamCurrentRules(ruleName: string): void {
  const funcName = 'startRuleStreamCurrentRules'
  entryLog(funcName, fileName, area)

  const rule = glob.workerGlobals.currentRules?.findRule(ruleName)
  if (rule) {
    condLog(`Rule found`, funcName, fileName, area)
    rule.streamToMain.start(rule)
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopRuleStreamCurrentRules(ruleName: string): void {
  const funcName = 'stopRuleStreamCurrentRules'
  entryLog(funcName, fileName, area)

  const rule = glob.workerGlobals.currentRules?.findRule(ruleName)
  if (rule) {
    condLog(`Rule found`, funcName, fileName, area)
    rule.streamToMain.stop()
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopEveryRuleStreamCurrentRules(): void {
  const funcName = 'stopEveryRuleStreamCurrentRules'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.currentRules) {
    condExitLog(`Current rules doesn't exist`, funcName, fileName, area)
    return
  }

  for (const rule of glob.workerGlobals.currentRules.ruleList) {
    condLog(`For rule: ${rule.name}`, funcName, fileName, area)
    stopRuleStreamCurrentRules(rule.name)
  }

  exitLog(funcName, fileName, area)
  return
}

export function evaluateRuleCurrentRules(ruleName: string): void {
  const funcName = 'evaluateRuleCurrentRules'
  entryLog(funcName, fileName, area)

  if (glob.workerGlobals.ruleInUse && glob.workerGlobals.ruleInUse.name === ruleName) {
    condLog(`Rule currently in use - schedule change`, funcName, fileName, area)
    addAwaitingChange(CHANGE_TYPE.EVALUATE_RULE, ruleName)
    setRuleAwaitingChangesCurrentRules(true, ruleName)
  } else {
    condLog(`Set to evaluate all current rules immediately`, funcName, fileName, area)

    const rule = glob.workerGlobals.currentRules?.findRule(ruleName)
    if (rule) {
      condLog(`Rule found in current rules`, funcName, fileName, area)
      rule.setEvaluate()
      glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
      endReevaluationSleepEarly()
    }
  }

  exitLog(funcName, fileName, area)
  return
}

export function evaluateAllRulesCurrentRules(): void {
  const funcName = 'evaluateAllRulesCurrentRules'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.currentRules) {
    condExitLog(`Current rules doesn't exist`, funcName, fileName, area)
    return
  }

  for (const rule of glob.workerGlobals.currentRules.ruleList) {
    condLog(`For rule: ${rule.name}`, funcName, fileName, area)
    evaluateRuleCurrentRules(rule.name)
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
  }

  exitLog(funcName, fileName, area)
  return
}

export function setRuleAwaitingChangesCurrentRules(
  awaitingChanges: boolean,
  ruleName: string
): void {
  const funcName = 'setRuleAwaitingChangesCurrentRules'
  entryLog(funcName, fileName, area)

  if (glob.workerGlobals.currentRules?.setAwaitingChanges(awaitingChanges, ruleName)) {
    condLog(`Awaiting changes set for ${ruleName}`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
  }

  exitLog(funcName, fileName, area)
  return
}
