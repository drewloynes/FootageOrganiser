import { ModifyRuleInfo, StoreRule } from '@shared/types/ruleTypes'
import { endReevaluationSleepEarly } from '@worker/runWorker'
import { CHANGE_TYPE } from '@worker/state-changes/change'
import { addAwaitingChange } from '@worker/state-changes/changeState'
import { toRule, toStoreRule } from '@worker/storage/rules/storeRule'
import {
  addRuleInCurrentRules,
  deleteRuleInCurrentRules,
  evaluateAllCurrentRules,
  modifyRuleInCurrentRules,
  startRuleInCurrentRules,
  stopRuleInCurrentRules
} from './currentRules'
import { Rule } from './rule'
import {
  addRuleInUpcomingRules,
  deleteRuleInUpcomingRules,
  evaluateAllUpcomingRules,
  modifyRuleInUpcomingRules,
  startRuleInUpcomingRules,
  stopRuleInUpcomingRules
} from './upcomingRules'

const fileName = 'changeRules.ts'
const area = 'rules'

export async function addRule(newStoreRule: StoreRule): Promise<void> {
  const funcName = 'addRule'
  entryLog(funcName, fileName, area)

  const newRule: Rule | undefined = await toRule(newStoreRule)
  if (!newRule) {
    debugExitLog(`Rule couldn't be created from StoreRule`, funcName, fileName, area)
    return
  }

  if (glob.workerGlobals.upcomingRules) {
    condLog(`Upcoming rules is being set`, funcName, fileName, area)
    addAwaitingChange(CHANGE_TYPE.ADD_RULE, newStoreRule)
    addRuleInUpcomingRules(newRule)
  } else {
    condLog(`Awaiting changes is empty`, funcName, fileName, area)
    if (await addRuleInCurrentRules(newRule)) {
      condLog(`Rule added to current rules`, funcName, fileName, area)
      endReevaluationSleepEarly()
    }
  }

  exitLog(funcName, fileName, area)
  return
}

export async function modifyRule(
  originalRuleName: string,
  modifiedStoreRule: StoreRule,
  error: string = ''
): Promise<void> {
  const funcName = 'modifyRule'
  entryLog(funcName, fileName, area)

  const modifiedRule: Rule | undefined = await toRule(modifiedStoreRule)
  if (!modifiedRule) {
    debugExitLog(`Rule couldn't be created from StoreRule`, funcName, fileName, area)
    return
  }

  modifiedRule.setError(error)

  if (
    glob.workerGlobals.upcomingRules ||
    (glob.workerGlobals.ruleInUse && glob.workerGlobals.ruleInUse.name === originalRuleName)
  ) {
    condLog(`Upcoming rules is being set or rule is in use`, funcName, fileName, area)
    const modifyRuleInfo: ModifyRuleInfo = {
      originalRuleName: originalRuleName,
      modifiedStoreRule: modifiedStoreRule,
      error: error
    }
    addAwaitingChange(CHANGE_TYPE.MODIFY_RULE, modifyRuleInfo)
    modifyRuleInUpcomingRules(originalRuleName, modifiedRule)
  } else {
    condLog(`Can change rule immediately`, funcName, fileName, area)
    if (await modifyRuleInCurrentRules(originalRuleName, modifiedRule)) {
      condLog(`Rule in current rules modified`, funcName, fileName, area)
      endReevaluationSleepEarly()
    }
  }

  exitLog(funcName, fileName, area)
  return
}

export async function deleteRule(ruleName: string): Promise<void> {
  const funcName = 'deleteRule'
  entryLog(funcName, fileName, area)

  if (
    glob.workerGlobals.upcomingRules ||
    (glob.workerGlobals.ruleInUse && glob.workerGlobals.ruleInUse.name === ruleName)
  ) {
    condLog(`Upcoming rules is being set or rule is in use`, funcName, fileName, area)
    addAwaitingChange(CHANGE_TYPE.DELETE_RULE, ruleName)
    deleteRuleInUpcomingRules(ruleName)
  } else {
    condLog(`Can delete rule immediately`, funcName, fileName, area)
    await deleteRuleInCurrentRules(ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function startRule(ruleName: string): void {
  const funcName = 'startRule'
  entryLog(funcName, fileName, area)

  startRuleInCurrentRules(ruleName)

  if (glob.workerGlobals.upcomingRules) {
    condLog(`Upcoming rules is being set - update it`, funcName, fileName, area)
    startRuleInUpcomingRules(ruleName)
  }

  endReevaluationSleepEarly()

  exitLog(funcName, fileName, area)
  return
}

export function stopRule(ruleName: string): void {
  const funcName = 'stopRule'
  entryLog(funcName, fileName, area)

  if (
    glob.workerGlobals.upcomingRules ||
    (glob.workerGlobals.ruleInUse && glob.workerGlobals.ruleInUse.name === ruleName)
  ) {
    condLog(`Upcoming rules is being set or rule is in use`, funcName, fileName, area)
    addAwaitingChange(CHANGE_TYPE.STOP_RULE, ruleName)
    stopRuleInUpcomingRules(ruleName)
  } else {
    condLog(`Can stop rule ${ruleName} immediately`, funcName, fileName, area)
    stopRuleInCurrentRules(ruleName)
  }

  endReevaluationSleepEarly()

  exitLog(funcName, fileName, area)
  return
}

export function stopAllRules(): void {
  const funcName = 'stopAllRules'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.currentRules) {
    condExitLog(`Current rules doesn't exist`, funcName, fileName, area)
    return
  }

  for (const rule of glob.workerGlobals.currentRules.ruleList) {
    condLog(`For rule: ${rule.name}`, funcName, fileName, area)
    stopRule(rule.name)
  }

  exitLog(funcName, fileName, area)
  return
}

export async function activateRule(ruleName: string): Promise<void> {
  const funcName = 'activateRule'
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
    await modifyRule(rule.name, newStoreRule)
  }

  exitLog(funcName, fileName, area)
  return
}

export async function disableRule(ruleName: string, error: string = ''): Promise<void> {
  const funcName = 'disableRule'
  entryLog(funcName, fileName, area)

  const rule = glob.workerGlobals.currentRules?.findRule(ruleName)
  if (!rule) {
    condExitLog(`Rule doesn't exist`, funcName, fileName, area)
    return
  }

  if (!rule.disabled) {
    condLog(`Rule ${rule.name} is currently active`, funcName, fileName, area)
    const newRule = rule.clone()
    newRule.setDisabled(true)
    const newStoreRule = toStoreRule(newRule)
    await modifyRule(rule.name, newStoreRule, error)
  }

  exitLog(funcName, fileName, area)
  return
}

export async function disableAllRules(): Promise<void> {
  const funcName = 'disableAllRules'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.currentRules) {
    condExitLog(`Current rules doesn't exist`, funcName, fileName, area)
    return
  }

  for (const rule of glob.workerGlobals.currentRules.ruleList) {
    condLog(`For rule: ${rule.name}`, funcName, fileName, area)
    await disableRule(rule.name)
  }

  exitLog(funcName, fileName, area)
  return
}

export function evaluateAllRules(): void {
  const funcName = 'evaluateAllRules'
  entryLog(funcName, fileName, area)

  if (glob.workerGlobals.upcomingRules || glob.workerGlobals.ruleInUse) {
    condLog(`Add to evaluate all rules to upcoming rules`, funcName, fileName, area)

    addAwaitingChange(CHANGE_TYPE.EVALUTE_ALL_RULES, {})
    evaluateAllUpcomingRules()
  } else {
    condLog(`Set to evaluate all current rules immediately`, funcName, fileName, area)
    evaluateAllCurrentRules()
    endReevaluationSleepEarly()
  }

  exitLog(funcName, fileName, area)
  return
}
