import { endSleep, sleep } from '@shared-node/utils/timer'
import { evaluateCurrentRules } from './evaluation/evaluation'
import { executeCurrentRules } from './execution/execution'
import { setSilentEvaluateCurrentRules } from './rules/currentRules'

const fileName: string = 'runWorker.ts'
const area: string = 'worker'

export async function runWorker(): Promise<void> {
  const funcName: string = 'runWorker'
  entryLog(funcName, fileName, area)

  const continueWork = true
  while (continueWork) {
    condLog('Continue work', funcName, fileName, area)

    // Run a evaulation of the rules for any pending actions - then execute any actions
    if (await evaluateCurrentRules()) {
      condLog('There are executable actions for the rules', funcName, fileName, area)
      await executeCurrentRules()
    } else {
      condLog('There are no executable actions', funcName, fileName, area)
      // Sleep to prevent constant reevaluation when there is no work to do
      await sleepTillReevaluation()
      setSilentEvaluateCurrentRules()
    }
  }

  exitLog(funcName, fileName, area)
  return
}

async function sleepTillReevaluation() {
  const funcName: string = 'sleepTillReevaluation'
  entryLog(funcName, fileName, area)

  const reevaluateSleepTime = glob.workerGlobals.currentSettings?.reevaluateSleepTime
  if (!reevaluateSleepTime) {
    errorExitLog('reevaluateSleepTime does not exist', funcName, fileName, area)
    throw 'reevaluateSleepTime does not exist when it must'
  }

  debugLog(`Sleep for ${reevaluateSleepTime} minutes`, funcName, fileName, area)
  await sleep(reevaluateSleepTime * 60 * 1000, 'run-worker-sleep', glob.workerGlobals.currentSleeps)

  exitLog(funcName, fileName, area)
  return
}

export function endReevaluationSleepEarly(): void {
  const funcName: string = 'endReevaluationSleepEarly'
  entryLog(funcName, fileName, area)

  endSleep('run-worker-sleep', glob.workerGlobals.currentSleeps)

  exitLog(funcName, fileName, area)
  return
}
