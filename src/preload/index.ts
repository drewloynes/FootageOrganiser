const { contextBridge, ipcRenderer } = require('electron')

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

// Use `contextBridge` APIs to expose Electron APIs to renderer.
try {
  contextBridge.exposeInMainWorld('electron', {
    chooseDirectory: () => ipcRenderer.invoke('chooseDirectory'),
    addCopyFileRule: (
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
    ) =>
      ipcRenderer.invoke(
        'addCopyFileRule',
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
      ),
    addMirrorRule: (
      ruleName,
      fromStringArray,
      toStringArray,
      copyFilters,
      targetFilters,
      deleteExtrasInTo,
      stopAfterProcessing,
      pauseProcessing
    ) =>
      ipcRenderer.invoke(
        'addMirrorRule',
        ruleName,
        fromStringArray,
        toStringArray,
        copyFilters,
        targetFilters,
        deleteExtrasInTo,
        stopAfterProcessing,
        pauseProcessing
      ),
    deleteRule: (removedRuleName) => ipcRenderer.invoke('deleteRule', removedRuleName),
    modifyCopyFileRule: (
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
    ) =>
      ipcRenderer.invoke(
        'modifyCopyFileRule',
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
      ),
    modifyMirrorRule: (
      oldRuleName,
      ruleName,
      fromStringArray,
      toStringArray,
      copyFilters,
      targetFilters,
      deleteExtrasInTo,
      stopAfterProcessing,
      pauseProcessing
    ) =>
      ipcRenderer.invoke(
        'modifyMirrorRule',
        oldRuleName,
        ruleName,
        fromStringArray,
        toStringArray,
        copyFilters,
        targetFilters,
        deleteExtrasInTo,
        stopAfterProcessing,
        pauseProcessing
      ),
    getRule: (ruleName) => ipcRenderer.invoke('getRule', ruleName),
    getRules: () => ipcRenderer.invoke('getRules'),
    pauseRule: (ruleName) => ipcRenderer.invoke('pauseRule', ruleName),
    unpauseRule: (ruleName) => ipcRenderer.invoke('unpauseRule', ruleName),
    pauseAllRules: () => ipcRenderer.invoke('pauseAllRules'),
    startRule: (ruleName) => ipcRenderer.invoke('startRule', ruleName),
    stopRule: (ruleName) => ipcRenderer.invoke('stopRule', ruleName),
    stopAllRules: () => ipcRenderer.invoke('stopAllRules'),
    getSettings: () => ipcRenderer.invoke('getSettings'),
    updateSettings: (actionCutoffInGBs, autodeleteLogsInDays, checksumMethod, syncTime) =>
      ipcRenderer.invoke(
        'updateSettings',
        actionCutoffInGBs,
        autodeleteLogsInDays,
        checksumMethod,
        syncTime
      ),
    openLogsFolder: () => ipcRenderer.invoke('openLogsFolder'),
    quitFootageOrganiser: () => ipcRenderer.invoke('quitFootageOrganiser')
  })
} catch (error) {
  console.error(error)
}
