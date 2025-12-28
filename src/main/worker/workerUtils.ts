import { stopAllRulesStream, stopEveryRuleStream } from '@main/rules/rulesWindowCallbacks'

const fileName = 'workerUtils.ts'
const area = 'worker'

export function stopAllStreams(): void {
  const funcName = 'stopAllStreams'
  entryLog(funcName, fileName, area)

  if (!glob.mainGlobals.workerSetup) {
    condExitLog('Worker not setup yet', funcName, fileName, area)
    return
  }

  stopEveryRuleStream()
  stopAllRulesStream()

  exitLog(funcName, fileName, area)
  return
}
