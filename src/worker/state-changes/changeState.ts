import { ModifyRuleInfo, StoreRule } from '@shared/types/ruleTypes'
import { StoreSettings } from '@shared/types/settingsTypes'
import {
  addRuleInCurrentRules,
  deleteRuleInCurrentRules,
  evaluateAllCurrentRules,
  modifyRuleInCurrentRules
} from '@worker/rules/currentRules'
import { Rule } from '@worker/rules/rule'
import { modifyCurrentSettings } from '@worker/settings/currentSettings'
import { Settings } from '@worker/settings/settings'
import { toRule } from '@worker/storage/rules/storeRule'
import { toSettings } from '@worker/storage/settings/storeSettings'
import { Change, CHANGE_TYPE } from './change'

const fileName = 'changeState.ts'
const area = 'state-changes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addAwaitingChange(changeType: CHANGE_TYPE, changeData: any): void {
  const funcName = 'addAwaitingChange'
  entryLog(funcName, fileName, area)

  debugLog(`Adding to AwaitngChanges: ${changeType}`, funcName, fileName, area)
  glob.workerGlobals.awaitingChanges.push(new Change(changeType, changeData))

  exitLog(funcName, fileName, area)
  return
}

export function abortIfStateAwaitingChanges(): void {
  const funcName = 'abortIfStateAwaitingChanges'
  entryLog(funcName, fileName, area)

  if (glob.workerGlobals.awaitingChanges.length > 0) {
    condLog(`Awaiting changes to state`, funcName, fileName, area)
    // Throw error to escape many functions and apply changes to state
    throw 'abort-rule-in-use'
  }

  exitLog(funcName, fileName, area)
  return
}

export async function processErrorFofrStageChanges(error): Promise<void> {
  const funcName = 'processErrorFofrStageChanges'
  entryLog(funcName, fileName, area)

  // Aborting executing rule early due to a change in state - apply any changes in state now
  if (error === 'abort-rule-in-use') {
    condLog(`Caught aborting rule in use`, funcName, fileName, area)
    await applyAwaitingStateChanges()
  } else {
    condLog(`Caught unknown error`, funcName, fileName, area)
    throw error
  }

  exitLog(funcName, fileName, area)
  return
}

async function applyAwaitingStateChanges(): Promise<void> {
  const funcName = 'applyAwaitingStateChanges'
  entryLog(funcName, fileName, area)

  for (const change of glob.workerGlobals.awaitingChanges) {
    condLog(`For change: ${change.type}`, funcName, fileName, area)
    await applyAwaitingStateChange(change)
  }

  glob.workerGlobals.awaitingChanges = []
  glob.workerGlobals.upcomingRules = undefined
  glob.workerGlobals.upcomingSettings = undefined

  exitLog(funcName, fileName, area)
  return
}

async function applyAwaitingStateChange(change: Change): Promise<void> {
  const funcName = 'applyAwaitingStateChange'
  entryLog(funcName, fileName, area)

  switch (change.type) {
    case CHANGE_TYPE.ADD_RULE: {
      condLog('Add rule change', funcName, fileName, area)
      const newRule: Rule | undefined = await toRule(change.dataForChange as StoreRule)
      if (newRule) {
        condLog('New rule created from store rule', funcName, fileName, area)
        await addRuleInCurrentRules(newRule)
      }
      break
    }
    case CHANGE_TYPE.MODIFY_RULE: {
      condLog('Modify rule change', funcName, fileName, area)
      const modifyRuleInfo: ModifyRuleInfo = change.dataForChange as ModifyRuleInfo
      const modifiedRule: Rule | undefined = await toRule(
        modifyRuleInfo.modifiedStoreRule as StoreRule
      )
      if (modifiedRule) {
        condLog('New rule created from store rule', funcName, fileName, area)
        modifiedRule.setError(modifyRuleInfo.error)
        await modifyRuleInCurrentRules(modifyRuleInfo.originalRuleName as string, modifiedRule)
      }
      break
    }
    case CHANGE_TYPE.DELETE_RULE: {
      condLog('Delete rule change', funcName, fileName, area)
      await deleteRuleInCurrentRules(change.dataForChange as string)
      break
    }
    case CHANGE_TYPE.MODIFY_SETTINGS: {
      condLog('Modify settings change', funcName, fileName, area)
      const modifiedSettings: Settings | undefined = toSettings(
        change.dataForChange as StoreSettings
      )
      if (modifiedSettings) {
        condLog('New settings create from store settings', funcName, fileName, area)
        modifyCurrentSettings(modifiedSettings)
        evaluateAllCurrentRules()
      }
      break
    }
    case CHANGE_TYPE.EVALUTE_ALL_RULES: {
      condLog('Evaluate all rules', funcName, fileName, area)
      evaluateAllCurrentRules()
    }
    default: {
      debugLog('Change type unidentified', funcName, fileName, area)
      break
    }
  }

  exitLog(funcName, fileName, area)
  return
}
