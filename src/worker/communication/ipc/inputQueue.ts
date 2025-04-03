import { Rules } from '@shared/rules/rules'

const fileName: string = 'inputQueue.ts'
const area: string = 'input'

export enum afterQueueProc {
  NOTHING = 'nothing',
  MAYBE_SKIP_CURRENT_RULE = 'maybe-skip-current-rule',
  SKIP_CURRENT_RULE = 'skip-current-rule',
  REEVALUATE_ALL_RULES = 'reevaluate-all-rules',
  RESTART_DOING_ALL_ACTIONS = 'restart-doing-all-actions'
}

export class InputQueue {
  // Items in queues boolean
  private itemsInQueues: boolean

  // Following are the inputs:
  // Rules changed
  private rulesChanged: string[]
  // Rules to stop
  private rulesToStop: string[]
  // Rules to start
  private rulesToStart: string[]
  // Rules added
  private rulesAdded: boolean
  // Rules deleted
  private rulesDeleted: string[]
  // Resync all rules - for when checksum method changes
  private resyncAll: boolean

  constructor() {
    const funcName: string = 'InputQueue Constructor'
    entryLog(funcName, fileName, area)

    this.itemsInQueues = false

    this.rulesChanged = []
    this.rulesAdded = false
    this.rulesDeleted = []
    this.rulesToStop = []
    this.rulesToStart = []
    this.resyncAll = false

    exitLog(funcName, fileName, area)
    return
  }

  ruleChanged(ruleName: string) {
    const funcName: string = 'ruleChanged'
    entryLog(funcName, fileName, area)

    infoLog(`Rule changed: ${ruleName}`, funcName, fileName, area)
    this.itemsInQueues = true
    this.rulesChanged.push(ruleName)

    exitLog(funcName, fileName, area)
    return
  }

  ruleAdded(ruleName: string) {
    const funcName: string = 'ruleAdded'
    entryLog(funcName, fileName, area)

    infoLog(`Rule added: ${ruleName}`, funcName, fileName, area)
    this.itemsInQueues = true
    this.rulesAdded = true

    exitLog(funcName, fileName, area)
    return
  }

  ruleDeleted(ruleName: string) {
    const funcName: string = 'ruleDeleted'
    entryLog(funcName, fileName, area)

    infoLog(`Rule deleted: ${ruleName}`, funcName, fileName, area)
    this.itemsInQueues = true
    this.rulesDeleted.push(ruleName)

    exitLog(funcName, fileName, area)
    return
  }

  allRulesChanged() {
    const funcName: string = 'allRulesChanged'
    entryLog(funcName, fileName, area)

    this.setResyncAll()

    exitLog(funcName, fileName, area)
    return
  }

  startRule(ruleName: string) {
    const funcName: string = 'startRule'
    entryLog(funcName, fileName, area)

    infoLog(`Start rule: ${ruleName}`, funcName, fileName, area)
    this.itemsInQueues = true
    this.rulesToStart.push(ruleName)

    exitLog(funcName, fileName, area)
    return
  }

  stopRule(ruleName: string) {
    const funcName: string = 'stopRule'
    entryLog(funcName, fileName, area)

    infoLog(`Stop rule: ${ruleName}`, funcName, fileName, area)
    this.itemsInQueues = true
    this.rulesToStop.push(ruleName)

    exitLog(funcName, fileName, area)
    return
  }

  setResyncAll() {
    const funcName: string = 'setResyncAll'
    entryLog(funcName, fileName, area)

    infoLog(`Resync all`, funcName, fileName, area)
    this.itemsInQueues = true
    this.resyncAll = true

    exitLog(funcName, fileName, area)
    return
  }

  checkInputQueue(): boolean {
    const funcName: string = 'checkInputQueue'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.itemsInQueues
  }

  processInputQueue(currentRules: Rules): afterQueueProc {
    const funcName: string = 'processInputQueue'
    entryLog(funcName, fileName, area)

    let nextAction: afterQueueProc = afterQueueProc.NOTHING
    if (this.itemsInQueues === true) {
      condLog(`There are items in the queue`, funcName, fileName, area)
      if (this.ruleChanged.length > 0) {
        condLog(`Ruled have changed`, funcName, fileName, area)
        nextAction = this.processRulesChanged(currentRules)
      }
      if (this.rulesAdded === true) {
        condLog(`Rules have been added`, funcName, fileName, area)
        nextAction = this.processRulesAdded()
      }
      if (this.rulesDeleted.length > 0) {
        condLog(`Rules have been deleted`, funcName, fileName, area)
        nextAction = this.processRulesDeleted(currentRules)
      }
      if (this.rulesToStart.length > 0) {
        condLog(`Rules need to start`, funcName, fileName, area)
        nextAction = this.processRulesToStart(currentRules)
      }
      if (this.rulesToStop.length > 0) {
        condLog(`Rules need to stop`, funcName, fileName, area)
        nextAction = this.processRulesToStop(currentRules)
      }
      if (this.resyncAll === true) {
        condLog(`Need to reevaluate all rules`, funcName, fileName, area)
        currentRules.reevaluateAllRules()
        this.resyncAll = false
        nextAction = afterQueueProc.REEVALUATE_ALL_RULES
      }
      this.itemsInQueues = false
    }

    exitLog(funcName, fileName, area)
    return nextAction
  }

  private processRulesChanged(currentRules: Rules): afterQueueProc {
    const funcName: string = 'processRuleChanged'
    entryLog(funcName, fileName, area)

    // Need to reevaluate amy changed rules in future, but not immediately
    const nextAction: afterQueueProc = afterQueueProc.MAYBE_SKIP_CURRENT_RULE
    for (const changedRule of this.rulesChanged) {
      condLog(`For a changed rule`, funcName, fileName, area)
      currentRules.setRuleToReeval(changedRule)
    }
    this.rulesChanged = []

    exitLog(funcName, fileName, area)
    return nextAction
  }

  private processRulesAdded(): afterQueueProc {
    const funcName: string = 'processRulesAdded'
    entryLog(funcName, fileName, area)

    // Currently - dont need to do anything when a rule is added, wait till next reevaluation
    const nextAction: afterQueueProc = afterQueueProc.NOTHING
    this.rulesAdded = false

    exitLog(funcName, fileName, area)
    return nextAction
  }

  private processRulesDeleted(currentRules: Rules): afterQueueProc {
    const funcName: string = 'processRulesDeleted'
    entryLog(funcName, fileName, area)

    // Need to remove the rule from the rulesList - make sure to skip if currently using the rule
    const nextAction: afterQueueProc = afterQueueProc.MAYBE_SKIP_CURRENT_RULE
    for (const deletedRule of this.rulesDeleted) {
      condLog(`For a deleted rule ${deletedRule}`, funcName, fileName, area)
      currentRules.removeRuleFromRulesList(deletedRule)
    }
    this.rulesDeleted = []

    exitLog(funcName, fileName, area)
    return nextAction
  }

  private processRulesToStart(currentRules: Rules): afterQueueProc {
    const funcName: string = 'processRulesToStart'
    entryLog(funcName, fileName, area)

    // Set rule to start - make sure to restart going through all rules for actions
    const nextAction: afterQueueProc = afterQueueProc.RESTART_DOING_ALL_ACTIONS
    for (const ruleToStart of this.rulesToStart) {
      condLog(`For a rule to start ${ruleToStart}`, funcName, fileName, area)
      currentRules.startRule(ruleToStart)
    }
    this.rulesToStart = []

    exitLog(funcName, fileName, area)
    return nextAction
  }

  private processRulesToStop(currentRules: Rules): afterQueueProc {
    const funcName: string = 'processRulesToStop'
    entryLog(funcName, fileName, area)

    // Set rule to stop - make sure to maybe skip current rule
    const nextAction: afterQueueProc = afterQueueProc.MAYBE_SKIP_CURRENT_RULE
    for (const ruleToStop of this.rulesToStop) {
      condLog(`For a rule to stop ${ruleToStop}`, funcName, fileName, area)
      currentRules.stopRule(ruleToStop)
    }
    this.rulesToStop = []

    exitLog(funcName, fileName, area)
    return nextAction
  }
}
