import { z } from 'zod'

const fileName = 'validateRule.ts'
const area = 'validation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateRuleName(ruleNameData: any): boolean {
  const funcName = 'validateRuleName'
  entryLog(funcName, fileName, area)

  if (!z.string().min(1).safeParse(ruleNameData).success) {
    warnExitLog('ruleNameData is not a valid string', funcName, fileName, area)
    return false
  }

  exitLog(funcName, fileName, area)
  return true
}
