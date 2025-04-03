import { sleep, sleepOrWork } from '@shared/utils/timer'
import { Rules } from '@shared/rules/rules'
import { startAutoDeleteOldLogsOnMidnight } from '@shared/storage/storeLogs'
import { RuleStatus } from './rules/ruleStatus'

const fileName: string = 'runWorker.ts'
const area: string = 'worker'

export async function runWorker(): Promise<void> {
  const funcName: string = 'runWorker'
  entryLog(funcName, fileName, area)

  // Start autodeleting logs
  startAutoDeleteOldLogsOnMidnight()

  const continueWork = true
  // Get the current rules - Check / Note which rules are actionable.
  // (ie are the drives these rules are refering to connected? Is there any work to do?)
  let currentRules: Rules | undefined = await Rules.loadRules()
  if (currentRules) {
    RuleStatus.initialiseRuleStatusList(currentRules.getRuleList())
  }

  let skipTimerTillResync = false
  while (continueWork) {
    condLog('Continue work', funcName, fileName, area)
    const startTime = new Date()
    if (currentRules) {
      condLog('Update current rules', funcName, fileName, area)
      // Get current rules - merge current rules with reloading rules
      currentRules = await currentRules.updateRules()
      if (currentRules) {
        RuleStatus.UpdatedRulesUpdRuleStatusList(currentRules.getRuleList())
        // rulestatus - add any new rules - remove any old rules - set any pause rules too
      }
    }
    if (currentRules && (await currentRules.checkPendingActions())) {
      condLog('There are pending actions, perform them', funcName, fileName, area)
      // Perform any actions based on what rules were deemed actionable
      skipTimerTillResync = await currentRules.action()
    }
    const timeAfterActions = new Date()
    const diffTime = timeAfterActions.getTime() - startTime.getTime()
    const pauseTime = footageOrganiserSettings.getSyncTime() * 60 * 1000
    const timeToWait = pauseTime - diffTime
    // Sleep back on time from actions
    // Pause for 10 seconds before checking again
    if (!skipTimerTillResync) {
      condLog('Pause till next resync', funcName, fileName, area)
      await sleepOrWork(timeToWait)
    }
  }

  exitLog(funcName, fileName, area)
  return
}
