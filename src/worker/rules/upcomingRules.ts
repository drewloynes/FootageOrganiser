import { Rule } from './rule'

const fileName = 'upcomingRules.ts'
const area = 'rules'

function initialiseUpcomingRules(): void {
  const funcName = 'initialiseUpcomingRules'
  entryLog(funcName, fileName, area)

  if (!glob.workerGlobals.upcomingRules) {
    condLog(`Upcoming rules does not exist`, funcName, fileName, area)
    if (glob.workerGlobals.currentRules) {
      condLog(`Current rules exists`, funcName, fileName, area)
      glob.workerGlobals.upcomingRules = glob.workerGlobals.currentRules.clone()
    }
  }

  exitLog(funcName, fileName, area)
  return
}

export function addRuleInUpcomingRules(newRule: Rule): void {
  const funcName = 'addRuleInUpcomingRules'
  entryLog(funcName, fileName, area)

  initialiseUpcomingRules()
  glob.workerGlobals.upcomingRules?.addRule(newRule)

  exitLog(funcName, fileName, area)
  return
}

export function modifyRuleInUpcomingRules(originalRuleName: string, modifiedRule: Rule): void {
  const funcName = 'modifyRuleInUpcomingRules'
  entryLog(funcName, fileName, area)

  initialiseUpcomingRules()
  glob.workerGlobals.upcomingRules?.modifyRule(originalRuleName, modifiedRule)

  exitLog(funcName, fileName, area)
  return
}

export function deleteRuleInUpcomingRules(deleteRuleName: string): void {
  const funcName = 'deleteRuleInUpcomingRules'
  entryLog(funcName, fileName, area)

  initialiseUpcomingRules()
  glob.workerGlobals.upcomingRules?.deleteRule(deleteRuleName)

  exitLog(funcName, fileName, area)
  return
}

export function stopRuleInUpcomingRules(ruleName: string): void {
  const funcName = 'stopRuleInUpcomingRules'
  entryLog(funcName, fileName, area)

  initialiseUpcomingRules()
  glob.workerGlobals.upcomingRules?.stopRule(ruleName)

  exitLog(funcName, fileName, area)
  return
}

export function startRuleInUpcomingRules(ruleName: string): void {
  const funcName = 'startRuleInUpcomingRules'
  entryLog(funcName, fileName, area)

  initialiseUpcomingRules()
  glob.workerGlobals.upcomingRules?.startRule(ruleName)

  exitLog(funcName, fileName, area)
  return
}

export async function evaluateAllUpcomingRules(): Promise<void> {
  const funcName = 'evaluateAllUpcomingRules'
  entryLog(funcName, fileName, area)

  initialiseUpcomingRules()
  glob.workerGlobals.upcomingRules?.evaluateAllRules()

  exitLog(funcName, fileName, area)
  return
}
