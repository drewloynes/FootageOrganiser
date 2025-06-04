import { stopAllRulesStream, stopEveryRuleStream } from '@main/rules/rulesWindowCallbacks'

const fileName: string = 'workerUtils.ts'
const area: string = 'worker'

export function stopAllStreams(): void {
  const funcName: string = 'stopAllStreams'
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
