import { Rules } from '@shared/rules/rules'
import { StoreRule } from './storeRule'
import { Rule } from '@shared/rules/rule'
import { DriveInfo } from '@shared/drives/driveInfo'

const fileName = 'storeRules.ts'
const area = 'store rules'

// Class for storing Rules objects to disk
export class StoreRules {
  // @Type(() => StoreRule)
  private ruleList: StoreRule[]

  /* --- Constructor & Getters / Setters --- */

  constructor(rules: Rules = new Rules()) {
    const funcName = 'StoreRules Constructor'
    entryLog(funcName, fileName, area)

    this.ruleList = []
    for (const rule of rules.getRuleList()) {
      condLog('Add each StoreRule object', funcName, fileName, area)
      this.ruleList.push(new StoreRule(rule))
    }

    exitLog(funcName, fileName, area)
    return
  }

  /* --- Functions --- */

  // Converts StoreRules object into a Rules object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async toRules(data: any): Promise<Rules | undefined> {
    const funcName = 'toRules'
    entryLog(funcName, fileName, area)

    let rules: Rules | undefined = undefined
    try {
      // Update workerConfig.currentDriveInfo to latest from the computer
      await DriveInfo.updateCurrentDriveInfo()
      if (data.ruleList === undefined) {
        throw 'Cant find Rules.RuleList'
      }
      const ruleList: Rule[] = []
      for (const rule of data.ruleList) {
        condLog('Create each Rule object', funcName, fileName, area)
        const newRule: Rule = StoreRule.toRule(rule)
        ruleList.push(newRule)
      }
      rules = new Rules(ruleList)
    } catch {
      errorLog('Failure parsing rules file', funcName, fileName, area)
    }

    exitLog(funcName, fileName, area)
    return rules
  }
}
