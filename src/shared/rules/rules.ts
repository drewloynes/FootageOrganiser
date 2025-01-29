import { Rule } from '@shared/rules/rule'
import { saveData, loadData, pathExists } from '@shared/storage/storeData'
import { StoreRules } from '@shared/storage/rules/storeRules'

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
    const rulesStorageLocation: string | undefined = workerConfig.getRulesStorageLocation()
    if (rulesStorageLocation && pathExists(rulesStorageLocation)) {
      condLog('Rules file found', funcName, fileName, area)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const loadedRules: any | undefined = await loadData(rulesStorageLocation)
      if (loadedRules !== undefined) {
        condLog('Create Rules object', funcName, fileName, area)
        // const storeRules = plainToInstance(StoreRules, loadedRules)
        rules = await StoreRules.toRules(loadedRules)
      }
    } else {
      errorLog('Storage location undefined', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return rules
  }

  /* Convert Rules object to StoreRules and save to disc */
  private async saveRules(): Promise<void> {
    const funcName: string = 'saveRules'
    entryLog(funcName, fileName, area)

    const storeRules: StoreRules = new StoreRules(this)
    const rulesStorageLocation: string | undefined = workerConfig.getRulesStorageLocation()
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
    await workerConfig.updateCurrentDriveInfo()
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
  async action() {
    const funcName = 'action'
    entryLog(funcName, fileName, area)

    for (const rule of this.ruleList) {
      condLog(`Perform actions on rule ${rule.getName()}`, funcName, fileName, area)
      rule.mkDirs()
      rule.copyFiles()
      rule.deleteFiles()
      rule.deleteDirs()
    }

    exitLog(funcName, fileName, area)
    return this
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
  async removeRule(removedRule: Rule) {
    const funcName = 'removeRule'
    entryLog(funcName, fileName, area)

    exitLog(funcName, fileName, area)
    return this
  }
}
