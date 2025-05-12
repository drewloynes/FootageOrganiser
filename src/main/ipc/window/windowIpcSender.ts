import { getWindow } from '@main/window/window'
import { Alert } from '@shared-all/types/alert'
import { FullRule, ShortRule } from '@shared-all/types/ruleTypes'

const fileName: string = 'windowIpcSender.ts'
const area: string = 'window-ipc'

export function sendAlertToWindow(alert: Alert): void {
  const funcName: string = 'sendAlertToWindow'
  entryLog(funcName, fileName, area)

  getWindow()?.webContents.send('alert', alert)

  exitLog(funcName, fileName, area)
  return
}

export function sendAllRulesToWindow(allRules: ShortRule[]): void {
  const funcName: string = 'sendAllRulesToWindow'
  entryLog(funcName, fileName, area)

  getWindow()?.webContents.send('all-rules', allRules)

  exitLog(funcName, fileName, area)
  return
}

export function sendRuleToWindow(rule: FullRule): void {
  const funcName: string = 'sendRuleToWindow'
  entryLog(funcName, fileName, area)

  getWindow()?.webContents.send('rule', rule)

  exitLog(funcName, fileName, area)
  return
}
