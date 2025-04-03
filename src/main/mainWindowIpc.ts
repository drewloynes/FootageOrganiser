import { app, dialog, ipcMain, shell } from 'electron'
import { getMainWindow } from './window'
import path from 'path'
import { DriveInfo } from '@shared/drives/driveInfo'
import { Rules } from '@shared/rules/rules'
import { TypeCopyFileOptions } from '@shared/rules/typeCopyFileOptions'
import { TypeMirrorOptions } from '@shared/rules/typeMirrorOptions'
import { RulePath } from '@shared/rules/rulePath'
import { Rule, RuleType } from '@shared/rules/rule'
import { sendMessageWorker } from './worker/ipc'
import { IpcMessage } from '@shared/utils/ipc'
import { Settings } from '@shared/settings/settings'
import { CheckSumType } from '@shared/utils/checkSum'
import { fillCopyTypeOptions, fillMirrorOptions } from './rule/typeOptions'
import { createRulePathFromStringArray } from './rule/rulePathUtils'
import {
  addRuleStatus,
  extToIntCopyFileRule,
  extToIntMirrorRule,
  extToIntRule,
  getAllRuleStatus,
  intToExtFormat,
  intToExtRuleStatus,
  mergeRuleAndStatus
} from './rule/ruleUtils'
import { extToIntCheckSumMethod, intToExtSettings } from './settings/settingsUtils'

const fileName: string = 'mainWindowIpc.ts'
const area: string = 'main-window'

export function setupMainWindowIpc(): void {
  const funcName: string = 'setupMainWindowIpc'
  entryLog(funcName, fileName, area)

  // Get user to pick a directory - providing volume name and volume path
  ipcMain.handle('chooseDirectory', chooseDirectory)
  // Add a copyfile rule
  ipcMain.handle(
    'addCopyFileRule',
    async (
      _,
      ruleName: string,
      fromStringArray: string[],
      toStringArray: string[],
      copyFilters: object,
      copyFormat: string[],
      customName: string,
      autoCleanFromPath: boolean,
      deleteExtra: boolean,
      deleteExtraPaths: object[],
      stopAfterProcessing: boolean,
      pauseProcessing: boolean
    ) => {
      return await addCopyFileRule(
        ruleName,
        fromStringArray,
        toStringArray,
        copyFilters,
        copyFormat,
        customName,
        autoCleanFromPath,
        deleteExtra,
        deleteExtraPaths,
        stopAfterProcessing,
        pauseProcessing
      )
    }
  )
  // Add a copyfile rule
  ipcMain.handle(
    'addMirrorRule',
    async (
      _,
      ruleName: string,
      fromStringArray: string[],
      toStringArray: string[],
      copyFilters: object,
      targetFilters: object,
      deleteExtrasInTo: boolean,
      stopAfterProcessing: boolean,
      pauseProcessing: boolean
    ) => {
      return await addMirrorRule(
        ruleName,
        fromStringArray,
        toStringArray,
        copyFilters,
        targetFilters,
        deleteExtrasInTo,
        stopAfterProcessing,
        pauseProcessing
      )
    }
  )
  // Delete a rule
  ipcMain.handle('deleteRule', async (_, removedRuleName) => {
    return await deleteRule(removedRuleName)
  })
  // Edit a Copy File rule
  ipcMain.handle(
    'modifyCopyFileRule',
    async (
      _,
      oldRuleName: string,
      ruleName: string,
      fromStringArray: string[],
      toStringArray: string[],
      copyFilters: object,
      copyFormat: string[],
      customName: string,
      autoCleanFromPath: boolean,
      deleteExtra: boolean,
      deleteExtraPaths: object[],
      stopAfterProcessing: boolean,
      pauseProcessing: boolean
    ) => {
      return await modifyCopyFileRule(
        oldRuleName,
        ruleName,
        fromStringArray,
        toStringArray,
        copyFilters,
        copyFormat,
        customName,
        autoCleanFromPath,
        deleteExtra,
        deleteExtraPaths,
        stopAfterProcessing,
        pauseProcessing
      )
    }
  )
  // Edit a Mirror rule
  ipcMain.handle(
    'modifyMirrorRule',
    async (
      _,
      oldRuleName: string,
      ruleName: string,
      fromStringArray: string[],
      toStringArray: string[],
      copyFilters: object,
      targetFilters: object,
      deleteExtrasInTo: boolean,
      stopAfterProcessing: boolean,
      pauseProcessing: boolean
    ) => {
      return await modifyMirrorRule(
        oldRuleName,
        ruleName,
        fromStringArray,
        toStringArray,
        copyFilters,
        targetFilters,
        deleteExtrasInTo,
        stopAfterProcessing,
        pauseProcessing
      )
    }
  )
  // Get all info of a rule
  ipcMain.handle('getRule', async (_, ruleName: string) => {
    return await getRule(ruleName)
  })
  // Get current rules
  ipcMain.handle('getRules', getRules)
  // Pause rule
  ipcMain.handle('pauseRule', async (_, ruleName: string) => {
    return await pauseRule(ruleName)
  })
  // Unpause rule
  ipcMain.handle('unpauseRule', async (_, ruleName: string) => {
    return await unpauseRule(ruleName)
  })
  // Pause all rules
  ipcMain.handle('pauseAllRules', pauseAllRules)
  // Start rule
  ipcMain.handle('startRule', async (_, ruleName: string) => {
    return await startRule(ruleName)
  })
  // Stop rule
  ipcMain.handle('stopRule', async (_, ruleName: string) => {
    return await stopRule(ruleName)
  })
  // Stop all rules
  ipcMain.handle('stopAllRules', stopAllRules)
  // Get Settings
  ipcMain.handle('getSettings', getSettings)
  // Update Settings
  ipcMain.handle(
    'updateSettings',
    async (
      _,
      actionCutoffInGBs: number,
      autodeleteLogsInDays: number,
      checksumMethod: CheckSumType,
      syncTime: number
    ) => {
      return await updateSettings(actionCutoffInGBs, autodeleteLogsInDays, checksumMethod, syncTime)
    }
  )
  // Open logs folder
  ipcMain.handle('openLogsFolder', openLogsFolder)
  // Quit
  ipcMain.handle('quitFootageOrganiser', quitFootageOrganiser)

  exitLog(funcName, fileName, area)
  return
}

async function chooseDirectory(): Promise<string[]> {
  const funcName: string = 'chooseDirectory'
  entryLog(funcName, fileName, area)

  const window: Electron.BrowserWindow | undefined = getMainWindow()
  let volumeNameAndPath: string[] = []
  if (window) {
    condLog(`Window is found`, funcName, fileName, area)
    const { canceled, filePaths } = await dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    })
    if (!canceled) {
      condLog(`Dialog was not canceled`, funcName, fileName, area)
      // Get the current DriveInfo - Then match a path to get the drive info for the path
      await DriveInfo.updateCurrentDriveInfo()
      const driveInfo: DriveInfo | undefined = DriveInfo.getDriveInfoFromPath(filePaths[0])
      if (driveInfo) {
        condLog(`DriveInfo found found path`, funcName, fileName, area)
        volumeNameAndPath = [driveInfo.volumeName, filePaths[0].slice(driveInfo.mount.length)]
      }
    }
  }

  exitLog(funcName, fileName, area)
  return volumeNameAndPath
}

async function addCopyFileRule(
  ruleName: string,
  fromStringArray: string[],
  toStringArray: string[],
  copyFilters: object,
  copyFormat: string[],
  customName: string,
  autoCleanFromPath: boolean,
  deleteExtra: boolean,
  deleteExtraPaths: object[],
  stopAfterProcessing: boolean,
  pauseProcessing: boolean
): Promise<void> {
  const funcName: string = 'addRule'
  entryLog(funcName, fileName, area)

  const rules: Rules | undefined = await Rules.loadRules()
  if (rules) {
    condLog(`Current rules found`, funcName, fileName, area)

    const newRule: Rule = extToIntCopyFileRule(
      ruleName,
      fromStringArray,
      toStringArray,
      copyFilters,
      copyFormat,
      customName,
      autoCleanFromPath,
      deleteExtra,
      deleteExtraPaths,
      stopAfterProcessing,
      pauseProcessing
    )
    await rules.addRule(newRule)
    const message = new IpcMessage('rule-added', ruleName)
    sendMessageWorker(message)
  }

  exitLog(funcName, fileName, area)
  return
}

async function addMirrorRule(
  ruleName: string,
  fromStringArray: string[],
  toStringArray: string[],
  copyFilters: object,
  targetFilters: object,
  cleanTarget: boolean,
  stopAfterProcessing: boolean,
  pauseProcessing: boolean
): Promise<void> {
  const funcName: string = 'addRule'
  entryLog(funcName, fileName, area)

  const rules: Rules | undefined = await Rules.loadRules()
  if (rules) {
    condLog(`Current rules found`, funcName, fileName, area)
    const newRule: Rule = extToIntMirrorRule(
      ruleName,
      fromStringArray,
      toStringArray,
      copyFilters,
      targetFilters,
      cleanTarget,
      stopAfterProcessing,
      pauseProcessing
    )
    await rules.addRule(newRule)
    const message = new IpcMessage('rule-added', ruleName)
    sendMessageWorker(message)
  }

  exitLog(funcName, fileName, area)
  return
}

async function deleteRule(removedRuleName: string): Promise<void> {
  const funcName: string = 'deleteRule'
  entryLog(funcName, fileName, area)

  const rules: Rules | undefined = await Rules.loadRules()
  if (rules) {
    condLog(`Current rules found`, funcName, fileName, area)
    await rules.removeRule(removedRuleName)
    const message = new IpcMessage('rule-deleted', removedRuleName)
    sendMessageWorker(message)
  }

  exitLog(funcName, fileName, area)
  return
}

async function modifyCopyFileRule(
  oldRuleName: string,
  ruleName: string,
  fromStringArray: string[],
  toStringArray: string[],
  copyFilters: object,
  copyFormat: string[],
  customName: string,
  autoCleanFromPath: boolean,
  deleteExtra: boolean,
  deleteExtraPaths: object[],
  stopAfterProcessing: boolean,
  pauseProcessing: boolean
): Promise<void> {
  const funcName: string = 'modifyCopyFileRule'
  entryLog(funcName, fileName, area)

  const rules: Rules | undefined = await Rules.loadRules()
  if (rules) {
    condLog(`Current rules found`, funcName, fileName, area)
    const newRule: Rule = extToIntCopyFileRule(
      ruleName,
      fromStringArray,
      toStringArray,
      copyFilters,
      copyFormat,
      customName,
      autoCleanFromPath,
      deleteExtra,
      deleteExtraPaths,
      stopAfterProcessing,
      pauseProcessing
    )
    await rules.modifyRule(oldRuleName, newRule)
    const message = new IpcMessage('rule-changed', oldRuleName)
    sendMessageWorker(message)
  }

  exitLog(funcName, fileName, area)
  return
}

async function modifyMirrorRule(
  oldRuleName: string,
  ruleName: string,
  fromStringArray: string[],
  toStringArray: string[],
  copyFilters: object,
  targetFilters: object,
  cleanTarget: boolean,
  stopAfterProcessing: boolean,
  pauseProcessing: boolean
): Promise<void> {
  const funcName: string = 'modifyMirrorRule'
  entryLog(funcName, fileName, area)

  const rules: Rules | undefined = await Rules.loadRules()
  if (rules) {
    condLog(`Current rules found`, funcName, fileName, area)
    const newRule: Rule = extToIntMirrorRule(
      ruleName,
      fromStringArray,
      toStringArray,
      copyFilters,
      targetFilters,
      cleanTarget,
      stopAfterProcessing,
      pauseProcessing
    )
    await rules.modifyRule(oldRuleName, newRule)
    const message = new IpcMessage('rule-changed', oldRuleName)
    sendMessageWorker(message)
  }

  exitLog(funcName, fileName, area)
  return
}

async function getRule(ruleName: string): Promise<object | undefined> {
  const funcName: string = 'getRule'
  entryLog(funcName, fileName, area)

  let extRule: object | undefined = undefined
  let extRuleWithStatus: object | undefined = undefined
  const rules: Rules | undefined = await Rules.loadRules()
  if (rules) {
    condLog(`Current rules found`, funcName, fileName, area)
    const intRule = rules.getRule(ruleName)
    if (intRule) {
      extRule = intToExtFormat(intRule)
      extRuleWithStatus = await addRuleStatus(extRule)
    }
  }

  exitLog(funcName, fileName, area)
  return extRuleWithStatus
}

async function getRules(): Promise<object[]> {
  const funcName: string = 'getRules'
  entryLog(funcName, fileName, area)

  const extRulesList: object[] = []
  const rules: Rules | undefined = await Rules.loadRules()
  if (rules) {
    condLog(`Current rules found`, funcName, fileName, area)
    const intRulesList = rules.getRuleList()
    const intRuleStatusAll = await getAllRuleStatus()
    for (const intRule of intRulesList) {
      const extRule = intToExtFormat(intRule)
      const intRuleStatus = intRuleStatusAll.ruleStatusList.find(
        (ruleStatus) => ruleStatus.name === intRule.getName()
      )
      const extRuleStatus = intToExtRuleStatus(intRuleStatus)
      const extRuleWithStatus = mergeRuleAndStatus(extRule, extRuleStatus)
      extRulesList.push(extRuleWithStatus)
    }
  }

  exitLog(funcName, fileName, area)
  return extRulesList
}

async function pauseRule(ruleName: string) {
  const funcName: string = 'pauseRule'
  entryLog(funcName, fileName, area)

  const rules: Rules | undefined = await Rules.loadRules()
  if (rules) {
    await rules.pauseRule(ruleName)
    const message = new IpcMessage('rule-changed', ruleName)
    sendMessageWorker(message)
  }

  exitLog(funcName, fileName, area)
  return
}

async function unpauseRule(ruleName: string) {
  const funcName: string = 'unpauseRule'
  entryLog(funcName, fileName, area)

  const rules: Rules | undefined = await Rules.loadRules()
  if (rules) {
    await rules.pauseRule(ruleName, false)
    const message = new IpcMessage('rule-changed', ruleName)
    sendMessageWorker(message)
  }

  exitLog(funcName, fileName, area)
  return
}

async function pauseAllRules() {
  const funcName: string = 'pauseAllRules'
  entryLog(funcName, fileName, area)

  const rules: Rules | undefined = await Rules.loadRules()
  if (rules) {
    await rules.pauseAllRules()
    const message = new IpcMessage('all-rules-changed', undefined)
    sendMessageWorker(message)
  }

  exitLog(funcName, fileName, area)
  return
}

async function startRule(ruleName: string) {
  const funcName: string = 'startRule'
  entryLog(funcName, fileName, area)

  const message = new IpcMessage('start-rule', ruleName)
  sendMessageWorker(message)

  exitLog(funcName, fileName, area)
  return
}

async function stopRule(ruleName: string) {
  const funcName: string = 'stopRule'
  entryLog(funcName, fileName, area)

  const message = new IpcMessage('stop-rule', ruleName)
  sendMessageWorker(message)

  exitLog(funcName, fileName, area)
  return
}

async function stopAllRules() {
  const funcName: string = 'stopAllRules'
  entryLog(funcName, fileName, area)

  const rules: Rules | undefined = await Rules.loadRules()
  if (rules) {
    for (const rule of rules.getRuleList()) {
      const message = new IpcMessage('stop-rule', rule.getName())
      sendMessageWorker(message)
    }
  }

  exitLog(funcName, fileName, area)
  return
}

async function getSettings(): Promise<object> {
  const funcName: string = 'getSettings'
  entryLog(funcName, fileName, area)

  const settings = await Settings.loadSettings()
  const extSettings = intToExtSettings(settings)

  exitLog(funcName, fileName, area)
  return extSettings
}

async function updateSettings(
  actionCutoffInGBs: number,
  autodeleteLogsInDays: number,
  checksumMethod: CheckSumType,
  syncTime: number
) {
  const funcName: string = 'updateSettings'
  entryLog(funcName, fileName, area)

  const updatedSettings = new Settings(
    actionCutoffInGBs,
    autodeleteLogsInDays,
    extToIntCheckSumMethod(checksumMethod),
    syncTime
  )
  await updatedSettings.saveSettings()
  const message = new IpcMessage('settings-changed', undefined)
  sendMessageWorker(message)

  exitLog(funcName, fileName, area)
  return
}

async function openLogsFolder() {
  const funcName: string = 'openLogsFolder'
  entryLog(funcName, fileName, area)

  const logsPath = path.join(app.getPath('userData'), 'logs')
  await shell.openPath(logsPath).then((error) => {
    if (error) {
      errorLog('Problem opening logs folder', funcName, fileName, area)
    }
  })

  exitLog(funcName, fileName, area)
  return
}

async function quitFootageOrganiser() {
  const funcName: string = 'quitFootageOrganiser'
  entryLog(funcName, fileName, area)

  debugLog('Quit Footage Organiser', funcName, fileName, area)
  app.quit()

  exitLog(funcName, fileName, area)
  return
}
