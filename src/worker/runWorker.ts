import { sleep } from '@shared/utils/timer'
import { Rules } from '@shared/rules/rules'
import { Rule, RuleType } from '@shared/rules/rule'
import { RuleCopyOptions } from '@shared/rules/ruleCopyOptions'
import { TypeCopyFileOptions, TypeCopyFileFormatOptions } from '@shared/rules/typeCopyFileOptions'
import { RulePath } from '@shared/rules/rulePath'
import { TypeMirrorOptions } from '@shared/rules/typeMirrorOptions'

const fileName: string = 'runWorker.ts'
const area: string = 'worker'

export async function runWorker(): Promise<void> {
  const funcName: string = 'runWorker'
  entryLog(funcName, fileName, area)

  const continueWork = true

  // const copyOptions = new RuleCopyOptions([], ['*.png'], [], [])
  // const extraPath1 = new RulePath('Windows', '\\Users\\drewl\\testDelete')
  // const extraPath2 = new RulePath('Windows', '\\Users\\drewl\\testDelete2')
  // const copyFileOptions = new TypeCopyFileOptions(
  //   [
  //     TypeCopyFileFormatOptions.YEAR,
  //     TypeCopyFileFormatOptions.MONTH,
  //     TypeCopyFileFormatOptions.DAY,
  //     TypeCopyFileFormatOptions.VOLUME_NAME
  //   ],
  //   '',
  //   true,
  //   true,
  //   [extraPath1, extraPath2]
  // )
  // const mirrorOptions = new TypeMirrorOptions(true, [], [], [], [])
  // const fromRulePath = new RulePath('Windows', '\\Users\\drewl\\OneDrive\\Photos')
  // const toRulePath = new RulePath('Windows', '\\Users\\drewl\\Downloads')
  // const newRule = new Rule(
  //   'copyRule',
  //   RuleType.COPYFILE,
  //   copyFileOptions,
  //   copyOptions,
  //   fromRulePath,
  //   toRulePath
  // )
  // const currentRules: Rules | undefined = await Rules.loadRules()
  // if (currentRules) {
  //   await currentRules.addRule(newRule)
  // } else {
  //   const newRules = new Rules()
  //   await newRules.addRule(newRule)
  // }

  while (continueWork) {
    condLog('Continue work', funcName, fileName, area)

    // Get the current rules - Check / Note which rules are actionable.
    // (ie are the drives these rules are refering to connected? Is there any work to do?)
    const currentRules: Rules | undefined = await Rules.loadRules()
    if (currentRules) {
      condLog('Check for work to do on rules', funcName, fileName, area)
      if (await currentRules.checkPendingActions()) {
        condLog('There are pending actions, perform them', funcName, fileName, area)
        // Perform any actions based on what rules were deemed actionable
        currentRules.action()
      }
    }
    // Pause for 10 seconds before checking again
    await sleep(10000)
  }

  exitLog(funcName, fileName, area)
  return
}
