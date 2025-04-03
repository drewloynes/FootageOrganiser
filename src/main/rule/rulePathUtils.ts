import { RulePath } from '@shared/rules/rulePath'

const fileName: string = 'rulePathUtils.ts'
const area: string = 'rule'

export function createRulePathFromStringArray(
  directoryArray: string[],
  includeFiles: string[] = [],
  excludeFiles: string[] = [],
  includeDirs: string[] = [],
  excludeDirs: string[] = []
) {
  const funcName: string = 'createRulePathFromStringArray'
  entryLog(funcName, fileName, area)

  const rulePath = new RulePath(
    directoryArray[0],
    directoryArray[1],
    includeFiles,
    excludeFiles,
    includeDirs,
    excludeDirs
  )

  exitLog(funcName, fileName, area)
  return rulePath
}
