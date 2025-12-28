import {
  chooseDirectory,
  openGithub,
  openLogsFolder,
  openReportBug
} from '@main/general/generalWindowCallback'
import {
  activateRule,
  addRule,
  deleteRule,
  disableAllRules,
  disableRule,
  evaluateAllRules,
  getAllRules,
  getRule,
  modifyRule,
  startAllRulesStream,
  startRule,
  startRuleStream,
  stopAllRules,
  stopAllRulesStream,
  stopEveryRuleStream,
  stopRule,
  stopRuleStream
} from '@main/rules/rulesWindowCallbacks'
import { getSettings, modifySettings } from '@main/settings/settingsWindowCallback'
import { StoreRule } from '@shared-all/types/ruleTypes'
import { StoreSettings } from '@shared-all/types/settingsTypes'
import { app, ipcMain } from 'electron'

const fileName = 'windowIpcReceiver.ts'
const area = 'window-ipc'

export function setupWindowIpcEvents(): void {
  const funcName = 'setupWindowIpcEvents'
  entryLog(funcName, fileName, area)

  // Setup all callbacks for the window

  // One-way async Window-Main callbakcs
  ipcMain.on('add-rule', (_, newRule: StoreRule) => addRule(newRule))
  ipcMain.on('modify-rule', (_, oldRuleName: string, newRule: StoreRule) =>
    modifyRule(oldRuleName, newRule)
  )
  ipcMain.on('delete-rule', (_, removeRuleName: string) => deleteRule(removeRuleName))
  ipcMain.on('start-rule', (_, ruleName: string) => startRule(ruleName))
  ipcMain.on('stop-rule', (_, ruleName: string) => stopRule(ruleName))
  ipcMain.on('stop-all-rules', stopAllRules)
  ipcMain.on('activate-rule', (_, ruleName: string) => activateRule(ruleName))
  ipcMain.on('disable-rule', (_, ruleName: string) => disableRule(ruleName))
  ipcMain.on('disable-all-rules', disableAllRules)
  ipcMain.on('evaluate-all-rules', evaluateAllRules)

  ipcMain.on('start-rule-stream', (_, ruleName: string) => startRuleStream(ruleName))
  ipcMain.on('stop-rule-stream', (_, ruleName: string) => stopRuleStream(ruleName))
  ipcMain.on('stop-every-rule-stream', stopEveryRuleStream)
  ipcMain.on('start-all-rules-stream', startAllRulesStream)
  ipcMain.on('stop-all-rules-stream', stopAllRulesStream)

  ipcMain.on('modify-settings', (_, newSettings: StoreSettings) => modifySettings(newSettings))

  ipcMain.on('open-logs-folder', openLogsFolder)
  ipcMain.on('open-github', openGithub)
  ipcMain.on('open-report-bug', openReportBug)
  ipcMain.on('quit', app.quit)

  // Two-way sync Window-Main callbacks providing return values
  ipcMain.handle('get-rule', async (_, ruleName: string) => await getRule(ruleName))
  ipcMain.handle('get-all-rules', getAllRules)

  ipcMain.handle('get-settings', getSettings)

  ipcMain.handle('choose-directory', chooseDirectory)

  exitLog(funcName, fileName, area)
  return
}
