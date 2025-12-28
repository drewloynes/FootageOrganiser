import { Rule } from '@worker/rules/rule'
import { streamUpdateCurrentRules } from './currentRules'

const fileName = 'rules.ts'
const area = 'rules'

export class Rules {
  // List of each rule
  #ruleList: Rule[]

  constructor(ruleList: Rule[] = []) {
    const funcName = 'Rules Constructor'
    entryLog(funcName, fileName, area)

    this.#ruleList = ruleList

    exitLog(funcName, fileName, area)
    return
  }

  get ruleList(): Rule[] {
    return this.#ruleList
  }

  clone(): Rules {
    const funcName = 'clone'
    entryLog(funcName, fileName, area)

    const clonedRules: Rules = new Rules()

    const clonedRuleList: Rule[] = []
    for (const rule of this.ruleList) {
      condLog(`For rule: ${rule.name}`, funcName, fileName, area)
      clonedRuleList.push(rule.clone())
    }
    clonedRules.#ruleList = clonedRuleList

    exitLog(funcName, fileName, area)
    return clonedRules
  }

  containsRulesAwaitingEvaluation(): boolean {
    const funcName = 'containsRulesAwaitingEvaluation'
    entryLog(funcName, fileName, area)

    let rulesAwaitingEvaluation = false
    const ruleAwaitingEvaluation = this.ruleList.find((rule) => rule.evaluateRule)
    if (ruleAwaitingEvaluation) {
      condLog(`Found Rule awaiting evaluation`, funcName, fileName, area)
      rulesAwaitingEvaluation = true
    }

    exitLog(funcName, fileName, area)
    return rulesAwaitingEvaluation
  }

  containsRulesAwaitingExecution(): boolean {
    const funcName = 'containsRulesAwaitingExecution'
    entryLog(funcName, fileName, area)

    let rulesAwaitingExecution = false
    const ruleAwaitingExecution = this.ruleList.find((rule) => rule.hasExecutableActions())
    if (ruleAwaitingExecution) {
      condLog(`Found Rule awaiting execution`, funcName, fileName, area)
      rulesAwaitingExecution = true
    }

    exitLog(funcName, fileName, area)
    return rulesAwaitingExecution
  }

  findRule(ruleName: string): Rule | undefined {
    const funcName = 'findRule'
    entryLog(funcName, fileName, area)

    const ruleFound = this.ruleList.find((rule) => rule.name === ruleName)

    exitLog(funcName, fileName, area)
    return ruleFound
  }

  addRule(newRule: Rule): boolean {
    const funcName = 'addRule'
    entryLog(funcName, fileName, area)

    let ruleAdded = false
    if (!this.findRule(newRule.name)) {
      condLog(`No rule exists with name: ${newRule.name}`, funcName, fileName, area)
      this.ruleList.push(newRule)
      ruleAdded = true
      streamUpdateCurrentRules()
    }

    exitLog(funcName, fileName, area)
    return ruleAdded
  }

  modifyRule(originalRuleName: string, modifiedRule: Rule): boolean {
    const funcName = 'modifyRule'
    entryLog(funcName, fileName, area)

    let ruleModified = false
    const originalRule: Rule | undefined = this.findRule(originalRuleName)
    if (originalRule) {
      condLog(`Original rule found`, funcName, fileName, area)
      // Clean up / pass over data from original rule
      modifiedRule.streamToMain = originalRule.streamToMain
      modifiedRule.streamToMain.updateData(this)
      // Swap original rule for the new rule
      const indexOfRule = this.ruleList.indexOf(originalRule)
      this.ruleList[indexOfRule] = modifiedRule
      ruleModified = true
      streamUpdateCurrentRules()
    }

    exitLog(funcName, fileName, area)
    return ruleModified
  }

  deleteRule(deleteRuleName: string): boolean {
    const funcName = 'deleteRule'
    entryLog(funcName, fileName, area)

    let ruleDeleted = false
    const rule: Rule | undefined = this.findRule(deleteRuleName)
    if (rule) {
      condLog(`Rule found`, funcName, fileName, area)
      // Clean up anything before deletion
      rule.streamToMain.stop()
      // Now Delete
      const indexOfRule = this.ruleList.indexOf(rule)
      this.ruleList.splice(indexOfRule, 1)
      ruleDeleted = true
      streamUpdateCurrentRules()
    }

    exitLog(funcName, fileName, area)
    return ruleDeleted
  }

  stopRule(ruleName: string): boolean {
    const funcName = 'stopRule'
    entryLog(funcName, fileName, area)

    let ruleStoped = false
    const rule: Rule | undefined = this.findRule(ruleName)
    if (rule) {
      condLog(`Rule ${rule.name} found`, funcName, fileName, area)
      rule.stop()
      ruleStoped = true
      streamUpdateCurrentRules()
    }

    exitLog(funcName, fileName, area)
    return ruleStoped
  }

  startRule(ruleName: string): boolean {
    const funcName = 'startRule'
    entryLog(funcName, fileName, area)

    let ruleStarted = false
    const rule: Rule | undefined = this.findRule(ruleName)
    if (rule) {
      condLog(`Rule ${rule.name} found`, funcName, fileName, area)
      rule.start()
      ruleStarted = true
      streamUpdateCurrentRules()
    }

    exitLog(funcName, fileName, area)
    return ruleStarted
  }

  setAwaitingChanges(awaitingChanges: boolean, ruleName: string): boolean {
    const funcName = 'setAwaitingChanges'
    entryLog(funcName, fileName, area)

    let awaitingChangesSet = false
    const rule: Rule | undefined = this.findRule(ruleName)
    if (rule) {
      condLog(`Rule ${rule.name} found`, funcName, fileName, area)
      rule.setAwaitingChanges(awaitingChanges)
      awaitingChangesSet = true
      streamUpdateCurrentRules()
    }

    exitLog(funcName, fileName, area)
    return awaitingChangesSet
  }
}
