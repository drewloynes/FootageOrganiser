import { Rule } from '@shared/rules/rule'
import { saveData, loadData, pathExists } from '@shared/storage/storeData'
import { StoreRules } from '@shared/storage/rules/storeRules'
import { afterQueueProc } from '@worker/communication/ipc/inputQueue'
import { DriveInfo } from '@shared/drives/driveInfo'
import { getRulesStorageLocation } from '@shared/utils/filePaths'
import { RuleStatus, StatusType } from '@worker/rules/ruleStatus'

const fileName: string = 'rules.ts'
const area: string = 'rules'

export class Rules {
  private ruleList: Rule[]
  private pendingActions: boolean

  /* --- Constructor & Getters / Setters --- */

  constructor(ruleList: Rule[] = []) {
    const funcName: string = 'Rules Constructor'
    entryLog(funcName, fileName, area)

    this.ruleList = ruleList
    this.pendingActions = false

    exitLog(funcName, fileName, area)
    return
  }

  getRuleList(): Rule[] {
    const funcName: string = 'getRuleList'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this.ruleList
  }

  /* --- Functions --- */

  /*  */
  static async loadRules(): Promise<Rules | undefined> {
    const funcName: string = 'loadRules'
    entryLog(funcName, fileName, area)

    let rules: Rules | undefined = undefined
    const rulesStorageLocation: string | undefined = getRulesStorageLocation()
    if (rulesStorageLocation && pathExists(rulesStorageLocation)) {
      condLog('Rules file found', funcName, fileName, area)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loadedRules: any | undefined = await loadData(rulesStorageLocation)
      if (loadedRules !== undefined) {
        condLog('Create Rules object', funcName, fileName, area)
        // const storeRules = plainToInstance(StoreRules, loadedRules)
        rules = await StoreRules.toRules(loadedRules)
      }
    } else if (!rulesStorageLocation) {
      errorLog('Storage location undefined', funcName, fileName, area)
    } else {
      condLog('Rules file doesnt exist', funcName, fileName, area)
      rules = new Rules()
    }

    exitLog(funcName, fileName, area)
    return rules
  }

  /* Convert Rules object to StoreRules and save to disc */
  private async saveRules(): Promise<void> {
    const funcName: string = 'saveRules'
    entryLog(funcName, fileName, area)

    const storeRules: StoreRules = new StoreRules(this)
    const rulesStorageLocation: string | undefined = getRulesStorageLocation()
    if (rulesStorageLocation) {
      condLog('Storage location exists', funcName, fileName, area)
      await saveData(rulesStorageLocation, storeRules)
    } else {
      errorLog('Storage location undefined', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return
  }

  /* */
  async checkPendingActions(): Promise<boolean> {
    const funcName = 'checkPendingActions'
    entryLog(funcName, fileName, area)

    this.pendingActions = false
    // Update workerConfig.currentDriveInfo to latest from the computer
    await DriveInfo.updateCurrentDriveInfo()
    // Time to start checking each rule
    for (const ruleItem of this.ruleList) {
      condLog(`Checking rule ${ruleItem.getName()}`, funcName, fileName, area)
      // Check if the rule is actionable - Any work to be done
      if (await ruleItem.checkPendingActions()) {
        condLog(`Rule ${ruleItem.getName()} has actions to perform`, funcName, fileName, area)
        this.pendingActions = true
      }
    }

    exitLog(funcName, fileName, area)
    return this.pendingActions
  }

  /* */
  async action(): Promise<boolean> {
    const funcName = 'action'
    entryLog(funcName, fileName, area)

    let inputQueueReaction = workerConfig.getInputQueues().processInputQueue(this)
    let skipSleepTillResync = false
    if (inputQueueReaction !== afterQueueProc.REEVALUATE_ALL_RULES) {
      condLog(`Start reevaluating all rules`, funcName, fileName, area)
      for (const rule of this.ruleList) {
        condLog(`Perform actions on rule ${rule.getName()}`, funcName, fileName, area)

        if (rule.getStartActions() === false || rule.getPauseProcessing() === true) {
          condLog(`Skip rule ${rule.getName()}`, funcName, fileName, area)
          if (rule.getStartActions() === false) {
            RuleStatus.setRuleStatusInList(rule, StatusType.AWAITING_APPROVAL)
            RuleStatus.setRuleStatusPendingWorkInList(rule)
          }
          continue
        }
        RuleStatus.setRuleStatusInList(rule, StatusType.ACTIONING)

        skipSleepTillResync = true
        inputQueueReaction = rule.mkDirs(this)
        if (
          inputQueueReaction === afterQueueProc.REEVALUATE_ALL_RULES ||
          inputQueueReaction === afterQueueProc.RESTART_DOING_ALL_ACTIONS
        ) {
          break
        } else if (inputQueueReaction === afterQueueProc.SKIP_CURRENT_RULE) {
          skipSleepTillResync = true
          RuleStatus.setRuleStatusAwaitingApproval(rule)
          continue
        }
        inputQueueReaction = await rule.copyFiles(this)
        if (
          inputQueueReaction === afterQueueProc.REEVALUATE_ALL_RULES ||
          inputQueueReaction === afterQueueProc.RESTART_DOING_ALL_ACTIONS
        ) {
          break
        } else if (inputQueueReaction === afterQueueProc.SKIP_CURRENT_RULE) {
          skipSleepTillResync = true
          RuleStatus.setRuleStatusAwaitingApproval(rule)
          continue
        }
        inputQueueReaction = rule.deleteFiles(this)
        if (
          inputQueueReaction === afterQueueProc.REEVALUATE_ALL_RULES ||
          inputQueueReaction === afterQueueProc.RESTART_DOING_ALL_ACTIONS
        ) {
          break
        } else if (inputQueueReaction === afterQueueProc.SKIP_CURRENT_RULE) {
          skipSleepTillResync = true
          RuleStatus.setRuleStatusAwaitingApproval(rule)
          continue
        }
        inputQueueReaction = rule.deleteDirs(this)
        if (
          inputQueueReaction === afterQueueProc.REEVALUATE_ALL_RULES ||
          inputQueueReaction === afterQueueProc.RESTART_DOING_ALL_ACTIONS
        ) {
          break
        } else if (inputQueueReaction === afterQueueProc.SKIP_CURRENT_RULE) {
          skipSleepTillResync = true
          RuleStatus.setRuleStatusAwaitingApproval(rule)
          continue
        }
        rule.setReevaluate()
        RuleStatus.setRuleStatusInList(rule, StatusType.AWAITING_PROCESSING)
      }
    }

    if (inputQueueReaction === afterQueueProc.RESTART_DOING_ALL_ACTIONS) {
      condLog(`Recall function if needed`, funcName, fileName, area)
      this.action()
    }

    if (inputQueueReaction === afterQueueProc.REEVALUATE_ALL_RULES) {
      condLog(`Skip sleep till next resync`, funcName, fileName, area)
      skipSleepTillResync = true
      RuleStatus.resetRuleStatusList(this.ruleList)
    }

    exitLog(funcName, fileName, area)
    return skipSleepTillResync
  }

  /* */
  async addRule(newRule: Rule): Promise<Rules> {
    const funcName = 'addRule'
    entryLog(funcName, fileName, area)

    this.ruleList.push(newRule)
    await this.saveRules()

    exitLog(funcName, fileName, area)
    return this
  }

  /* */
  async removeRule(removedRuleName: string) {
    const funcName = 'removeRule'
    entryLog(funcName, fileName, area)

    condLog(`Find rule: ${removedRuleName}`, funcName, fileName, area)
    for (const rule of this.ruleList) {
      condLog(`For a rule ${rule.getName()}`, funcName, fileName, area)
      if (rule.getName() === removedRuleName) {
        condLog(`Rule found`, funcName, fileName, area)
        const index = this.ruleList.indexOf(rule)
        this.ruleList.splice(index, 1)
        await this.saveRules()
        break
      }
    }

    exitLog(funcName, fileName, area)
    return this
  }

  /* */
  async modifyRule(oldRuleName: string, updatedRule: Rule) {
    const funcName = 'modifyRule'
    entryLog(funcName, fileName, area)

    for (const rule of this.ruleList) {
      condLog(`For a rule`, funcName, fileName, area)
      if (rule.getName() === oldRuleName) {
        const index = this.ruleList.indexOf(rule)
        this.ruleList[index] = updatedRule
        break
      }
    }

    this.saveRules()

    exitLog(funcName, fileName, area)
    return this
  }

  /* */
  getRule(ruleName: string): Rule | undefined {
    const funcName = 'getRule'
    entryLog(funcName, fileName, area)

    let ruleFound: Rule | undefined = undefined
    for (const rule of this.ruleList) {
      condLog(`For a rule`, funcName, fileName, area)
      if (rule.getName() === ruleName) {
        ruleFound = rule
        break
      }
    }

    exitLog(funcName, fileName, area)
    return ruleFound
  }

  setRuleToReeval(ruleToResync: string) {
    const funcName = 'setRuleToReeval'
    entryLog(funcName, fileName, area)

    for (const rule of this.ruleList) {
      condLog(`For a rule`, funcName, fileName, area)
      if (rule.getName() === ruleToResync) {
        rule.setReevaluate()
        break
      }
    }

    exitLog(funcName, fileName, area)
    return this
  }

  reevaluateAllRules() {
    const funcName = 'reevaluateAllRules'
    entryLog(funcName, fileName, area)

    for (const rule of this.ruleList) {
      condLog(`Set reevaluate rule`, funcName, fileName, area)
      rule.setReevaluate()
    }

    exitLog(funcName, fileName, area)
    return this
  }

  removeRuleFromRulesList(ruleToRemove: string) {
    const funcName = 'removeRuleFromRulesList'
    entryLog(funcName, fileName, area)

    this.ruleList = this.ruleList.filter((rule) => rule.getName() !== ruleToRemove)

    exitLog(funcName, fileName, area)
    return this
  }

  startRule(ruleToStart: string) {
    const funcName = 'startRule'
    entryLog(funcName, fileName, area)

    for (const rule of this.ruleList) {
      condLog(`For a rule`, funcName, fileName, area)
      if (rule.getName() === ruleToStart) {
        condLog(`Start rule`, funcName, fileName, area)
        rule.setStart()
        break
      }
    }

    exitLog(funcName, fileName, area)
    return this
  }

  stopRule(ruleToStop: string) {
    const funcName = 'stopRule'
    entryLog(funcName, fileName, area)

    for (const rule of this.ruleList) {
      condLog(`For a rule`, funcName, fileName, area)
      if (rule.getName() === ruleToStop) {
        condLog(`Stop rule`, funcName, fileName, area)
        rule.setStop()
        break
      }
    }

    exitLog(funcName, fileName, area)
    return this
  }

  async updateRules(): Promise<Rules | undefined> {
    const funcName = 'updateRules'
    entryLog(funcName, fileName, area)

    const latestRules = await Rules.loadRules()
    if (latestRules) {
      for (const latestRule of latestRules.ruleList) {
        condLog(`Update rule`, funcName, fileName, area)
        const currentRule = this.ruleList.find((rule) => rule.getName() === latestRule.getName())
        if (currentRule) {
          condLog(`Rule previously existed`, funcName, fileName, area)
          latestRule.updateCurrentInfo(currentRule)
        }
      }
    }
    this.pendingActions = false

    exitLog(funcName, fileName, area)
    return latestRules
  }

  async pauseRule(ruleName: string, shouldPause: boolean = true) {
    const funcName = 'pauseRule'
    entryLog(funcName, fileName, area)

    for (const rule of this.ruleList) {
      condLog(`For a rule`, funcName, fileName, area)
      if (rule.getName() === ruleName) {
        condLog(`Start rule`, funcName, fileName, area)
        rule.setPauseProcessing(shouldPause)
        break
      }
    }
    await this.saveRules()

    exitLog(funcName, fileName, area)
    return this
  }

  async pauseAllRules(shouldPause: boolean = true) {
    const funcName = 'pauseAllRules'
    entryLog(funcName, fileName, area)

    for (const rule of this.ruleList) {
      condLog(`For a rule`, funcName, fileName, area)
      rule.setPauseProcessing(shouldPause)
    }
    await this.saveRules()

    exitLog(funcName, fileName, area)
    return this
  }
}
