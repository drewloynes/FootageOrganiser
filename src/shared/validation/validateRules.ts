import { z } from 'zod'
import { extraZodValidationStoreRule, STORE_RULE_SCHEMA } from './validateRule'

export const STORE_RULES_SCHEMA = {
  ruleList: z.array(z.object(STORE_RULE_SCHEMA))
}

export const STORE_RULES_ZOD_SCHEMA = z
  .object(STORE_RULES_SCHEMA)
  .superRefine(extraZodValidationStoreRules)

// Cant have logs - Used in all processes
function extraZodValidationStoreRules(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storeRulesData: any,
  ctx: z.RefinementCtx,
  currentPath: (string | number)[] = []
): void {
  for (const storeRuleData of storeRulesData.ruleList) {
    extraZodValidationStoreRule(storeRuleData, ctx, [
      ...currentPath,
      'ruleList',
      storeRulesData.ruleList.indexOf(storeRuleData)
    ])
  }
}
