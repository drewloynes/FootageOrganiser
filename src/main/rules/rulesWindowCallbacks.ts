import { FullRule, ModifyRuleInfo, ShortRule, StoreRule } from '@shared-all/types/ruleTypes'
import { STORE_RULE_ZOD_SCHEMA } from '@shared-all/validation/validateRule'
import { validateRuleName } from '@shared-node/validation/validateRule'
import { sendAsyncIpcMessageWorker, sendSyncIpcMessageWorker } from '../ipc/worker/workerIpcSender'

const fileName = 'ruleWindowCallback.ts'
const area = 'rules'

export function addRule(newRule: StoreRule): void {
  const funcName = 'addRule'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  if (STORE_RULE_ZOD_SCHEMA.safeParse(newRule).success) {
    condLog('Rule is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('add-rule', newRule)
  }

  exitLog(funcName, fileName, area)
  return
}

export function modifyRule(oldRuleName: string, newRule: StoreRule): void {
  const funcName = 'modifyRule'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  if (validateRuleName(oldRuleName) && STORE_RULE_ZOD_SCHEMA.safeParse(newRule).success) {
    condLog('Rule and rule name are valid', funcName, fileName, area)
    const modifyRuleInfo: ModifyRuleInfo = {
      originalRuleName: oldRuleName,
      modifiedStoreRule: newRule,
      error: ''
    }
    sendAsyncIpcMessageWorker('modify-rule', modifyRuleInfo)
  }

  exitLog(funcName, fileName, area)
  return
}

export function deleteRule(ruleName: string): void {
  const funcName = 'deleteRule'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('delete-rule', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function startRule(ruleName: string): void {
  const funcName = 'startRule'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('start-rule', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopRule(ruleName: string): void {
  const funcName = 'stopRule'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('stop-rule', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopAllRules(): void {
  const funcName = 'stopAllRules'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  sendAsyncIpcMessageWorker('stop-all-rules', {})

  exitLog(funcName, fileName, area)
  return
}

export function activateRule(ruleName: string): void {
  const funcName = 'activateRule'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('activate-rule', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function disableRule(ruleName: string): void {
  const funcName = 'disableRule'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('disable-rule', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function disableAllRules(): void {
  const funcName = 'disableAllRules'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  sendAsyncIpcMessageWorker('disable-all-rules', {})

  exitLog(funcName, fileName, area)
  return
}

export function evaluateAllRules(): void {
  const funcName = 'evaluateAllRules'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  sendAsyncIpcMessageWorker('evaluate-all-rules', {})

  exitLog(funcName, fileName, area)
  return
}

export function startRuleStream(ruleName: string): void {
  const funcName = 'startRuleStream'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('start-rule-stream', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopRuleStream(ruleName: string): void {
  const funcName = 'startRuleStream'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('stop-rule-stream', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopEveryRuleStream(): void {
  const funcName = 'stopEveryRuleStream'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  sendAsyncIpcMessageWorker('stop-every-rule-stream', {})

  exitLog(funcName, fileName, area)
  return
}

export function startAllRulesStream(): void {
  const funcName = 'startAllRulesStream'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  sendAsyncIpcMessageWorker('start-all-rules-stream', {})

  exitLog(funcName, fileName, area)
  return
}

export function stopAllRulesStream(): void {
  const funcName = 'stopAllRulesStream'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  sendAsyncIpcMessageWorker('stop-all-rules-stream', {})

  exitLog(funcName, fileName, area)
  return
}

export async function getRule(ruleName: string): Promise<FullRule | undefined> {
  const funcName = 'getRule'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return undefined
  }

  let rule: FullRule | undefined = undefined
  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    rule = (await sendSyncIpcMessageWorker('get-rule', ruleName)) as FullRule | undefined
  }

  exitLog(funcName, fileName, area)
  return rule
}

export async function getAllRules(): Promise<ShortRule[]> {
  const funcName = 'getAllRules'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return []
  }

  const allRules: ShortRule[] = (await sendSyncIpcMessageWorker('get-all-rules', {})) as ShortRule[]

  exitLog(funcName, fileName, area)
  return allRules
}
