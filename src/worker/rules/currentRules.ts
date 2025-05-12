import { StoreRules } from '@shared-all/types/rulesTypes'
import { FullRule, ShortRule } from '@shared-all/types/ruleTypes'
import { STORE_RULES_ZOD_SCHEMA } from '@shared-all/validation/validateRules'
import { pathExists } from '@shared-node/utils/filePaths'
import { sendAsyncIpcMessageMain } from '@worker/communication/ipc/main/mainIpcSender'
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

  let rules: Rules | undefined = undefined
  // Use upcoming rules if availavle
  if (glob.workerGlobals.upcomingRules) {
    condLog(`Upcoming rules is set`, funcName, fileName, area)
    rules = glob.workerGlobals.upcomingRules
  } else if (glob.workerGlobals.currentRules) {
    condLog(`Current rules is set`, funcName, fileName, area)
    rules = glob.workerGlobals.currentRules
  }

  exitLog(funcName, fileName, area)
  return rules
}

export function getAllCurrentRulesToSend(): ShortRule[] {
  const funcName = 'getAllCurrentRulesToSend'
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

export function getRuleToSend(ruleName: string): FullRule | undefined {
  const funcName = 'getRuleToSend'
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

export function sendCurrentRulesStreamToMain(_ignore: undefined) {
  const funcName = 'sendCurrentRulesStreamToMain'
  entryLog(funcName, fileName, area)

  const rulesToSend: ShortRule[] = getAllCurrentRulesToSend()
  sendAsyncIpcMessageMain('stream-current-rules', rulesToSend)

  exitLog(funcName, fileName, area)
  return
}

export function sendRuleStreamToMain(rule: Rule) {
  const funcName = 'sendRuleStreamToMain'
  entryLog(funcName, fileName, area)

  const ruleToSend: FullRule | undefined = getRuleToSend(rule.name)
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

  if (glob.workerGlobals.upcomingRules) {
    condLog(`Upcoming rules is set`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.upcomingRules)
  } else {
    condLog(`Upcoming rules is not set`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
  }

  exitLog(funcName, fileName, area)
  return
}

export function findRuleInCurrentRules(ruleName: string): Rule | undefined {
  const funcName = 'findRuleInCurrentRules'
  entryLog(funcName, fileName, area)

  const foundRule: Rule | undefined = glob.workerGlobals.currentRules?.findRule(ruleName)

  exitLog(funcName, fileName, area)
  return foundRule
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

export async function addRuleInCurrentRules(newRule: Rule): Promise<boolean> {
  const funcName = 'addRuleInCurrentRules'
  entryLog(funcName, fileName, area)

  let ruleAdded: boolean = false
  if (glob.workerGlobals.currentRules?.addRule(newRule)) {
    infoLog(`Rule: ${newRule.name} added to current rules`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
    await saveCurrentRules()
    ruleAdded = true
  }

  exitLog(funcName, fileName, area)
  return ruleAdded
}

export async function modifyRuleInCurrentRules(
  originalRuleName: string,
  modifiedRule: Rule
): Promise<boolean> {
  const funcName = 'modifyRuleInCurrentRules'
  entryLog(funcName, fileName, area)

  let ruleModified: boolean = false
  if (glob.workerGlobals.currentRules?.modifyRule(originalRuleName, modifiedRule)) {
    infoLog(`Rule: ${originalRuleName} has been modified`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
    await saveCurrentRules()
    ruleModified = true
  }

  exitLog(funcName, fileName, area)
  return ruleModified
}

export async function deleteRuleInCurrentRules(deleteRuleName: string): Promise<boolean> {
  const funcName = 'deleteRuleInCurrentRules'
  entryLog(funcName, fileName, area)

  let ruleDeleted: boolean = false
  if (glob.workerGlobals.currentRules?.deleteRule(deleteRuleName)) {
    infoLog(`Rule: ${deleteRuleName} has been deleted`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
    await saveCurrentRules()
    ruleDeleted = true
  }

  exitLog(funcName, fileName, area)
  return ruleDeleted
}

export async function stopRuleInCurrentRules(ruleName: string): Promise<boolean> {
  const funcName = 'stopRuleInCurrentRules'
  entryLog(funcName, fileName, area)

  let ruleStopped: boolean = false
  if (glob.workerGlobals.currentRules?.stopRule(ruleName)) {
    infoLog(`Rule: ${ruleName} has been stopped`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
    ruleStopped = true
  }

  exitLog(funcName, fileName, area)
  return ruleStopped
}

export async function startRuleInCurrentRules(ruleName: string): Promise<boolean> {
  const funcName = 'startRuleInCurrentRules'
  entryLog(funcName, fileName, area)

  let ruleStarted: boolean = false
  if (glob.workerGlobals.currentRules?.startRule(ruleName)) {
    infoLog(`Rule: ${ruleName} has been started`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
    ruleStarted = true
  }

  exitLog(funcName, fileName, area)
  return ruleStarted
}

export function startAllRulesStream(): void {
  const funcName = 'startAllRulesStream'
  entryLog(funcName, fileName, area)

  if (glob.workerGlobals.upcomingRules) {
    condLog(`Upcoming rules exist`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.start(glob.workerGlobals.upcomingRules)
  } else {
    condLog(`Upcoming rules do not exist`, funcName, fileName, area)
    glob.workerGlobals.streamAllRulesToMain.start(glob.workerGlobals.currentSettings)
  }

  exitLog(funcName, fileName, area)
  return
}

export function startRuleStream(ruleName: string): void {
  const funcName = 'startRuleStream'
  entryLog(funcName, fileName, area)

  if (glob.workerGlobals.upcomingRules) {
    condLog(`Upcoming rules exist`, funcName, fileName, area)
    const rule = glob.workerGlobals.upcomingRules.findRule(ruleName)
    if (rule) {
      condLog(`Rule found`, funcName, fileName, area)
      rule.streamToMain.start(rule)
    }
  } else {
    condLog(`Upcoming rules do not exist`, funcName, fileName, area)
    const rule = glob.workerGlobals.currentRules?.findRule(ruleName)
    if (rule) {
      condLog(`Rule found`, funcName, fileName, area)
      rule.streamToMain.start(rule)
    }
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopRuleStream(ruleName: string): void {
  const funcName = 'stopRuleStream'
  entryLog(funcName, fileName, area)

  if (glob.workerGlobals.upcomingRules) {
    condLog(`Upcoming rules exist`, funcName, fileName, area)
    const rule = glob.workerGlobals.upcomingRules.findRule(ruleName)
    if (rule) {
      condLog(`Rule found`, funcName, fileName, area)
      rule.streamToMain.stop()
    }
  } else {
    condLog(`Upcoming rules do not exist`, funcName, fileName, area)
    const rule = glob.workerGlobals.currentRules?.findRule(ruleName)
    if (rule) {
      condLog(`Rule found`, funcName, fileName, area)
      rule.streamToMain.stop()
    }
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopEveryRuleStream(): void {
  const funcName = 'stopEveryRuleStream'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.currentRules) {
    condExitLog(`Current rules doesn't exist`, funcName, fileName, area)
    return
  }

  for (const rule of glob.workerGlobals.currentRules.ruleList) {
    condLog(`For rule: ${rule.name}`, funcName, fileName, area)
    stopRuleStream(rule.name)
  }

  exitLog(funcName, fileName, area)
  return
}

export async function evaluateAllCurrentRules(): Promise<void> {
  const funcName = 'evaluateAllCurrentRules'
  entryLog(funcName, fileName, area)

  if (glob.workerGlobals.currentRules) {
    condLog(`Set all current rules to reevaluate`, funcName, fileName, area)
    glob.workerGlobals.currentRules.evaluateAllRules()
    glob.workerGlobals.streamAllRulesToMain.updateData(glob.workerGlobals.currentRules)
  }

  exitLog(funcName, fileName, area)
  return
}
