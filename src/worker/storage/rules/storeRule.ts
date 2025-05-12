import { StoreRule } from '@shared-all/types/ruleTypes'
import { PATH_IN_VOLUME_TYPE } from '@worker/path/pathInVolume'
import { Rule } from '@worker/rules/rule'
import { toPathInVolume, toStorePathInVolume } from '../path/storePathInVolume'
import { toCopyFileOptions, toStoreCopyFileOptions } from './storeCopyFileOptions'
import { toMirrorOptions, toStoreMirrorOptions } from './storeMirrorOptions'

const fileName = 'storeRule.ts'
const area = 'store-rules'

export async function toRule(storeRule: StoreRule): Promise<Rule> {
  const funcName = 'toRule'
  entryLog(funcName, fileName, area)

  const rule = new Rule(
    storeRule.name,
    storeRule.type,
    await toPathInVolume(storeRule.origin, PATH_IN_VOLUME_TYPE.ORIGIN),
    await toPathInVolume(storeRule.target, PATH_IN_VOLUME_TYPE.TARGET),
    await toCopyFileOptions(storeRule.copyFileOptions),
    toMirrorOptions(storeRule.mirrorOptions),
    storeRule.enableStartStopActions,
    storeRule.disabled
  )

  exitLog(funcName, fileName, area)
  return rule
}

export function toStoreRule(rule: Rule): StoreRule {
  const funcName = 'toStoreRule'
  entryLog(funcName, fileName, area)

  const storeRule: StoreRule = {
    name: rule.name,
    type: rule.type,
    origin: toStorePathInVolume(rule.origin),
    target: toStorePathInVolume(rule.target),
    copyFileOptions: toStoreCopyFileOptions(rule.copyFileOptions),
    mirrorOptions: toStoreMirrorOptions(rule.mirrorOptions),
    enableStartStopActions: rule.enableStartStopActions,
    disabled: rule.disabled
  }

  exitLog(funcName, fileName, area)
  return storeRule
}
