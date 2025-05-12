import { stopAllRulesStream, stopEveryRuleStream } from '@main/rules/rulesWindowCallbacks'

const fileName: string = 'workerUtils.ts'
const area: string = 'worker'

export function stopAllStreams(): void {
  const funcName: string = 'stopAllStreams'
  entryLog(funcName, fileName, area)

  stopEveryRuleStream()
  stopAllRulesStream()

  exitLog(funcName, fileName, area)
  return
}
