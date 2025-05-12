import { FullRule, ModifyRuleInfo, ShortRule, StoreRule } from '@shared-all/types/ruleTypes'
import { STORE_RULE_ZOD_SCHEMA } from '@shared-all/validation/validateRule'
import { validateRuleName } from '@shared-node/validation/validateRule'
import { sendAsyncIpcMessageWorker, sendSyncIpcMessageWorker } from '../ipc/worker/workerIpcSender'

const fileName: string = 'ruleWindowCallback.ts'
const area: string = 'rules'

export function addRule(newRule: StoreRule): void {
  const funcName: string = 'addRule'
  entryLog(funcName, fileName, area)

  if (STORE_RULE_ZOD_SCHEMA.safeParse(newRule).success) {
    condLog('Rule is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('add-rule', newRule)
  }

  exitLog(funcName, fileName, area)
  return
}

export function modifyRule(oldRuleName: string, newRule: StoreRule): void {
  const funcName: string = 'modifyRule'
  entryLog(funcName, fileName, area)

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
  const funcName: string = 'deleteRule'
  entryLog(funcName, fileName, area)

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('delete-rule', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function startRule(ruleName: string): void {
  const funcName: string = 'startRule'
  entryLog(funcName, fileName, area)

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('start-rule', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopRule(ruleName: string): void {
  const funcName: string = 'stopRule'
  entryLog(funcName, fileName, area)

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('stop-rule', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopAllRules(): void {
  const funcName: string = 'stopAllRules'
  entryLog(funcName, fileName, area)

  sendAsyncIpcMessageWorker('stop-all-rules', {})

  exitLog(funcName, fileName, area)
  return
}

export function activateRule(ruleName: string): void {
  const funcName: string = 'activateRule'
  entryLog(funcName, fileName, area)

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('activate-rule', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function disableRule(ruleName: string): void {
  const funcName: string = 'disableRule'
  entryLog(funcName, fileName, area)

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('disable-rule', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function disableAllRules(): void {
  const funcName: string = 'disableAllRules'
  entryLog(funcName, fileName, area)

  sendAsyncIpcMessageWorker('disable-all-rules', {})

  exitLog(funcName, fileName, area)
  return
}

export function evaluateAllRules(): void {
  const funcName: string = 'evaluateAllRules'
  entryLog(funcName, fileName, area)

  sendAsyncIpcMessageWorker('evaluate-all-rules', {})

  exitLog(funcName, fileName, area)
  return
}

export function startRuleStream(ruleName: string): void {
  const funcName: string = 'startRuleStream'
  entryLog(funcName, fileName, area)

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('start-rule-stream', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopRuleStream(ruleName: string): void {
  const funcName: string = 'startRuleStream'
  entryLog(funcName, fileName, area)

  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    sendAsyncIpcMessageWorker('stop-rule-stream', ruleName)
  }

  exitLog(funcName, fileName, area)
  return
}

export function stopEveryRuleStream(): void {
  const funcName: string = 'stopEveryRuleStream'
  entryLog(funcName, fileName, area)

  sendAsyncIpcMessageWorker('stop-every-rule-stream', {})

  exitLog(funcName, fileName, area)
  return
}

export function startAllRulesStream(): void {
  const funcName: string = 'startAllRulesStream'
  entryLog(funcName, fileName, area)

  sendAsyncIpcMessageWorker('start-all-rules-stream', {})

  exitLog(funcName, fileName, area)
  return
}

export function stopAllRulesStream(): void {
  const funcName: string = 'stopAllRulesStream'
  entryLog(funcName, fileName, area)

  sendAsyncIpcMessageWorker('stop-all-rules-stream', {})

  exitLog(funcName, fileName, area)
  return
}

export async function getRule(ruleName: string): Promise<FullRule | undefined> {
  const funcName: string = 'getRule'
  entryLog(funcName, fileName, area)

  let rule: FullRule | undefined = undefined
  if (validateRuleName(ruleName)) {
    condLog('Rulename is valid', funcName, fileName, area)
    rule = (await sendSyncIpcMessageWorker('get-rule', ruleName)) as FullRule | undefined
  }

  exitLog(funcName, fileName, area)
  return rule
}

export async function getAllRules(): Promise<ShortRule[]> {
  const funcName: string = 'getAllRules'
  entryLog(funcName, fileName, area)

  const allRules: ShortRule[] = (await sendSyncIpcMessageWorker('get-all-rules', {})) as ShortRule[]

  exitLog(funcName, fileName, area)
  return allRules
}
