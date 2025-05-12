import { StoreRules } from '@shared-all/types/rulesTypes'
import { StoreRule } from '@shared-all/types/ruleTypes'
import { Rule } from '@worker/rules/rule'
import { Rules } from '@worker/rules/rules'
import { toRule, toStoreRule } from './storeRule'

const fileName = 'storeRules.ts'
const area = 'store-rules'

export async function toRules(storeRules: StoreRules): Promise<Rules | undefined> {
  const funcName = 'toRules'
  entryLog(funcName, fileName, area)

  let rules: Rules | undefined = undefined
  try {
    const ruleList: Rule[] = []
    for (const storeRule of storeRules.ruleList) {
      condLog('Create each Rule object', funcName, fileName, area)
      const newRule: Rule = await toRule(storeRule)
      ruleList.push(newRule)
    }
    rules = new Rules(ruleList)
  } catch {
    errorLog('Failure creating rules', funcName, fileName, area)
  }

  exitLog(funcName, fileName, area)
  return rules
}

export function toStoreRules(rules: Rules): StoreRules {
  const funcName = 'toStoreRules'
  entryLog(funcName, fileName, area)

  const storeRuleList: StoreRule[] = []
  for (const rule of rules.ruleList) {
    condLog('Create each Rule object', funcName, fileName, area)
    storeRuleList.push(toStoreRule(rule))
  }

  const storeRules: StoreRules = { ruleList: storeRuleList }

  exitLog(funcName, fileName, area)
  return storeRules
}
