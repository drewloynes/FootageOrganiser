import { Alert } from '@shared/types/alert'
import { FullRule, ShortRule, StoreRule } from '@shared/types/ruleTypes'
import { StoreSettings } from '@shared/types/settingsTypes'

import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

// Use `contextBridge` APIs to expose Electron APIs to renderer.
try {
  contextBridge.exposeInMainWorld('electron', {
    // Main -> Renderer callbacks
    onAlert: (callback: (value: Alert) => void) =>
      ipcRenderer.on('alert', (_event, value) => callback(value)),
    removeListenerAlert: (callback: (value: Alert) => void) =>
      ipcRenderer.removeListener('alert', (_event, value) => callback(value)),
    removeAllListenersAlert: () => ipcRenderer.removeAllListeners('alert'),

    onAllRules: (callback: (value: ShortRule[]) => void) =>
      ipcRenderer.on('all-rules', (_event, value) => callback(value)),
    removeListenerAllRules: (callback: (value: ShortRule[]) => void) =>
      ipcRenderer.removeListener('all-rules', (_event, value) => callback(value)),
    removeAllListenersAllRules: () => ipcRenderer.removeAllListeners('all-rules'),

    onRule: (callback: (value: FullRule) => void) =>
      ipcRenderer.on('rule', (_event, value) => callback(value)),
    removeListenerRule: (callback: (value: FullRule) => void) =>
      ipcRenderer.removeListener('rule', (_event, value) => callback(value)),
    removeAllListenersRule: () => ipcRenderer.removeAllListeners('rule'),

    // Renderer -> Main one-way async
    addRule: (newRule: StoreRule) => ipcRenderer.send('add-rule', newRule),
    modifyRule: (oldRuleName: string, newRule: StoreRule) =>
      ipcRenderer.send('modify-rule', oldRuleName, newRule),
    deleteRule: (removeRuleName: string) => ipcRenderer.send('delete-rule', removeRuleName),
    startRule: (ruleName: string) => ipcRenderer.send('start-rule', ruleName),
    stopRule: (ruleName: string) => ipcRenderer.send('stop-rule', ruleName),
    stopAllRules: () => ipcRenderer.send('stop-all-rules'),
    activateRule: (ruleName: string) => ipcRenderer.send('activate-rule', ruleName),
    disableRule: (ruleName: string) => ipcRenderer.send('disable-rule', ruleName),
    disableAllRules: () => ipcRenderer.send('disable-all-rules'),
    evaluateAllRules: () => ipcRenderer.send('evaluate-all-rules'),

    startRuleStream: (ruleName: string) => ipcRenderer.send('start-rule-stream', ruleName),
    stopRuleStream: (ruleName: string) => ipcRenderer.send('stop-rule-stream', ruleName),
    stopEveryRuleStream: () => ipcRenderer.send('stop-every-rule-stream'),
    startAllRulesStream: () => ipcRenderer.send('start-all-rules-stream'),
    stopAllRulesStream: () => ipcRenderer.send('stop-all-rules-stream'),

    modifySettings: (newSettings: StoreSettings) =>
      ipcRenderer.send('modify-settings', newSettings),

    openLogsFolder: () => ipcRenderer.send('open-logs-folder'),
    quit: () => ipcRenderer.send('quit'),

    // Renderer -> Main two-way sync
    getRule: (ruleName: string) => ipcRenderer.invoke('get-rule', ruleName),
    getAllRules: () => ipcRenderer.invoke('get-all-rules'),

    getSettings: () => ipcRenderer.invoke('get-settings'),

    chooseDirectory: () => ipcRenderer.invoke('choose-directory')
  })
} catch (error) {
  console.error(error)
}
